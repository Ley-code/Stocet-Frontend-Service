'use client'

import { useStore } from '@/lib/store'
import { messagesData } from '@/lib/mock-data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageBubble } from './MessageBubble'

export function MessageThread() {
  const { currentChannel, messages } = useStore()
  const channel = messages.channels.find((c) => c.id === currentChannel)

  if (!channel) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Select a channel to view messages
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-1">
        {channel.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  )
}
