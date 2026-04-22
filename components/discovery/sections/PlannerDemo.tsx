'use client';

import { useState, useMemo, useEffect } from 'react';

type Category = 'deep_work' | 'admin' | 'rest' | 'social' | 'self';

interface Task {
  id: string;
  label: string;
  minutes: number;
  category: Category;
}

const CATEGORY_COLOR: Record<Category, string> = {
  deep_work: '#5eead4',
  admin:     '#a78bfa',
  rest:      '#94a3b8',
  social:    '#f7b955',
  self:      '#fb7185',
};

const CATEGORY_LABEL: Record<Category, string> = {
  deep_work: 'deep work',
  admin:     'admin',
  rest:      'rest',
  social:    'social',
  self:      'self',
};

const DAY_MIN = 1440;

const INITIAL_TASKS: Task[] = [
  { id: 't1', label: 'ECE 1100 discovery writeup', minutes: 90,  category: 'deep_work' },
  { id: 't2', label: 'Lab report',                 minutes: 75,  category: 'deep_work' },
  { id: 't3', label: 'Email & admin',              minutes: 25,  category: 'admin' },
  { id: 't4', label: 'Lunch + walk',               minutes: 45,  category: 'self' },
  { id: 't5', label: 'Gym',                        minutes: 60,  category: 'self' },
  { id: 't6', label: 'Call family',                minutes: 20,  category: 'social' },
  { id: 't7', label: 'Sleep',                      minutes: 480, category: 'rest' },
];

/* Very lightweight natural-language → task parser */
function parseInput(raw: string): { label: string; minutes: number; category: Category } | null {
  const text = raw.trim();
  if (!text) return null;

  // find minutes: "45m", "45 min", "1h 30", "2h", "90"
  const mMatch = text.match(/(\d+)\s*h(?:\s*(\d+))?/i);
  const sMatch = text.match(/(\d+)\s*(?:min|m)\b/i);
  const plainNum = text.match(/^\s*(\d+)\s+/);

  let mins = 30;
  if (mMatch) mins = parseInt(mMatch[1]) * 60 + (mMatch[2] ? parseInt(mMatch[2]) : 0);
  else if (sMatch) mins = parseInt(sMatch[1]);
  else if (plainNum) mins = parseInt(plainNum[1]);

  // infer category
  const lower = text.toLowerCase();
  let category: Category = 'deep_work';
  if (/sleep|nap|rest|break/.test(lower)) category = 'rest';
  else if (/gym|walk|run|lunch|dinner|breakfast|eat|shower/.test(lower)) category = 'self';
  else if (/call|meet|friend|family|hang/.test(lower)) category = 'social';
  else if (/email|admin|clean|errand|organize/.test(lower)) category = 'admin';

  // clean label
  const label = text
    .replace(/(\d+)\s*h(?:\s*(\d+))?/gi, '')
    .replace(/(\d+)\s*(?:min|m)\b/gi, '')
    .replace(/^\s*(\d+)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim();

  return { label: label || 'Untitled task', minutes: Math.min(Math.max(mins, 5), 480), category };
}

export default function PlannerDemo() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [input, setInput] = useState('');
  const [log, setLog] = useState<{ q: string; a: 'yes' | 'no'; ts: string }[]>([]);
  const [driftScore, setDriftScore] = useState(0.32);

  // Nudge drift score occasionally so it feels live
  useEffect(() => {
    const t = setInterval(() => {
      setDriftScore((d) => {
        const next = d + (Math.random() - 0.5) * 0.1;
        return Math.max(0, Math.min(1, next));
      });
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const totals = useMemo(() => {
    const total = tasks.reduce((s, t) => s + t.minutes, 0);
    const byCat: Record<Category, number> = {
      deep_work: 0, admin: 0, rest: 0, social: 0, self: 0,
    };
    tasks.forEach((t) => { byCat[t.category] += t.minutes; });
    return { total, remaining: DAY_MIN - total, byCat };
  }, [tasks]);

  const handleAdd = () => {
    const parsed = parseInput(input);
    if (!parsed) return;
    if (totals.total + parsed.minutes > DAY_MIN) {
      alert('Day is full — remove or shrink a task first.');
      return;
    }
    setTasks([...tasks, { id: `t${Date.now()}`, ...parsed }]);
    setInput('');
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleCheckin = (answer: 'yes' | 'no') => {
    const now = new Date();
    const ts = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLog([{ q: 'Still on task?', a: answer, ts }, ...log].slice(0, 8));
    if (answer === 'yes') setDriftScore((d) => Math.max(0, d - 0.25));
    else setDriftScore((d) => Math.min(1, d + 0.25));
  };

  return (
    <div>
      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">04 · LIVE</span>
            <span className="dd-panel-title">Time Token Planner</span>
          </div>
          <div className="dd-chip is-amber">● INTERACTIVE</div>
        </div>
        <div className="dd-body" style={{ marginBottom: '1rem' }}>
          The core planner idea: your day is 1,440 minutes. You spend those minutes
          on tasks, each with a category. Type a task like{' '}
          <em style={{ color: 'var(--dd-amber)', fontStyle: 'normal' }}>&quot;studying 45m&quot;</em> or{' '}
          <em style={{ color: 'var(--dd-amber)', fontStyle: 'normal' }}>&quot;gym 1h&quot;</em> below
          and watch the budget bar update.
        </div>

        <div className="dd-planner">
          {/* LEFT: budget + tasks */}
          <div>
            <div className="dd-budget">
              <div className="dd-budget-label">1440-MIN DAILY BUDGET · {totals.remaining} MIN UNALLOCATED</div>
              <div className="dd-budget-track">
                {tasks.map((t) => {
                  const pct = (t.minutes / DAY_MIN) * 100;
                  return (
                    <div key={t.id}
                         className="dd-budget-block"
                         style={{
                           width: `${pct}%`,
                           background: CATEGORY_COLOR[t.category],
                         }}
                         title={`${t.label} · ${t.minutes}m`}>
                      {pct > 4 && t.minutes >= 30 ? t.minutes : ''}
                    </div>
                  );
                })}
                {totals.remaining > 0 && (
                  <div className="dd-budget-block"
                       style={{
                         width: `${(totals.remaining / DAY_MIN) * 100}%`,
                         background: 'rgba(148, 163, 184, 0.15)',
                         color: 'var(--dd-text-faint)',
                       }}>
                    {totals.remaining >= 60 ? `${totals.remaining}m free` : ''}
                  </div>
                )}
              </div>
              <div className="dd-budget-legend">
                {(Object.keys(CATEGORY_COLOR) as Category[]).map((c) => (
                  <span key={c}>
                    <span className="dd-legend-dot"
                          style={{ background: CATEGORY_COLOR[c] }} />
                    {CATEGORY_LABEL[c]} · {totals.byCat[c]}m
                  </span>
                ))}
              </div>
            </div>

            <div className="dd-input-row">
              <input
                className="dd-input"
                placeholder="e.g. studying 45m  /  gym 1h  /  email 20"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              />
              <button className="dd-btn is-primary" onClick={handleAdd}>ADD +</button>
            </div>

            <ul className="dd-task-list">
              {tasks.map((t) => (
                <li key={t.id} className="dd-task">
                  <span className="dd-task-swatch"
                        style={{ background: CATEGORY_COLOR[t.category] }} />
                  <span className="dd-task-name">{t.label}</span>
                  <span className="dd-task-mins">{t.minutes}m</span>
                  <button className="dd-task-del"
                          onClick={() => handleDelete(t.id)}>×</button>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: live check-in */}
          <div>
            <div className="dd-checkin">
              <div className="dd-checkin-title">▸ LIVE CHECK-IN · BLOCK 2</div>
              <div className="dd-checkin-q">Still on &ldquo;ECE 1100 discovery writeup&rdquo;?</div>
              <div className="dd-checkin-row">
                <button className="dd-btn is-primary"
                        onClick={() => handleCheckin('yes')}>
                  YES ✓
                </button>
                <button className="dd-btn"
                        onClick={() => handleCheckin('no')}>
                  NO ✗
                </button>
                <button className="dd-btn is-ghost"
                        onClick={() => handleCheckin('no')}>
                  SKIP
                </button>
              </div>

              <div className={`dd-drift ${driftScore > 0.7 ? 'is-alert' : ''}`}>
                <span>DRIFT SCORE</span>
                <span>
                  {driftScore.toFixed(2)}
                  {driftScore > 0.7 ? ' · REPLAN SUGGESTED' : ''}
                </span>
              </div>

              <div className="dd-checkin-log">
                {log.length === 0 && (
                  <div style={{ color: 'var(--dd-text-faint)', padding: '0.4rem 0' }}>
                    — no check-ins yet —
                  </div>
                )}
                {log.map((entry, i) => (
                  <div key={i}
                       className={`dd-checkin-log-row ${entry.a === 'yes' ? 'is-yes' : 'is-no'}`}>
                    <span>{entry.ts} · {entry.q}</span>
                    <span>{entry.a.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
