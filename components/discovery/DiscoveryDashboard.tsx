'use client';

import { useState } from 'react';
import Link from 'next/link';
import Overview from './sections/Overview';
import Walkthrough from './sections/Walkthrough';
import Documentation from './sections/Documentation';
import Architecture from './sections/Architecture';
import PlannerDemo from './sections/PlannerDemo';
import SignalLab from './sections/SignalLab';
import Timeline from './sections/Timeline';
import PhotosRefs from './sections/PhotosRefs';
import EceSkills from './sections/EceSkills';
import Reflections from './sections/Reflections';
import './discovery.css';

type SectionId =
  | 'overview'
  | 'walkthrough'
  | 'documentation'
  | 'architecture'
  | 'planner'
  | 'signal'
  | 'timeline'
  | 'photos'
  | 'skills'
  | 'reflections';

interface NavItem {
  id: SectionId;
  label: string;
  code: string;
  group: 'ABOUT' | 'DEMOS' | 'EVIDENCE' | 'REVIEW';
}

const NAV: NavItem[] = [
  { id: 'overview',      label: 'Overview',             code: '00', group: 'ABOUT' },
  { id: 'walkthrough',   label: 'Walkthrough',          code: '01', group: 'ABOUT' },
  { id: 'documentation', label: 'Design Doc',           code: '02', group: 'ABOUT' },
  { id: 'architecture',  label: 'Architecture',         code: '03', group: 'DEMOS' },
  { id: 'planner',       label: 'Live: Planner',        code: '04', group: 'DEMOS' },
  { id: 'signal',        label: 'Live: Signal Lab',     code: '05', group: 'DEMOS' },
  { id: 'timeline',      label: 'Project Timeline',     code: '06', group: 'EVIDENCE' },
  { id: 'photos',        label: 'Photos & References',  code: '07', group: 'EVIDENCE' },
  { id: 'skills',        label: 'ECE Skills Gained',    code: '08', group: 'REVIEW' },
  { id: 'reflections',   label: 'Reflections',          code: '09', group: 'REVIEW' },
];

export default function DiscoveryDashboard() {
  const [active, setActive] = useState<SectionId>('overview');

  const groups = ['ABOUT', 'DEMOS', 'EVIDENCE', 'REVIEW'] as const;

  return (
    <div className="dd-root">
      {/* Background layers — reuse the site's starfield */}
      <div className="starfield-container">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div>

      {/* Top bar */}
      <header className="dd-topbar">
        <Link href="/" className="dd-home-link" aria-label="Back to portfolio">
          <span className="dd-logo">DD</span>
          <span className="dd-home-text">← portfolio</span>
        </Link>
        <div className="dd-title-cluster">
          <div className="dd-eyebrow">ECE 1100 · DISCOVERY PROJECT</div>
          <div className="dd-title">Time Token Planner <span className="dd-plus">+</span> Focus Sensor</div>
        </div>
        <div className="dd-status-cluster">
          <StatusDot color="var(--dd-amber)" label="PROTOTYPE" />
          <StatusDot color="var(--dd-cyan)" label="SPRING 26" />
        </div>
      </header>

      <div className="dd-shell">
        {/* Sidebar */}
        <aside className="dd-sidebar">
          <div className="dd-sidebar-inner">
            {groups.map((group) => (
              <div className="dd-nav-group" key={group}>
                <div className="dd-nav-group-label">{group}</div>
                <ul className="dd-nav-list">
                  {NAV.filter((n) => n.group === group).map((item) => (
                    <li key={item.id}>
                      <button
                        className={`dd-nav-item ${active === item.id ? 'is-active' : ''}`}
                        onClick={() => setActive(item.id)}
                      >
                        <span className="dd-nav-code">{item.code}</span>
                        <span className="dd-nav-label">{item.label}</span>
                        {active === item.id && <span className="dd-nav-caret">›</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="dd-sidebar-footer">
              <div className="dd-meter">
                <div className="dd-meter-label">BUILD STATUS</div>
                <div className="dd-meter-bar">
                  <div className="dd-meter-fill" style={{ width: '65%' }} />
                </div>
                <div className="dd-meter-value">65% — SW PROTOTYPE</div>
              </div>
              <div className="dd-meta">
                <div className="dd-meta-row"><span>COURSE</span><span>ECE 1100</span></div>
                <div className="dd-meta-row"><span>TERM</span><span>SP 2026</span></div>
                <div className="dd-meta-row"><span>STUDENT</span><span>D. DHULIPUDI</span></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main pane */}
        <main className="dd-main">
          <div className="dd-crumbs">
            <span>/discovery</span>
            <span className="dd-crumb-sep">/</span>
            <span>{NAV.find((n) => n.id === active)?.code}</span>
            <span className="dd-crumb-sep">/</span>
            <span className="dd-crumb-active">{NAV.find((n) => n.id === active)?.label}</span>
          </div>

          <div className="dd-section-wrap">
            {active === 'overview' && <Overview onNavigate={setActive} />}
            {active === 'walkthrough' && <Walkthrough />}
            {active === 'documentation' && <Documentation />}
            {active === 'architecture' && <Architecture />}
            {active === 'planner' && <PlannerDemo />}
            {active === 'signal' && <SignalLab />}
            {active === 'timeline' && <Timeline />}
            {active === 'photos' && <PhotosRefs />}
            {active === 'skills' && <EceSkills />}
            {active === 'reflections' && <Reflections />}
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="dd-status-dot">
      <span className="dd-dot" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      <span className="dd-status-label">{label}</span>
    </div>
  );
}
