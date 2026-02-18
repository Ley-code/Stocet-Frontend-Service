'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

export function ChatInput() {
  const [message, setMessage] = useState('')
  const { currentChannel, addMessage } = useStore()

  const handleSend = () => {
    if (message.trim()) {
      addMessage(currentChannel, {
        userId: 'current-user',
        username: 'You',
        avatar: 'YO',
        content: message,
      })
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-terminal-border bg-terminal-surface p-4">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={handleSend} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
