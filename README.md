
# WasteWise - Smart Waste Classification System

WasteWise is an AI-powered web application that helps users classify waste items and provides recycling recommendations.

## Features

- AI-powered waste classification
- Real-time image analysis
- Recycling recommendations
- Nearby recycling center locator
- Learning resources for sustainable waste management

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Express.js
- AI: TensorFlow.js
- UI: Tailwind CSS + Shadcn/ui
- Database: SQLite with Drizzle ORM

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Express.js backend
├── db/             # Database configuration and seeds
└── shared/         # Shared TypeScript types
```

## Getting Started

1. Clone the repository on Replit
2. Install dependencies:
   ```bash
   npm install
   ```

3. The application will automatically start using the "Start application" workflow, which runs:
   ```bash
   npm run dev
   ```

4. The application will be available at port 5000.

## Main Components

- **Scan Page**: Upload images for waste classification
- **Learning Center**: Educational resources about recycling
- **Recycling Centers**: Find nearby recycling facilities
- **About**: Information about the project

## Features in Detail

### Waste Classification
- Uses TensorFlow.js for image analysis
- Provides detailed classification results
- Shows recyclability score and disposal instructions

### Recycling Centers
- Interactive map interface
- List of nearby recycling centers
- Filtering by waste type acceptance

### Learning Resources
- Educational content about recycling
- Best practices for waste management
- Environmental impact information

## API Endpoints

The backend provides several API endpoints:

- `/api/recommendations` - Get recycling recommendations
- `/api/centers` - Find recycling centers
- `/api/classify` - Classify waste images

## Development

The project uses Vite for development with hot module replacement (HMR). The development server automatically reloads when changes are made.

## Environment

The application runs on Replit and uses port 5000 for both development and production.
# WasteWise-GSC
