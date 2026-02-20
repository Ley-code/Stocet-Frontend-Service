  # Stage 1: Dependencies
  FROM node:20-slim AS deps
  WORKDIR /app

  # Copy package files
  COPY package.json package-lock.json* ./
  RUN npm ci

  # Stage 2: Builder
  FROM node:20-slim AS builder
  WORKDIR /app

  # Accept build arguments for environment variables
  ARG NEXT_PUBLIC_NEWS_API_URL=http://localhost:8000
  ARG NEXT_PUBLIC_NEWS_API_VERSION=v1

  # Set as environment variables for Next.js build
  ENV NEXT_PUBLIC_NEWS_API_URL=$NEXT_PUBLIC_NEWS_API_URL
  ENV NEXT_PUBLIC_NEWS_API_VERSION=$NEXT_PUBLIC_NEWS_API_VERSION

  # Copy dependencies from deps stage
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .

  # Build the application
  RUN npm run build

  # Stage 3: Runner
  FROM node:20-slim AS runner
  WORKDIR /app

  ENV NODE_ENV production

  # Create non-root user
  RUN addgroup --system --gid 1001 nodejs
  RUN adduser --system --uid 1001 nextjs

  # Copy necessary files from standalone output
  # Next.js standalone includes public directory, but we'll ensure it exists
  COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
  COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

  # Ensure public directory exists (standalone should have it, but create if missing)
  RUN mkdir -p ./public || true

  USER nextjs

  EXPOSE 3000

  ENV PORT 3000
  ENV HOSTNAME "0.0.0.0"

  CMD ["node", "server.js"]
