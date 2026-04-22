'use client';

/* 10-week rough Gantt spanning Feb 16 → Apr 21 (showcase) */

interface Row {
  label: string;
  bars: { from: number; to: number; color: string; label?: string }[];
  status: string;
}

const ROWS: Row[] = [
  {
    label: 'Pitch & requirements',
    status: 'COMPLETE',
    bars: [{ from: 0, to: 1, color: '#5eead4', label: 'W1' }],
  },
  {
    label: 'Sensor & BLE research',
    status: 'COMPLETE',
    bars: [{ from: 1, to: 3, color: '#5eead4', label: 'datasheet study' }],
  },
  {
    label: 'Lab component outreach',
    status: 'BLOCKED',
    bars: [{ from: 2, to: 4, color: '#fb7185', label: 'availability gap' }],
  },
  {
    label: 'Scope-down decision',
    status: 'DECISION',
    bars: [{ from: 4, to: 4.3, color: '#f7b955', label: 'PIVOT' }],
  },
  {
    label: 'Software: planner UI',
    status: 'SHIPPED',
    bars: [{ from: 4.3, to: 7, color: '#a78bfa', label: 'budget bar + tasks' }],
  },
  {
    label: 'Software: synth signals + DSP',
    status: 'SHIPPED',
    bars: [{ from: 5, to: 8, color: '#a78bfa', label: 'PPG · filter · peaks' }],
  },
  {
    label: 'Software: drift heuristic',
    status: 'PROTOTYPE',
    bars: [{ from: 7, to: 8.5, color: '#5eead4', label: 'weighted score' }],
  },
  {
    label: 'Dashboard + docs',
    status: 'SHIPPED',
    bars: [{ from: 8, to: 9.8, color: '#f7b955', label: 'this page' }],
  },
  {
    label: 'Showcase',
    status: 'TODAY',
    bars: [{ from: 9.7, to: 10, color: '#fb7185', label: '04·21' }],
  },
];

export default function Timeline() {
  return (
    <div>
      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">06 · TIMELINE</span>
            <span className="dd-panel-title">Project execution · Feb 16 → Apr 21</span>
          </div>
          <div className="dd-chip">10 WEEKS</div>
        </div>

        <div className="dd-gantt">
          <div className="dd-gantt-header">
            <div>TRACK</div>
            <div className="dd-gantt-weeks">
              {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'].map((w) => (
                <div key={w} className="dd-gantt-week">{w}</div>
              ))}
            </div>
          </div>

          {ROWS.map((row, i) => (
            <div className="dd-gantt-row" key={i}>
              <div className="dd-gantt-label">
                {row.label}
                <div style={{
                  fontFamily: 'var(--dd-mono)',
                  fontSize: '0.58rem',
                  color: 'var(--dd-text-faint)',
                  marginTop: '0.15rem',
                  letterSpacing: '0.12em',
                }}>
                  {row.status}
                </div>
              </div>
              <div className="dd-gantt-track">
                {row.bars.map((b, j) => {
                  const left = (b.from / 10) * 100;
                  const width = ((b.to - b.from) / 10) * 100;
                  return (
                    <div key={j}
                         className="dd-gantt-bar"
                         style={{
                           left: `${left}%`,
                           width: `${width}%`,
                           background: b.color,
                         }}>
                      {width > 10 ? b.label : ''}
                    </div>
                  );
                })}

                {/* PIVOT marker at W4.3 (Mar 21) */}
                {i === 3 && (
                  <div className="dd-gantt-pivot" style={{ left: '43%' }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">06.1</span>
            <span className="dd-panel-title">Milestones &amp; dates</span>
          </div>
        </div>
        <table className="dd-doc-table">
          <thead>
            <tr><th>DATE</th><th>MILESTONE</th><th>OUTCOME</th></tr>
          </thead>
          <tbody>
            <tr><td>Feb 16</td><td>Pitch submitted &amp; approved</td><td style={{ color: 'var(--dd-cyan)' }}>50/50</td></tr>
            <tr><td>Feb 24</td><td>Sensor &amp; BLE stack comparison finalized</td><td style={{ color: 'var(--dd-cyan)' }}>MAX30101 · ESP32 · NimBLE</td></tr>
            <tr><td>Mar 9</td><td>GATT service table drafted</td><td style={{ color: 'var(--dd-cyan)' }}>3 char · 25–50 Hz</td></tr>
            <tr><td>Mar 21</td><td><strong style={{ color: 'var(--dd-amber)' }}>Scope-down decision</strong></td><td style={{ color: 'var(--dd-amber)' }}>HW → SW prototype</td></tr>
            <tr><td>Mar 29</td><td>Planner UI v0</td><td style={{ color: 'var(--dd-cyan)' }}>tasks + budget bar</td></tr>
            <tr><td>Apr 6</td><td>PPG synth + MA filter</td><td style={{ color: 'var(--dd-cyan)' }}>50 Hz stream</td></tr>
            <tr><td>Apr 12</td><td>Peak detect + HR estimate</td><td style={{ color: 'var(--dd-cyan)' }}>adaptive threshold</td></tr>
            <tr><td>Apr 18</td><td>Drift heuristic wired to planner</td><td style={{ color: 'var(--dd-amber)' }}>prototype</td></tr>
            <tr><td>Apr 21</td><td>Showcase</td><td style={{ color: 'var(--dd-rose)' }}>— today —</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
