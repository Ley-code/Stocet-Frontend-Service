'use client'

import { ChannelList } from '@/components/chat/ChannelList'
import { MessageThread } from '@/components/chat/MessageThread'
import { ChatInput } from '@/components/chat/ChatInput'

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-200px)]">
      <ChannelList />
      <div className="flex flex-1 flex-col">
        <MessageThread />
        <ChatInput />
      </div>
    </div>
  )
}
