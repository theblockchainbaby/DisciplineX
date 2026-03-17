import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { Goal } from '../types';

const CATEGORIES = [
  { value: 'strength', label: 'Strength', icon: '🏋️', color: '#6366f1' },
  { value: 'cardio', label: 'Cardio', icon: '🏃', color: '#22c55e' },
  { value: 'weight', label: 'Weight', icon: '⚖️', color: '#f59e0b' },
  { value: 'habit', label: 'Habit', icon: '✅', color: '#06b6d4' },
  { value: 'other', label: 'Other', icon: '🎯', color: '#8b5cf6' },
];

const getCatInfo = (cat: string) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[4];

interface GoalCardProps {
  goal: Goal;
  editingGoal: string | null;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (id: string, val: number) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, editingGoal, onEdit, onCancelEdit, onSave, onToggle, onDelete }) => {
  const cat = getCatInfo(goal.category);
  const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  const daysLeft = goal.targetDate ? Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / 86400000) : null;
  const [localVal, setLocalVal] = useState(goal.currentValue);
  const isEditing = editingGoal === goal.id;

  const inputStyle: React.CSSProperties = {
    padding: '0.6rem 0.75rem', backgroundColor: '#0f172a',
    border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none',
  };

  return (
    <div style={{
      backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.25rem',
      border: `1px solid ${goal.completed ? cat.color + '44' : '#334155'}`,
      opacity: goal.completed ? 0.8 : 1,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '0.75rem', backgroundColor: cat.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            {cat.icon}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>{goal.title}</p>
            <span style={{ fontSize: '0.7rem', color: cat.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.label}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onToggle(goal.id)}
            style={{
              padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
              backgroundColor: goal.completed ? 'rgba(34,197,94,0.15)' : 'rgba(99,102,241,0.15)',
              color: goal.completed ? '#22c55e' : '#6366f1',
            }}
          >
            {goal.completed ? '✓ Done' : 'Mark Done'}
          </button>
          <button onClick={() => onDelete(goal.id)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '0.9rem' }}>🗑️</button>
        </div>
      </div>

      {goal.description && (
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: '#64748b' }}>{goal.description}</p>
      )}

      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: pct >= 100 ? '#22c55e' : cat.color }}>{pct}%</span>
        </div>
        <div style={{ height: 10, backgroundColor: '#0f172a', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: pct >= 100 ? '#22c55e' : `linear-gradient(90deg, ${cat.color}, ${cat.color}cc)`,
            borderRadius: 5, transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
            <input
              type="number" min={0} max={goal.targetValue * 2} step={1}
              style={{ ...inputStyle, width: 120 }}
              value={localVal}
              onChange={e => setLocalVal(Number(e.target.value))}
            />
            <button
              onClick={() => onSave(goal.id, localVal)}
              style={{ padding: '0.4rem 0.75rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Save
            </button>
            <button onClick={onCancelEdit} style={{ padding: '0.4rem 0.6rem', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #334155', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem' }}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => { onEdit(goal.id); setLocalVal(goal.currentValue); }}
            style={{ padding: '0.4rem 0.75rem', backgroundColor: 'rgba(99,102,241,0.15)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            Update Progress
          </button>
        )}
        {daysLeft !== null && !goal.completed && (
          <span style={{ fontSize: '0.75rem', color: daysLeft < 7 ? '#ef4444' : daysLeft < 30 ? '#f59e0b' : '#64748b' }}>
            {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Due today' : `${Math.abs(daysLeft)}d overdue`}
          </span>
        )}
      </div>
    </div>
  );
};

const Goals: React.FC = () => {
  const [goals, setGoals] = useLocalStorage<Goal[]>('dx_goals', []);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'strength' as Goal['category'],
    targetValue: 100,
    currentValue: 0,
    unit: '',
    targetDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const goal: Goal = {
      id: Date.now().toString(),
      ...form,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    setGoals(prev => [goal, ...prev]);
    setShowForm(false);
    setForm({ title: '', description: '', category: 'strength', targetValue: 100, currentValue: 0, unit: '', targetDate: '' });
  };

  const updateProgress = (id: string, value: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const completed = value >= g.targetValue;
      return { ...g, currentValue: Math.max(0, value), completed };
    }));
    setEditingGoal(null);
  };

  const toggleComplete = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed, currentValue: !g.completed ? g.targetValue : g.currentValue } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.6rem 0.75rem', backgroundColor: '#0f172a',
    border: '1px solid #334155', borderRadius: '0.5rem', color: '#f1f5f9', fontSize: '0.9rem', outline: 'none',
  };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>🎯 Goals</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>{activeGoals.length} active · {completedGoals.length} completed</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.625rem 1.25rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.625rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
          {showForm ? '✕ Cancel' : '+ New Goal'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #334155', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>Create New Goal</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Goal Title *</label>
                <input required style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Bench Press 100kg" />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select style={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Goal['category'] }))}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Target Value *</label>
                <input required type="number" min={1} style={inputStyle} value={form.targetValue} onChange={e => setForm(f => ({ ...f, targetValue: Number(e.target.value) }))} />
              </div>
              <div>
                <label style={labelStyle}>Current Value</label>
                <input type="number" min={0} style={inputStyle} value={form.currentValue} onChange={e => setForm(f => ({ ...f, currentValue: Number(e.target.value) }))} />
              </div>
              <div>
                <label style={labelStyle}>Unit (e.g. kg, km, lbs)</label>
                <input style={inputStyle} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="kg" />
              </div>
              <div>
                <label style={labelStyle}>Target Date</label>
                <input type="date" style={inputStyle} value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} />
              </div>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Description</label>
              <input style={inputStyle} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Why is this goal important?" />
            </div>
            <button type="submit" style={{ padding: '0.75rem 2rem', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '0.625rem', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
              Create Goal
            </button>
          </form>
        </div>
      )}

      {goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#475569' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
          <h3 style={{ margin: '0 0 0.5rem', color: '#64748b' }}>No goals set yet</h3>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Set measurable fitness goals to stay motivated.</p>
        </div>
      ) : (
        <>
          {activeGoals.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Goals</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {activeGoals.map(g => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    editingGoal={editingGoal}
                    onEdit={(id) => setEditingGoal(id)}
                    onCancelEdit={() => setEditingGoal(null)}
                    onSave={updateProgress}
                    onToggle={toggleComplete}
                    onDelete={deleteGoal}
                  />
                ))}
              </div>
            </div>
          )}
          {completedGoals.length > 0 && (
            <div>
              <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Completed Goals 🏆</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {completedGoals.map(g => (
                  <GoalCard
                    key={g.id}
                    goal={g}
                    editingGoal={editingGoal}
                    onEdit={(id) => setEditingGoal(id)}
                    onCancelEdit={() => setEditingGoal(null)}
                    onSave={updateProgress}
                    onToggle={toggleComplete}
                    onDelete={deleteGoal}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Goals;
