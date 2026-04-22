'use client';

export default function Architecture() {
  return (
    <div>
      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">03 · ARCHITECTURE</span>
            <span className="dd-panel-title">System block diagrams</span>
          </div>
          <div className="dd-chip">INLINE SVG</div>
        </div>

        <div className="dd-body" style={{ marginBottom: '1rem' }}>
          Three diagrams that together describe the system as originally
          designed. The <em style={{ color: 'var(--dd-rose)', fontStyle: 'normal' }}>red-dashed</em> blocks
          are the pieces that were descoped during the pivot. Everything with
          a solid border was implemented in the software prototype you can run
          in §04 and §05.
        </div>

        <h3 style={{ color: 'var(--dd-text)', fontSize: '1rem', fontWeight: 600, marginTop: '1rem' }}>
          3.1 &nbsp;System-level data flow
        </h3>
        <div className="dd-svg-frame">
          <SystemDiagram />
        </div>
        <div className="dd-svg-caption">FIG. 3.1 — Wearable → phone → cloud data flow. Dashed = descoped.</div>
      </div>

      <div className="dd-panel">
        <h3 style={{ color: 'var(--dd-text)', fontSize: '1rem', fontWeight: 600 }}>
          3.2 &nbsp;BLE protocol stack &amp; GATT service
        </h3>
        <div className="dd-svg-frame">
          <BleStackDiagram />
        </div>
        <div className="dd-svg-caption">FIG. 3.2 — Planned GATT service layout on the wearable.</div>
      </div>

      <div className="dd-panel">
        <h3 style={{ color: 'var(--dd-text)', fontSize: '1rem', fontWeight: 600 }}>
          3.3 &nbsp;Signal processing pipeline
        </h3>
        <div className="dd-svg-frame">
          <SignalPipelineDiagram />
        </div>
        <div className="dd-svg-caption">FIG. 3.3 — Raw PPG → filtered → peak-detected → HR estimate. Implemented in §05.</div>
      </div>
    </div>
  );
}

/* ============================================================
   DIAGRAMS
   ============================================================ */

function SystemDiagram() {
  return (
    <svg viewBox="0 0 920 380" width="100%" style={{ display: 'block' }}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
        <marker id="arrow-amber" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="7" markerHeight="7" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f7b955" />
        </marker>
      </defs>

      {/* WEARABLE cluster */}
      <g>
        <rect x="30" y="40" width="220" height="300" rx="10"
              fill="rgba(251,113,133,0.04)" stroke="#fb7185" strokeDasharray="4 4" strokeWidth="1.5" />
        <text x="140" y="28" fill="#fb7185" fontSize="11" textAnchor="middle"
              fontFamily="monospace" letterSpacing="1">WEARABLE · DESCOPED</text>

        <Block x={60} y={70} w={160} h={44} title="PPG" sub="MAX30101 · I²C" color="#fb7185" />
        <Block x={60} y={130} w={160} h={44} title="EDA" sub="GSR AFE · ADC" color="#fb7185" />
        <Block x={60} y={190} w={160} h={44} title="IMU" sub="MPU-6050 · I²C" color="#fb7185" />
        <Block x={60} y={260} w={160} h={60} title="ESP32 / nRF52" sub="BLE 5 · 3.3 V" color="#fb7185" bold />
      </g>

      {/* BLE link */}
      <line x1="250" y1="290" x2="380" y2="290"
            stroke="#fb7185" strokeDasharray="6 4" strokeWidth="2" markerEnd="url(#arrow-amber)" />
      <text x="315" y="278" fill="#fb7185" fontSize="10"
            fontFamily="monospace" textAnchor="middle">BLE GATT</text>

      {/* PHONE / APP cluster */}
      <g>
        <rect x="380" y="40" width="220" height="300" rx="10"
              fill="rgba(94,234,212,0.04)" stroke="#5eead4" strokeWidth="1.5" />
        <text x="490" y="28" fill="#5eead4" fontSize="11" textAnchor="middle"
              fontFamily="monospace" letterSpacing="1">APP · WEB PROTOTYPE</text>

        <Block x={410} y={70} w={160} h={44} title="Sample buffer" sub="50 Hz PPG · 4 Hz EDA" color="#5eead4" />
        <Block x={410} y={130} w={160} h={44} title="Filter pipeline" sub="HP · BP · MA" color="#5eead4" />
        <Block x={410} y={190} w={160} h={44} title="Feature extract" sub="HR · HRV · motion" color="#5eead4" />
        <Block x={410} y={260} w={160} h={60} title="Drift detector" sub="weighted heuristic → score" color="#5eead4" bold />
      </g>

      {/* App → Planner */}
      <line x1="600" y1="290" x2="730" y2="290"
            stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="665" y="278" fill="#94a3b8" fontSize="10"
            fontFamily="monospace" textAnchor="middle">replan / check-in</text>

      {/* PLANNER cluster */}
      <g>
        <rect x="730" y="40" width="160" height="300" rx="10"
              fill="rgba(247,185,85,0.04)" stroke="#f7b955" strokeWidth="1.5" />
        <text x="810" y="28" fill="#f7b955" fontSize="11" textAnchor="middle"
              fontFamily="monospace" letterSpacing="1">PLANNER · UI</text>

        <Block x={750} y={70} w={120} h={44} title="Daily budget" sub="1440 min" color="#f7b955" />
        <Block x={750} y={130} w={120} h={44} title="Task blocks" sub="category · color" color="#f7b955" />
        <Block x={750} y={190} w={120} h={44} title="Check-ins" sub="yes · no · skip" color="#f7b955" />
        <Block x={750} y={260} w={120} h={60} title="Reschedule" sub="on drift event" color="#f7b955" bold />
      </g>
    </svg>
  );
}

function Block({ x, y, w, h, title, sub, color, bold }: {
  x: number; y: number; w: number; h: number;
  title: string; sub: string; color: string; bold?: boolean;
}) {
  const fill = `${color}14`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6"
            fill={fill} stroke={color} strokeWidth={bold ? 1.5 : 1} />
      <text x={x + w / 2} y={y + 18} fill="#e2e8f0" fontSize="13"
            textAnchor="middle" fontWeight={bold ? 600 : 500}>{title}</text>
      <text x={x + w / 2} y={y + h - 10} fill="#94a3b8" fontSize="10"
            textAnchor="middle" fontFamily="monospace" letterSpacing="0.5">{sub}</text>
    </g>
  );
}

function BleStackDiagram() {
  return (
    <svg viewBox="0 0 900 300" width="100%" style={{ display: 'block' }}>
      <defs>
        <marker id="arrow2" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
      </defs>

      {/* CENTRAL side */}
      <g>
        <rect x="30" y="30" width="280" height="240" rx="10"
              fill="rgba(94,234,212,0.04)" stroke="#5eead4" strokeWidth="1.3" />
        <text x="170" y="20" fill="#5eead4" fontSize="11" textAnchor="middle"
              fontFamily="monospace" letterSpacing="1">CENTRAL · PHONE</text>

        <StackRow x={50} y={50} label="Application" sub="dashboard · planner · drift" color="#5eead4" />
        <StackRow x={50} y={90} label="GATT client" sub="subscribe · decode" color="#5eead4" />
        <StackRow x={50} y={130} label="ATT" sub="handle-based read/notify" color="#5eead4" />
        <StackRow x={50} y={170} label="L2CAP" sub="fragmentation" color="#5eead4" />
        <StackRow x={50} y={210} label="HCI · Link Layer" sub="1 M PHY · conn. 7.5 ms" color="#5eead4" />
      </g>

      {/* Wireless link */}
      <g>
        <text x="450" y="100" fill="#f7b955" fontSize="11" textAnchor="middle"
              fontFamily="monospace" letterSpacing="1">◈ 2.4 GHz ◈</text>
        <path d="M 310 150 Q 450 130 590 150" stroke="#f7b955"
              strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
        <path d="M 590 150 Q 450 170 310 150" stroke="#f7b955"
              strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
        <text x="450" y="200" fill="#94a3b8" fontSize="10" textAnchor="middle"
              fontFamily="monospace">advertising · connection · notify</text>
      </g>

      {/* PERIPHERAL side */}
      <g>
        <rect x="590" y="30" width="280" height="240" rx="10"
              fill="rgba(251,113,133,0.04)" stroke="#fb7185" strokeWidth="1.3" strokeDasharray="4 4" />
        <text x="730" y="20" fill="#fb7185" fontSize="11" textAnchor="middle"
              fontFamily="monospace" letterSpacing="1">PERIPHERAL · WEARABLE</text>

        <StackRow x={610} y={50} label="Firmware (ESP-IDF)" sub="sensor loop · 1 kHz" color="#fb7185" />
        <StackRow x={610} y={90} label="GATT server" sub="0xFCA1 Focus Sensor svc" color="#fb7185" />
        <StackRow x={610} y={130} label="ATT" sub="indicate · notify" color="#fb7185" />
        <StackRow x={610} y={170} label="L2CAP" sub="ATT_MTU = 247 B" color="#fb7185" />
        <StackRow x={610} y={210} label="HCI · Link Layer" sub="NimBLE / NimBLE-NUS" color="#fb7185" />
      </g>
    </svg>
  );
}

function StackRow({ x, y, label, sub, color }: {
  x: number; y: number; label: string; sub: string; color: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width="240" height="30" rx="4"
            fill={`${color}14`} stroke={color} strokeWidth="0.8" />
      <text x={x + 12} y={y + 19} fill="#e2e8f0" fontSize="12" fontWeight={500}>{label}</text>
      <text x={x + 230} y={y + 19} fill="#94a3b8" fontSize="10"
            textAnchor="end" fontFamily="monospace">{sub}</text>
    </g>
  );
}

function SignalPipelineDiagram() {
  const stages = [
    { label: 'RAW PPG',        sub: '50 Hz · int16',    color: '#fb7185' },
    { label: 'HP FILTER',      sub: 'fc = 0.5 Hz',      color: '#f7b955' },
    { label: 'BAND-PASS',      sub: '0.8–3.0 Hz',       color: '#f7b955' },
    { label: 'MOVING AVG',     sub: 'N = 5',            color: '#f7b955' },
    { label: 'PEAK DETECT',    sub: 'refract. 300 ms',  color: '#a78bfa' },
    { label: 'HR BUFFER',      sub: '30-sample rolling', color: '#5eead4' },
    { label: 'HR · BPM',       sub: '60000 / Δ̄',        color: '#5eead4' },
  ];

  const boxW = 110, boxH = 64, gap = 14;
  const total = stages.length * boxW + (stages.length - 1) * gap;
  const startX = (900 - total) / 2;

  return (
    <svg viewBox="0 0 900 160" width="100%" style={{ display: 'block' }}>
      <defs>
        <marker id="arrow3" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
      </defs>

      {stages.map((s, i) => {
        const x = startX + i * (boxW + gap);
        return (
          <g key={i}>
            <rect x={x} y={50} width={boxW} height={boxH} rx="6"
                  fill={`${s.color}14`} stroke={s.color} strokeWidth="1.1" />
            <text x={x + boxW / 2} y={75} fill="#e2e8f0" fontSize="12"
                  textAnchor="middle" fontWeight={600}>{s.label}</text>
            <text x={x + boxW / 2} y={96} fill="#94a3b8" fontSize="10"
                  textAnchor="middle" fontFamily="monospace">{s.sub}</text>
            {i < stages.length - 1 && (
              <line x1={x + boxW} y1={82} x2={x + boxW + gap - 2} y2={82}
                    stroke="#94a3b8" strokeWidth="1.3" markerEnd="url(#arrow3)" />
            )}
          </g>
        );
      })}
    </svg>
  );
}
