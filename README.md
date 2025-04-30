
# PilaRahan - Smart Waste Classification System

PilaRahan is an AI-powered web application that helps users classify waste items and provides recycling recommendations.

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

## Key Points
- use Vite for development
- use React for frontend
- use Express.js for backend
- use TensorFlow.js for AI
- use node.js (`version 22.10.0`)

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Express.js backend
├── db/             # Database configuration and seeds
└── shared/         # Shared TypeScript types
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. The application will automatically start using the "Start application" workflow, which runs:
   ```bash
   npm run dev
   ```

4. The application will be available at port 5000.

## Environment Variables

This project requires certain environment variables to be set for configuration, particularly for the database connection and session management.

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
2.  Open the newly created `.env` file in your editor.
3.  Replace the placeholder values (like `"YOUR_STRONG_SESSION_SECRET_HERE"` and database credentials) with your actual configuration values.
4.  **Important:** The `.env` file contains sensitive credentials and should **never** be committed to version control. Ensure it is listed in your `.gitignore` file.

The `.env.example` file serves as a template listing all the required variables.


## Development

The project uses Vite for development with hot module replacement (HMR). The development server automatically reloads when changes are made.

## Environment


The application runs on Replit and uses port 5000 for both development and production.
# PilaRahan-GSC
