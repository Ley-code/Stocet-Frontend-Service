'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock } from 'lucide-react'
import { useAuthContext } from '@/lib/providers/AuthProvider'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login({ email, password })
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-terminal-border bg-terminal-surface">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-terminal-foreground">Welcome Back</CardTitle>
        <CardDescription className="text-terminal-muted">
          Sign in to your STOCET account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-terminal-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-terminal-muted" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 border-terminal-border bg-terminal-bg text-terminal-foreground placeholder:text-terminal-muted"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-terminal-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-terminal-muted" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 border-terminal-border bg-terminal-bg text-terminal-foreground placeholder:text-terminal-muted"
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          <div className="text-sm text-center text-terminal-muted">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
