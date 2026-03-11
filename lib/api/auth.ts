import { AuthResponseWrapper, LoginRequest, SignupRequest, AuthResponse } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:8080'
const API_VERSION = process.env.NEXT_PUBLIC_CORE_API_VERSION || 'v1'

// Import token management functions
import { getAuthToken, setAuthToken, clearAuthToken } from './client'

// Import ApiError and handleResponse - need to define locally or export from client
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

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const url = `${API_BASE_URL}/api/${API_VERSION}/auth/login`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const authResponse = await handleResponse<AuthResponseWrapper>(response)
    
    // Store token if login successful
    if (authResponse.success && authResponse.data.token) {
      setAuthToken(authResponse.data.token)
    }

    return authResponse.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Login Error'
    )
  }
}

export async function signup(credentials: SignupRequest): Promise<AuthResponse> {
  const url = `${API_BASE_URL}/api/${API_VERSION}/auth/signup`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const authResponse = await handleResponse<AuthResponseWrapper>(response)
    
    // Store token if signup successful
    if (authResponse.success && authResponse.data.token) {
      setAuthToken(authResponse.data.token)
    }

    return authResponse.data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      `Signup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Signup Error'
    )
  }
}

export async function logout(): Promise<void> {
  clearAuthToken()
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}
