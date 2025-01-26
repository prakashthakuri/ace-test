# Leaderboard System

A full-stack leaderboard system built with React and Firebase Cloud Functions for managing competitive gaming scores. The system fetches data from an external API, stores it in Firestore, and provides a responsive interface for viewing and filtering leaderboard data.

## Overview
- Frontend built with React and TanStack Query
- Backend powered by Firebase Cloud Functions
- Real-time data synchronization
- Responsive design for mobile and desktop
- Comprehensive search and filtering capabilities

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── hooks/           # Custom hooks
│   │   └── util/            # Utility functions
└── functions/
    ├── functions-route/     # Firebase Cloud Functions
    └── util/                # Backend utilities
```

## Features

- Real-time leaderboard data fetching and display
- Sorting by multiple columns (Hit Factor, Time, Player Name, Division)
- Player search functionality 
- Pagination system
- Responsive design
- Division rank color coding
- Data import from external API
- Firebase Cloud Functions for backend operations

## Technology Stack

### Frontend
- React
- TanStack Query (React Query)
- Tailwind CSS
- Lucide React Icons
- Axios

### Backend
- Firebase Cloud Functions
- Firebase Firestore
- Node.js
- Express (CORS middleware)


## API Endpoints

### GET /getLeaderboard
Fetches leaderboard data for a specific stage.
- Query params: `stageId` (required)
- Returns: Stage details and associated scores

### GET /fetchLeaderboard
Imports leaderboard data from external API with timeout handling.
- Implementation:
  - 10-second execution window with 1-second buffer
  - Batched Firestore operations for efficiency
  - Returns partial results if timeout approached
- Response format:
```json
{
  "message": "Process completed",
  "status": "partial" | "complete",
  "processedStages": number,
  "totalStages": number,
  "timeElapsed": number
}
```

### GET /getAllStageIds
Retrieves available stage IDs from Firestore.
- Implementation:
  - Paginates results (default: 20 per page)
  - Supports cursor-based navigation
- Query params:
  - `cursor`: Last stageId from previous page
  - `limit`: Number of results per page
- Response format:
```json
{
  "stageIds": string[],
  "nextCursor": string | null,
  "totalCount": number
}
```

## Data Flow
1. External API Data Fetching:
   - Fetches leaderboard data with 3s timeout
   - Processes stages until 10s timeout
   - Uses chunked score fetching (50 scores per request)

2. Firestore Storage:
   - Batched writes for efficiency
   - Stores stage metadata and scores separately
   - Updates timestamps for cache invalidation

3. Frontend Implementation:
   - TanStack Query for data fetching
   - Optimistic updates
   - Background polling
   - Error retry logic

   
## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/leaderboard-system.git
cd leaderboard-system
```

2. Install Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
```

3. Install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd functions
npm install
```

2. Configure environment variables:
```
# Frontend (.env)
VITE_BASE_API_URL=your_firebase_functions_url

# Backend (firebaseInit.js)
Configure Firebase credentials
```

3. Start development servers:
```bash
# Frontend
npm run dev

# Backend (Firebase Emulator)
cd functions
firebase emulators:start --only functions,firestore

# Access Firebase Emulator UI
Open http://localhost:4000
```

## API Endpoints

### GET /getLeaderboard
Fetches leaderboard data for a specific stage.
- Query params: `stageId` (required)
- Returns: Stage details and associated scores

### GET /fetchLeaderboard
Imports leaderboard data from external API.
- Returns: Success message with scores count

### GET /getAllStageIds
Retrieves all available stage IDs.
- Returns: Array of stage IDs and total count

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

```bash
# Deploy Firebase Functions
npm run deploy
```

## Component Documentation

### LeaderboardTable
Main component that handles:
- Data fetching and state management
- Sorting and filtering
- Pagination
- Search functionality

### SearchBar
Handles stage ID input and search initiation.

### LeaderboardHeader
Displays:
- Stage name
- Threshold values
- Player count
- Player search
- Refresh button

### TableData
Renders individual score entries with:
- Position
- Player name
- Division rank (color-coded)
- Hit Factor
- Time

### Pagination
Handles page navigation with:
- Previous/Next buttons
- Current page indicator
- Dynamic page count

## Code Style

The project follows the Google JavaScript Style Guide and uses ESLint for code quality. Formatting rules are defined in `.eslintrc.js`.