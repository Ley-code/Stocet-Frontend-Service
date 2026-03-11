'use client'

import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { UserList } from '@/components/admin/UserList'

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>
        <UserList />
      </div>
    </ProtectedRoute>
  )
}
