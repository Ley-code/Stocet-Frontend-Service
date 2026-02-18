'use client'

import { useState } from 'react'
import { lessonsData } from '@/lib/mock-data'
import { CourseCard } from '@/components/education/CourseCard'
import { LessonSidebar } from '@/components/education/LessonSidebar'
import { LessonViewer } from '@/components/education/LessonViewer'
import { QuizComponent } from '@/components/education/QuizComponent'
import { GlossaryPanel } from '@/components/education/GlossaryPanel'
import { Course, Lesson } from '@/lib/mock-data'

export default function EducationPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [showQuiz, setShowQuiz] = useState(false)

  const currentLesson = selectedCourse?.lessons.find((l) => l.id === currentLessonId) || null
  const progress = selectedCourse
    ? ((completedLessons.length + (currentLessonId ? 1 : 0)) / selectedCourse.lessons.length) * 100
    : 0

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
    setCurrentLessonId(course.lessons[0]?.id || null)
    setShowQuiz(false)
  }

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId)
    setShowQuiz(false)
  }

  const handleQuizComplete = (score: number) => {
    if (score >= 70 && currentLessonId) {
      setCompletedLessons([...completedLessons, currentLessonId])
    }
  }

  if (selectedCourse && currentLesson) {
    return (
      <div className="flex h-[calc(100vh-200px)]">
        <LessonSidebar
          course={selectedCourse}
          currentLessonId={currentLessonId}
          onLessonSelect={handleLessonSelect}
          completedLessons={completedLessons}
        />
        <div className="flex-1 overflow-y-auto p-6">
          {!showQuiz ? (
            <>
              <LessonViewer lesson={currentLesson} progress={progress} />
              <div className="mt-6">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Take Quiz
                </button>
              </div>
            </>
          ) : (
            <QuizComponent quiz={currentLesson.quiz} onComplete={handleQuizComplete} />
          )}
        </div>
        <div className="w-64 border-l border-terminal-border p-6">
          <GlossaryPanel />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Education</h1>
        <p className="text-muted-foreground">Learn about capital markets and trading</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessonsData.courses.map((course) => (
          <CourseCard key={course.id} course={course} onClick={() => handleCourseSelect(course)} />
        ))}
      </div>
    </div>
  )
}
