'use client'

import { useStore } from '@/lib/store'
import { messagesData } from '@/lib/mock-data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Hash } from 'lucide-react'

export function ChannelList() {
  const { currentChannel, setCurrentChannel } = useStore()

  return (
    <div className="w-64 border-r border-terminal-border bg-terminal-surface">
      <div className="p-4">
        <h3 className="font-semibold">Channels</h3>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-1 p-2">
          {messagesData.channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setCurrentChannel(channel.id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                currentChannel === channel.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Hash className="h-4 w-4" />
              {channel.displayName}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
