export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  unit: 'kg' | 'lbs';
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number; // minutes
  exercises: Exercise[];
  notes: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  targetDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat (for weekly)
  completedDates: string[]; // ISO date strings
  createdAt: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'strength' | 'cardio' | 'weight' | 'habit' | 'other';
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  createdAt: string;
  completed: boolean;
}
