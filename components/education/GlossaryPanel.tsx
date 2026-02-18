'use client'

import { lessonsData } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function GlossaryPanel() {
  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Glossary</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {lessonsData.glossary.map((term, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help rounded-md border border-terminal-border p-2 text-sm hover:bg-muted">
                      <div className="font-semibold">{term.term}</div>
                      <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {term.definition}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{term.definition}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
