'use client'

import { Course, Lesson } from '@/lib/mock-data'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface LessonSidebarProps {
  course: Course
  currentLessonId: string | null
  onLessonSelect: (lessonId: string) => void
  completedLessons: string[]
}

export function LessonSidebar({
  course,
  currentLessonId,
  onLessonSelect,
  completedLessons,
}: LessonSidebarProps) {
  return (
    <div className="w-64 border-r border-terminal-border bg-terminal-surface">
      <div className="p-4">
        <h3 className="font-semibold">{course.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-1 p-4">
          {course.lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => onLessonSelect(lesson.id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                currentLessonId === lesson.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                {index + 1}
              </span>
              <span className="flex-1">{lesson.title}</span>
              {completedLessons.includes(lesson.id) && (
                <Check className="h-4 w-4 text-success" />
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
