'use client'

import { useState } from 'react'
import { Lesson } from '@/lib/mock-data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuizComponentProps {
  quiz: Lesson['quiz']
  onComplete: (score: number) => void
}

export function QuizComponent({ quiz, onComplete }: QuizComponentProps) {
  const [answers, setAnswers] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    if (submitted) return
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleSubmit = () => {
    const correct = quiz.questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correct ? 1 : 0)
    }, 0)
    const calculatedScore = Math.round((correct / quiz.questions.length) * 100)
    setScore(calculatedScore)
    setSubmitted(true)
    onComplete(calculatedScore)
  }

  return (
    <Card className="border-terminal-border bg-terminal-surface">
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="space-y-2">
            <h4 className="font-medium">{question.question}</h4>
            <div className="space-y-2">
              {question.options.map((option, oIndex) => {
                const isSelected = answers[qIndex] === oIndex
                const isCorrect = question.correct === oIndex
                const isWrong = submitted && isSelected && !isCorrect

                return (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswer(qIndex, oIndex)}
                    disabled={submitted}
                    className={cn(
                      'w-full rounded-md border p-3 text-left text-sm transition-colors',
                      isSelected && 'border-primary bg-primary/10',
                      submitted && isCorrect && 'border-success bg-success/10',
                      isWrong && 'border-destructive bg-destructive/10',
                      !submitted && 'hover:bg-muted'
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {!submitted ? (
          <Button onClick={handleSubmit} className="w-full">
            Submit Quiz
          </Button>
        ) : (
          <div className="rounded-md border border-terminal-border bg-terminal-surface p-4">
            <div className="text-center">
              <div className="text-2xl font-bold">Score: {score}%</div>
              <div className="mt-2 text-sm text-muted-foreground">
                {score >= 70 ? 'Great job! You passed!' : 'Keep studying and try again!'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
