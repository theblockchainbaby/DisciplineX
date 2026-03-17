import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Habit } from '../types';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('dx_habits', []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', frequency: 'daily' as 'daily' | 'weekly', color: COLORS[0] });

  const today = new Date().toISOString().split('T')[0];

  const getLast7Days = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d.toISOString().split('T')[0], label: DAYS[d.getDay()], isToday: i === 6 };
    });
  };

  const getStreak = (habit: Habit): number => {
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

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const completed = h.completedDates.includes(date);
      return {
        ...h,
        completedDates: completed
          ? h.completedDates.filter(d => d !== date)
          : [...h.completedDates, date],
      };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const habit: Habit = {
      id: Date.now().toString(),
      ...form,
      targetDays: [0, 1, 2, 3, 4, 5, 6],
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [habit, ...prev]);
    setShowForm(false);
    setForm({ name: '', description: '', frequency: 'daily', color: COLORS[Math.floor(Math.random() * COLORS.length)] });
  };

  const last7 = getLast7Days();
  const completedToday = habits.filter(h => h.completedDates.includes(today)).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>✅ Habit Tracker</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
            {completedToday}/{habits.length} habits completed today
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '0.625rem 1.25rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.625rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
        >
          {showForm ? '✕ Cancel' : '+ New Habit'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>Create New Habit</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Habit Name *</label>
                <input
                  required
                  style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' }}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Morning Run"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Frequency</label>
                <select
                  style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' }}
                  value={form.frequency}
                  onChange={e => setForm(f => ({ ...f, frequency: e.target.value as 'daily' | 'weekly' }))}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Description</label>
              <input
                style={{ width: '100%', padding: '0.6rem 0.75rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none' }}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Why is this habit important?"
              />
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', backgroundColor: c, border: form.color === c ? '3px solid #fff' : '2px solid transparent',
                      cursor: 'pointer', transition: 'transform 0.15s',
                    }}
                  />
                ))}
              </div>
            </div>
            <button type="submit" style={{ padding: '0.75rem 2rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.625rem', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
              Create Habit
            </button>
          </form>
        </div>
      )}

      {habits.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#475569' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h3 style={{ margin: '0 0 0.5rem', color: '#64748b' }}>No habits yet</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Build consistency by tracking daily habits.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {habits.map(habit => {
            const streak = getStreak(habit);
            const isCompletedToday = habit.completedDates.includes(today);
            return (
              <div key={habit.id} style={{
                backgroundColor: '#1e293b',
                borderRadius: '1rem',
                border: `1px solid ${isCompletedToday ? habit.color + '44' : '#334155'}`,
                padding: '1rem 1.25rem',
                transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <button
                    onClick={() => toggleHabit(habit.id, today)}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', border: `2px solid ${habit.color}`,
                      backgroundColor: isCompletedToday ? habit.color : 'transparent',
                      cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', color: '#fff', transition: 'all 0.2s',
                    }}
                  >
                    {isCompletedToday ? '✓' : ''}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, color: isCompletedToday ? '#f1f5f9' : '#94a3b8', fontSize: '0.95rem' }}>{habit.name}</p>
                    {habit.description && <p style={{ margin: '0.1rem 0 0', fontSize: '0.8rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{habit.description}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>🔥</span>
                      <span style={{ fontWeight: 700, color: streak > 0 ? '#f59e0b' : '#475569', fontSize: '0.9rem' }}>{streak}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', backgroundColor: 'rgba(99,102,241,0.15)', color: '#6366f1', fontWeight: 600 }}>
                      {habit.frequency}
                    </span>
                    <button onClick={() => deleteHabit(habit.id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.9rem' }}>🗑️</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {last7.map(({ date, label, isToday }) => {
                    const done = habit.completedDates.includes(date);
                    return (
                      <div
                        key={date}
                        onClick={() => toggleHabit(habit.id, date)}
                        style={{
                          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', color: isToday ? '#f1f5f9' : '#475569', fontWeight: isToday ? 700 : 400 }}>{label}</span>
                        <div style={{
                          width: '100%', aspectRatio: '1', borderRadius: '0.35rem',
                          backgroundColor: done ? habit.color : '#0f172a',
                          border: isToday ? `1px solid ${habit.color}` : '1px solid #1e293b',
                          minWidth: 24, minHeight: 24,
                          transition: 'background-color 0.15s',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {done && <span style={{ fontSize: '0.65rem', color: '#fff' }}>✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
