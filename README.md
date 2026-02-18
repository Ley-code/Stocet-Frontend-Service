# Stocet - Ethiopian Capital Markets Terminal

A Bloomberg-style Ethiopian capital markets data terminal and education platform built with Next.js.

## Features

- **Dashboard**: Market overview, indices, top gainers/losers, volume charts, and watchlist
- **Market Data**: Comprehensive stock table with filtering, sorting, and detailed stock panels
- **Analytics**: Price charts, sector distribution, market heatmap, technical indicators, and stock comparison
- **Education**: Interactive courses with lessons, quizzes, and glossary
- **Brokers**: Directory of licensed brokers with filtering and detailed information
- **Community Chat**: Slack-like chat interface with multiple channels
- **Alerts**: Create and manage price and volume alerts

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Recharts
- Zustand
- Docker

## Running with Docker

### Build and run with Docker Compose

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`

### Build Docker image manually

```bash
docker build -t stocet .
docker run -p 3000:3000 stocet
```

## Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Setup

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for production

```bash
npm run build
npm start
```

## Project Structure

- `app/` - Next.js App Router pages
- `components/` - React components organized by feature
- `lib/` - Utilities, mock data, and state management
- `data/` - Mock JSON data files
- `public/` - Static assets

## Keyboard Shortcuts

- `Cmd/Ctrl + K` - Open command palette
- `G + D` - Go to Dashboard
- `G + M` - Go to Market Data
- `G + A` - Go to Analytics
- `G + E` - Go to Education
- `G + B` - Go to Brokers
- `G + C` - Go to Chat
- `G + L` - Go to Alerts

## License

MIT
