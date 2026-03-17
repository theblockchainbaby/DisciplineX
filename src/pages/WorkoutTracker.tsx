import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Workout, Exercise } from '../types';

const emptyExercise = (): Exercise => ({
  id: Date.now().toString() + Math.random(),
  name: '',
  sets: 3,
  reps: 10,
  weight: 0,
  unit: 'kg',
});

const WorkoutTracker: React.FC = () => {
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('dx_workouts', []);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    duration: 45,
    notes: '',
    exercises: [emptyExercise()],
  });

  const addExercise = () => {
    setForm(f => ({ ...f, exercises: [...f.exercises, emptyExercise()] }));
  };

  const removeExercise = (id: string) => {
    setForm(f => ({ ...f, exercises: f.exercises.filter(e => e.id !== id) }));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string | number) => {
    setForm(f => ({
      ...f,
      exercises: f.exercises.map(e => e.id === id ? { ...e, [field]: value } : e),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const workout: Workout = {
      id: Date.now().toString(),
      ...form,
    };
    setWorkouts(prev => [workout, ...prev]);
    setShowForm(false);
    setForm({ name: '', date: new Date().toISOString().split('T')[0], duration: 45, notes: '', exercises: [emptyExercise()] });
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const sorted = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.75rem', backgroundColor: '#0f172a',
    border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9',
    fontSize: '0.9rem', outline: 'none',
  };

  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>💪 Workout Tracker</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>{workouts.length} workouts logged</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.625rem 1.25rem', backgroundColor: '#6366f1', color: '#fff',
            border: 'none', borderRadius: '0.625rem', fontWeight: 600, cursor: 'pointer',
            fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Log Workout'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>New Workout</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Workout Name *</label>
                <input required style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Push Day" />
              </div>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" style={inputStyle} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Duration (min)</label>
                <input type="number" min={1} style={inputStyle} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} />
              </div>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Notes</label>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="How did it go?" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#f1f5f9' }}>Exercises</h3>
                <button type="button" onClick={addExercise} style={{ padding: '0.4rem 0.75rem', backgroundColor: 'rgba(99,102,241,0.15)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' }}>
                  + Add Exercise
                </button>
              </div>
              {form.exercises.map((ex, idx) => (
                <div key={ex.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 60px auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <input style={inputStyle} value={ex.name} onChange={e => updateExercise(ex.id, 'name', e.target.value)} placeholder={`Exercise ${idx + 1}`} />
                  <div>
                    <label style={{ ...labelStyle, marginBottom: '0.1rem' }}>Sets</label>
                    <input type="number" min={1} style={inputStyle} value={ex.sets} onChange={e => updateExercise(ex.id, 'sets', Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, marginBottom: '0.1rem' }}>Reps</label>
                    <input type="number" min={1} style={inputStyle} value={ex.reps} onChange={e => updateExercise(ex.id, 'reps', Number(e.target.value))} />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, marginBottom: '0.1rem' }}>Weight</label>
                    <input type="number" min={0} step={0.5} style={inputStyle} value={ex.weight} onChange={e => updateExercise(ex.id, 'weight', Number(e.target.value))} />
                  </div>
                  <select style={{ ...inputStyle, padding: '0.6rem 0.25rem' }} value={ex.unit} onChange={e => updateExercise(ex.id, 'unit', e.target.value)}>
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                  <button type="button" onClick={() => removeExercise(ex.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem' }}>✕</button>
                </div>
              ))}
            </div>

            <button type="submit" style={{ padding: '0.75rem 2rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.625rem', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
              Save Workout
            </button>
          </form>
        </div>
      )}

      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#475569' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💪</div>
          <h3 style={{ margin: '0 0 0.5rem', color: '#64748b' }}>No workouts logged yet</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Click "Log Workout" to start tracking your training.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sorted.map(w => (
            <div key={w.id} style={{ backgroundColor: '#1e293b', borderRadius: '1rem', border: '1px solid #334155', overflow: 'hidden' }}>
              <div
                style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setExpandedId(expandedId === w.id ? null : w.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '0.75rem', backgroundColor: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>💪</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#f1f5f9' }}>{w.name}</p>
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(w.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {w.exercises.length} exercises · {w.duration} min
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={e => { e.stopPropagation(); deleteWorkout(w.id); }}
                    style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.9rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
                    title="Delete workout"
                  >🗑️</button>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{expandedId === w.id ? '▲' : '▼'}</span>
                </div>
              </div>
              {expandedId === w.id && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #0f172a' }}>
                  {w.notes && <p style={{ margin: '0.75rem 0 1rem', fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>"{w.notes}"</p>}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #334155' }}>
                          {['Exercise', 'Sets', 'Reps', 'Weight'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#64748b', fontWeight: 600 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {w.exercises.map((ex, i) => (
                          <tr key={ex.id} style={{ backgroundColor: i % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent' }}>
                            <td style={{ padding: '0.5rem 0.75rem', color: '#f1f5f9', fontWeight: 500 }}>{ex.name || '—'}</td>
                            <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8' }}>{ex.sets}</td>
                            <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8' }}>{ex.reps}</td>
                            <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8' }}>{ex.weight > 0 ? `${ex.weight} ${ex.unit}` : 'Bodyweight'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutTracker;
