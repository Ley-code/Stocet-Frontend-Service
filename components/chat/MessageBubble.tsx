'use client'

import { Message } from '@/lib/mock-data'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const initials = message.avatar || message.username.substring(0, 2).toUpperCase()

  return (
    <div className="flex gap-3 px-4 py-2 hover:bg-terminal-surface/50">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold">
        {initials}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{message.username}</span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="text-sm text-foreground">{message.content}</div>
      </div>
    </div>
  )
}
