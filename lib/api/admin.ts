import { APIResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:8080'
const API_VERSION = process.env.NEXT_PUBLIC_CORE_API_VERSION || 'v1'

// Import token management and helpers
import { getAuthToken } from './client'

// Helper to get headers with auth token
function getHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  if (includeAuth) {
    const token = getAuthToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

// ApiError class
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Handle response helper
async function handleResponse<T>(response: Response): Promise<T> {
  const json = await response.json()
  
  if (!response.ok) {
    const errorMessage = json.error || json.message || response.statusText
    throw new ApiError(
      errorMessage || `API Error: ${response.status}`,
      response.status,
      response.statusText
    )
  }

  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    if (!json.success) {
      throw new ApiError(
        json.error || json.message || 'Request failed',
        response.status,
        response.statusText
      )
    }
    return json as T
  }

  return json as T
}

export interface User {
  id: string
  email: string
  role: string
  subscription_status: string
  created_at: string
  updated_at: string
}

export interface UsersListResponseData {
  users: User[]
  total: number
  limit: number
  skip: number
}

export type UsersListResponse = APIResponse<UsersListResponseData>

export interface UpdateUserRequest {
  email?: string
  role?: string
  subscription_status?: string
}

export async function fetchUsers(limit: number = 20, skip: number = 0): Promise<UsersListResponse> {
  const url = `${API_BASE_URL}/api/${API_VERSION}/admin/users?limit=${limit}&skip=${skip}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
    })

    return handleResponse<UsersListResponse>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new ApiError('Unauthorized. Admin access required.', 401, 'Unauthorized')
      }
      throw error
    }
    throw new ApiError(
      `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    )
  }
}

export async function updateUser(id: string, updates: UpdateUserRequest): Promise<APIResponse<User>> {
  const url = `${API_BASE_URL}/api/${API_VERSION}/admin/users/${id}`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(updates),
    })

    return handleResponse<APIResponse<User>>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new ApiError('Unauthorized. Admin access required.', 401, 'Unauthorized')
      }
      throw error
    }
    throw new ApiError(
      `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    )
  }
}

export async function deleteUser(id: string): Promise<void> {
  const url = `${API_BASE_URL}/api/${API_VERSION}/admin/users/${id}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(true),
    })

    if (!response.ok) {
      const json = await response.json().catch(() => ({}))
      const errorMessage = json.error || json.message || response.statusText
      throw new ApiError(
        errorMessage || `Failed to delete user: ${response.status}`,
        response.status,
        response.statusText
      )
    }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new ApiError('Unauthorized. Admin access required.', 401, 'Unauthorized')
      }
      throw error
    }
    throw new ApiError(
      `Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error'
    )
  }
}
