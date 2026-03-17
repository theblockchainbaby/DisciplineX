# 🏋️ DisciplineX

A modern fitness and discipline tracking web app built with React + TypeScript + Vite.

## Features

- 📊 **Dashboard** — Real-time overview with stats, recent workouts, habit streaks, and goal progress
- 💪 **Workout Tracker** — Log workouts with exercises, sets, reps, and weight. Expandable workout history
- ✅ **Habit Tracker** — Create daily/weekly habits, mark completions, track streaks with 7-day visual grid
- 🎯 **Goals** — Set measurable fitness goals with target dates and track progress with visual progress bars

## Tech Stack

- **React 18** + **TypeScript** — Type-safe component development
- **Vite** — Fast dev server and build tooling
- **React Router v6** — Client-side routing
- **localStorage** — Persistent data storage (no backend required)
- **Inline styles / CSS** — No CSS framework dependencies

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

Output is in the `dist/` folder.

## Project Structure

```
src/
├── App.tsx              # Root app with Router
├── main.tsx             # Entry point
├── index.css            # Global styles
├── components/
│   └── Layout.tsx       # Navigation shell
├── pages/
│   ├── Dashboard.tsx    # Stats overview
│   ├── WorkoutTracker.tsx
│   ├── HabitTracker.tsx
│   └── Goals.tsx
├── hooks/
│   └── useLocalStorage.ts
└── types/
    └── index.ts         # TypeScript interfaces
```
