import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import WorkoutTracker from './pages/WorkoutTracker';
import HabitTracker from './pages/HabitTracker';
import Goals from './pages/Goals';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workouts" element={<WorkoutTracker />} />
          <Route path="/habits" element={<HabitTracker />} />
          <Route path="/goals" element={<Goals />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
