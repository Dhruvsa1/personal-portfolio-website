'use client';

type SectionId =
  | 'overview' | 'walkthrough' | 'documentation' | 'architecture'
  | 'planner' | 'signal' | 'timeline' | 'photos' | 'videos'
  | 'skills' | 'reflections';

interface Props {
  onNavigate: (id: SectionId) => void;
}

export default function Overview({ onNavigate }: Props) {
  return (
    <div className="dd-overview">
      <div className="dd-hero">
        {/* LEFT: Copy */}
        <div className="dd-panel dd-hero-copy">
          <div className="dd-chip is-amber" style={{ marginBottom: '1rem' }}>
            ● DISCOVERY PROJECT
          </div>
          <h1 className="dd-h1">
            Time Token Planner <span className="dd-h1-accent">+</span><br />
            Focus &amp; Boredom Sensor
          </h1>
          <p className="dd-lede">
            A wearable-plus-app system concept that treats the 1,440 minutes in a
            day like a spendable budget — and uses physiological signals from a
            wrist-worn sensor to detect when a user is drifting off-task, so the
            schedule can auto-replan itself.
          </p>
          <p className="dd-lede" style={{ marginTop: '0.9rem', color: 'var(--dd-text-faint)', fontSize: '0.9rem' }}>
            Originally pitched as a hardware + software system. This showcase
            documents the pitch, the research, the hardware access constraints
            that forced a <em style={{ fontStyle: 'normal', color: 'var(--dd-amber)' }}>scope reduction</em>,
            and the software prototype that came out of it.
          </p>

          <div className="dd-jump-grid">
            <button className="dd-jump" onClick={() => onNavigate('walkthrough')}>
              <span className="dd-jump-code">01 · START HERE</span>
              <span className="dd-jump-title">Read the walkthrough</span>
              <span className="dd-jump-sub">Problem → Process → Outcome</span>
            </button>
            <button className="dd-jump" onClick={() => onNavigate('planner')}>
              <span className="dd-jump-code">04 · DEMO</span>
              <span className="dd-jump-title">Open the planner</span>
              <span className="dd-jump-sub">Interactive time-token UI</span>
            </button>
            <button className="dd-jump" onClick={() => onNavigate('signal')}>
              <span className="dd-jump-code">05 · DEMO</span>
              <span className="dd-jump-title">Run the signal lab</span>
              <span className="dd-jump-sub">Live PPG + heart-rate detection</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Watch mockup */}
        <div className="dd-panel dd-hero-visual">
          <div className="dd-watch">
            <div className="dd-watch-body">
              <span className="dd-watch-time">10:24</span>
              <span className="dd-watch-hr">
                ♥ <span className="dd-watch-hr-value">72</span> BPM
              </span>
              <div className="dd-watch-bar">
                <div className="dd-watch-bar-fill" />
              </div>
              <span className="dd-watch-status">FOCUSED · 23m LEFT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status tiles */}
      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">STATUS</span>
            <span className="dd-panel-title">Project snapshot</span>
          </div>
          <div className="dd-chip">UPDATED 2026·04·21</div>
        </div>
        <div className="dd-tile-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="dd-tile">
            <div className="dd-tile-label">SCOPE PIVOT</div>
            <div className="dd-tile-value">HW → <span style={{ color: 'var(--dd-amber)' }}>SW</span></div>
          </div>
          <div className="dd-tile">
            <div className="dd-tile-label">PROTOTYPE</div>
            <div className="dd-tile-value" style={{ color: 'var(--dd-cyan)' }}>SHIPPED</div>
          </div>
          <div className="dd-tile">
            <div className="dd-tile-label">ECE SKILLS</div>
            <div className="dd-tile-value">5<span className="dd-tile-unit">areas</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
