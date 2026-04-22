'use client';

const SKILLS = [
  {
    title: 'Digital Signal Processing',
    level: 'HANDS-ON',
    body: 'Built a synthetic PPG generator, a 5-tap moving-average filter, and an adaptive-threshold peak detector with a 300 ms refractory window. Implemented HR estimation from mean inter-peak interval.',
    evidence: '§05 Signal Lab · §02 Design Doc (pipeline block)',
  },
  {
    title: 'BLE / Wireless Protocols',
    level: 'DESIGNED',
    body: 'Drafted a GATT service layout with three notifying characteristics, sized each packet against a 7.5 ms connection interval on BLE 5.0, 1 M PHY. Chose NimBLE on ESP32 after comparing stacks.',
    evidence: '§03 Architecture (fig 3.2) · §02 Design Doc (GATT table)',
  },
  {
    title: 'Embedded Systems Thinking',
    level: 'DESIGNED',
    body: 'Picked sensors, sample rates, and bus topology against a power + bandwidth budget. Reasoned about I²C sharing between MAX30101 and MPU-6050, and EDA breakout via an external ADC.',
    evidence: '§07 Refs (sensor cards) · §03 Architecture (fig 3.1)',
  },
  {
    title: 'Sensor Front-End Design',
    level: 'RESEARCH',
    body: 'Compared PPG front-ends (MAX30101 vs MAX30102 vs AFE4420) on SNR, power, and supported sample rates. Studied electrode topology for EDA and motion-artifact characteristics of optical HR.',
    evidence: '§07 Refs · §06 Timeline (research phase)',
  },
  {
    title: 'Systems Integration',
    level: 'HANDS-ON',
    body: 'Wired the planner UI, the simulated sensor stream, the DSP pipeline, and the drift heuristic together into a single coherent software system with a shared data model.',
    evidence: '§04 Planner · §05 Signal Lab · §02 Data model',
  },
  {
    title: 'Engineering Scoping &amp; Tradeoffs',
    level: 'META',
    body: 'Made the call to descope hardware when the timeline became unrealistic rather than ship a broken end-to-end system. This is itself a core ECE judgment skill — knowing when to cut scope.',
    evidence: '§01 Walkthrough (Pivot) · §06 Timeline (W4 decision)',
  },
];

export default function EceSkills() {
  return (
    <div>
      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">09 · ECE SKILLS</span>
            <span className="dd-panel-title">What I actually learned</span>
          </div>
          <div className="dd-chip is-cyan">6 AREAS</div>
        </div>

        <div className="dd-body" style={{ marginBottom: '1rem' }}>
          Each skill card links back to the section of this dashboard that
          demonstrates it. &ldquo;HANDS-ON&rdquo; means I wrote code that exercises it;
          &ldquo;DESIGNED&rdquo; means I produced the engineering artifact (GATT
          spec, block diagram) without building hardware; &ldquo;RESEARCH&rdquo;
          means I did the comparative study; &ldquo;META&rdquo; means the
          project-management judgment that came with running this.
        </div>

        <div className="dd-skill-grid">
          {SKILLS.map((s, i) => (
            <div className="dd-skill-card" key={i}>
              <div className="dd-skill-head">
                <div className="dd-skill-title"
                     dangerouslySetInnerHTML={{ __html: s.title }} />
                <div className="dd-skill-level">{s.level}</div>
              </div>
              <div className="dd-skill-body">{s.body}</div>
              <div className="dd-skill-evidence">EVIDENCE · {s.evidence}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
