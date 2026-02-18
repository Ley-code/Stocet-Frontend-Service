'use client'

import { Lesson } from '@/lib/mock-data'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface LessonViewerProps {
  lesson: Lesson
  progress: number
}

export function LessonViewer({ lesson, progress }: LessonViewerProps) {
  return (
    <div className="flex-1 space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{lesson.title}</h2>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <Card className="border-terminal-border bg-terminal-surface">
        <CardContent className="prose prose-invert max-w-none p-6">
          <div className="whitespace-pre-line text-sm leading-relaxed">{lesson.content}</div>
        </CardContent>
      </Card>
    </div>
  )
}
