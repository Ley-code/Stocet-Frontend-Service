'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUsers, deleteUser, updateUser, type User, type UpdateUserRequest } from '@/lib/api/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UserForm } from './UserForm'
import { UserActions } from './UserActions'
import { Shield, User as UserIcon, Loader2, Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function UserList() {
  const [page, setPage] = useState(0)
  const [limit] = useState(20)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'users', page, limit],
    queryFn: async () => {
      const response = await fetchUsers(limit, page * limit)
      return response.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateUserRequest }) =>
      updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      setEditingUser(null)
    },
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (err) {
        console.error('Failed to delete user:', err)
      }
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setShowCreateForm(false)
  }

  const handleCreate = () => {
    setShowCreateForm(true)
    setEditingUser(null)
  }

  const handleCloseForm = () => {
    setEditingUser(null)
    setShowCreateForm(false)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load users'}
        </AlertDescription>
      </Alert>
    )
  }

  const users = data?.users || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Users ({total})</h2>
          <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      {(showCreateForm || editingUser) && (
        <UserForm
          user={editingUser}
          onClose={handleCloseForm}
          onSubmit={async (formData) => {
            if (editingUser) {
              await updateMutation.mutateAsync({ id: editingUser.id, updates: formData })
            } else {
              // For creating new users, we'll need to use signup endpoint
              // This is handled in UserForm
              handleCloseForm()
            }
          }}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? (
                        <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <UserIcon className="h-3 w-3 mr-1" />
                          User
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.subscription_status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <UserActions
                        user={user}
                        onEdit={() => handleEdit(user)}
                        onDelete={() => handleDelete(user.id)}
                        isDeleting={deleteMutation.isPending}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="flex items-center text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
