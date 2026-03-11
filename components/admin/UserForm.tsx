'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, X } from 'lucide-react'
import { User, UpdateUserRequest } from '@/lib/api/admin'
import { signup } from '@/lib/api/auth'
import { updateUser } from '@/lib/api/admin'

interface UserFormProps {
  user?: User | null
  onClose: () => void
  onSubmit: (data: UpdateUserRequest & { email?: string; password?: string }) => Promise<void>
}

export function UserForm({ user, onClose, onSubmit }: UserFormProps) {
  const isEditing = !!user
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'paid' | 'premium'>('free')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setEmail(user.email)
      setRole(user.role as 'user' | 'admin')
      setSubscriptionStatus(user.subscription_status as 'free' | 'paid' | 'premium')
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (isEditing) {
        // Update existing user
        const updates: UpdateUserRequest = {
          role,
          subscription_status: subscriptionStatus,
        }
        if (email !== user.email) {
          updates.email = email
        }
        await onSubmit(updates)
      } else {
        // Create new user via signup, then update role if needed
        if (!email || !password) {
          setError('Email and password are required')
          setIsLoading(false)
          return
        }

        try {
          // First create the user
          await signup({ email, password })
          
          // If admin role is selected, we need to update the user
          // Note: This requires fetching the user list to get the new user's ID
          // For now, we'll just show success and let the admin update the role manually
          // In a production app, you'd want a better flow
          if (role === 'admin') {
            setError('User created. Please refresh and update the role to admin manually.')
          }
          
          await onSubmit({ email, password, role, subscription_status: subscriptionStatus })
        } catch (err: any) {
          setError(err.message || 'Failed to create user')
          setIsLoading(false)
          return
        }
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{isEditing ? 'Edit User' : 'Create User'}</CardTitle>
            <CardDescription>
              {isEditing ? 'Update user information and permissions' : 'Create a new user account'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="border-terminal-border bg-terminal-bg"
            />
          </div>
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isEditing}
                minLength={8}
                disabled={isLoading}
                className="border-terminal-border bg-terminal-bg"
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with at least one letter and one number
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as 'user' | 'admin')} disabled={isLoading}>
              <SelectTrigger className="border-terminal-border bg-terminal-bg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            {role === 'admin' && (
              <p className="text-xs text-amber-400">
                Admin users have full access to all features and can manage other users.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="subscription">Subscription Status</Label>
            <Select
              value={subscriptionStatus}
              onValueChange={(value) => setSubscriptionStatus(value as 'free' | 'paid' | 'premium')}
              disabled={isLoading}
            >
              <SelectTrigger className="border-terminal-border bg-terminal-bg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update User' : 'Create User'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
