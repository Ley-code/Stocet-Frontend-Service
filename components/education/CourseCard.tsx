'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BookOpen, Clock } from 'lucide-react'
import { Course } from '@/lib/mock-data'

interface CourseCardProps {
  course: Course
  onClick: () => void
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card
      className="cursor-pointer border-terminal-border bg-terminal-surface transition-colors hover:border-primary hover:bg-terminal-surface/80"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{course.title}</CardTitle>
        </div>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div>{course.lessons.length} lessons</div>
        </div>
      </CardContent>
    </Card>
  )
}
