import React from 'react';
import { Link } from 'react-router-dom';
import type { Workout, Habit, Goal } from '../types';

const Dashboard: React.FC = () => {
  const workouts: Workout[] = JSON.parse(localStorage.getItem('dx_workouts') || '[]');
  const habits: Habit[] = JSON.parse(localStorage.getItem('dx_habits') || '[]');
  const goals: Goal[] = JSON.parse(localStorage.getItem('dx_goals') || '[]');

  const today = new Date().toISOString().split('T')[0];
  const thisWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });

  const habitsCompletedToday = habits.filter(h => h.completedDates.includes(today)).length;
  const goalsCompleted = goals.filter(g => g.completed).length;
  const workoutsThisWeek = workouts.filter(w => thisWeek.includes(w.date)).length;
  const activeGoals = goals.filter(g => !g.completed).length;

  const recentWorkouts = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  const getHabitStreak = (habit: Habit): number => {
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      if (habit.completedDates.includes(ds)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const topStreaks = [...habits]
    .map(h => ({ ...h, streak: getHabitStreak(h) }))
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3);

  const StatCard: React.FC<{ icon: string; label: string; value: number | string; sub?: string; color: string; to: string }> = ({ icon, label, value, sub, color, to }) => (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid #334155',
        transition: 'transform 0.2s, border-color 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.borderColor = color; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = '#334155'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}>{label}</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>{value}</p>
            {sub && <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>{sub}</p>}
          </div>
          <div style={{
            width: 48, height: 48, borderRadius: '0.75rem',
            backgroundColor: `${color}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem'
          }}>{icon}</div>
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#f1f5f9' }}>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}! 👋
        </h1>
        <p style={{ margin: '0.5rem 0 0', color: '#64748b' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon="💪" label="Total Workouts" value={workouts.length} sub={`${workoutsThisWeek} this week`} color="#6366f1" to="/workouts" />
        <StatCard icon="✅" label="Habits Today" value={`${habitsCompletedToday}/${habits.length}`} sub="completed today" color="#22c55e" to="/habits" />
        <StatCard icon="🎯" label="Active Goals" value={activeGoals} sub={`${goalsCompleted} completed`} color="#f59e0b" to="/goals" />
        <StatCard icon="🔥" label="Top Streak" value={topStreaks[0]?.streak ?? 0} sub={topStreaks[0]?.name ?? 'No habits yet'} color="#ef4444" to="/habits" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>Recent Workouts</h2>
            <Link to="/workouts" style={{ fontSize: '0.8rem', color: '#6366f1', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentWorkouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#475569' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💪</div>
              <p style={{ margin: 0 }}>No workouts yet</p>
              <Link to="/workouts" style={{ color: '#6366f1', fontSize: '0.875rem' }}>Log your first workout →</Link>
            </div>
          ) : (
            recentWorkouts.map(w => (
              <div key={w.id} style={{ padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '0.5rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem' }}>{w.name}</p>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>{w.exercises.length} exercises · {w.duration} min</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(w.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))
          )}
        </div>

        <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>Habit Streaks</h2>
            <Link to="/habits" style={{ fontSize: '0.8rem', color: '#6366f1', textDecoration: 'none' }}>Manage →</Link>
          </div>
          {topStreaks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#475569' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <p style={{ margin: 0 }}>No habits yet</p>
              <Link to="/habits" style={{ color: '#6366f1', fontSize: '0.875rem' }}>Create your first habit →</Link>
            </div>
          ) : (
            topStreaks.map(h => (
              <div key={h.id} style={{ padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '0.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: h.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.9rem' }}>🔥</span>
                  <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>{h.streak}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>Goals Progress</h2>
            <Link to="/goals" style={{ fontSize: '0.8rem', color: '#6366f1', textDecoration: 'none' }}>View all →</Link>
          </div>
          {goals.filter(g => !g.completed).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#475569' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
              <p style={{ margin: 0 }}>No active goals</p>
              <Link to="/goals" style={{ color: '#6366f1', fontSize: '0.875rem' }}>Set your first goal →</Link>
            </div>
          ) : (
            goals.filter(g => !g.completed).slice(0, 3).map(g => {
              const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
              return (
                <div key={g.id} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>{g.title}</span>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: '#0f172a', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#6366f1', borderRadius: 4, transition: 'width 0.3s' }} />
                  </div>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>{g.currentValue} / {g.targetValue} {g.unit}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
