'use client'

import { Button } from '@/components/ui/button'
import { Edit, Trash2, Loader2 } from 'lucide-react'
import { User } from '@/lib/api/admin'

interface UserActionsProps {
  user: User
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
}

export function UserActions({ user, onEdit, onDelete, isDeleting }: UserActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        className="h-8 w-8 p-0"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        disabled={isDeleting}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
