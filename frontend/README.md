# Leaderboard Frontend

React-based frontend for the leaderboard system, featuring real-time data visualization and interactive filtering.

## Features

- Real-time score updates
- Interactive data grid with sorting
- Player search functionality
- Responsive design
- Division-based color coding
- Pagination system

## Tech Stack

- React 18
- Vite
- TanStack Query
- Tailwind CSS
- Axios
- Lucide React

## Project Structure

```
src/
├── components/
│   ├── LeaderboardTable.jsx   # Main leaderboard component
│   ├── LeaderboardHeader.jsx  # Header with search and controls
│   ├── Pagination.jsx         # Page navigation
│   ├── SearchBar.jsx          # Stage ID search
│   ├── TableData.jsx          # Row component
│   └── ImportButton.jsx       # Data import control
├── hooks/
│   └── useLeaderboardAPI.js   # API integration hooks
├── util/
│   └── util.js               # Utility functions
└── App.jsx                   # Root component
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_BASE_API_URL=http://localhost:5001/your-project/region/api
```

3. Start development server:
```bash
npm run dev
```

Access the application at `http://localhost:5173`

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test            # Run tests
```

## Component Usage

### LeaderboardTable
```jsx
<LeaderboardTable initialStageId="stage123" />
```

### ImportButton
```jsx
<ImportButton onSuccess={() => refetchData()} />
```