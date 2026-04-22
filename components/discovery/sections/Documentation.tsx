'use client';

export default function Documentation() {
  return (
    <div>
      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">02 · DESIGN DOC</span>
            <span className="dd-panel-title">System requirements &amp; specifications</span>
          </div>
          <div className="dd-chip is-cyan">v0.3 · SW PROTOTYPE</div>
        </div>

        <div className="dd-doc dd-body">
          <h3>Functional requirements</h3>
          <table className="dd-doc-table">
            <thead>
              <tr><th>ID</th><th>Requirement</th><th>Priority</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>FR-01</td><td>User can enter tasks as natural text, see them allocated into a 1,440-minute daily budget.</td><td>P0</td><td style={{ color: 'var(--dd-cyan)' }}>SHIPPED</td></tr>
              <tr><td>FR-02</td><td>Budget visualization shows how minutes are split across task categories.</td><td>P0</td><td style={{ color: 'var(--dd-cyan)' }}>SHIPPED</td></tr>
              <tr><td>FR-03</td><td>Check-in modal asks yes/no &quot;still on task?&quot; prompts and logs the response.</td><td>P0</td><td style={{ color: 'var(--dd-cyan)' }}>SHIPPED</td></tr>
              <tr><td>FR-04</td><td>Synthetic wearable stream produces PPG + EDA + IMU samples at 50 Hz / 4 Hz / 25 Hz.</td><td>P0</td><td style={{ color: 'var(--dd-cyan)' }}>SHIPPED</td></tr>
              <tr><td>FR-05</td><td>Signal pipeline filters raw PPG, detects heart-rate peaks, emits HR in BPM.</td><td>P0</td><td style={{ color: 'var(--dd-cyan)' }}>SHIPPED</td></tr>
              <tr><td>FR-06</td><td>Drift heuristic combines HR drop + low IMU motion + elevated EDA into a single score.</td><td>P1</td><td style={{ color: 'var(--dd-amber)' }}>PROTOTYPE</td></tr>
              <tr><td>FR-07</td><td>Wearable hardware bring-up on ESP32 + MAX30101.</td><td>P0</td><td style={{ color: 'var(--dd-rose)' }}>DESCOPED</td></tr>
              <tr><td>FR-08</td><td>BLE GATT service streams samples to phone at &lt; 100 ms latency.</td><td>P0</td><td style={{ color: 'var(--dd-rose)' }}>DESCOPED</td></tr>
              <tr><td>FR-09</td><td>Native mobile client (iOS / Android).</td><td>P1</td><td style={{ color: 'var(--dd-rose)' }}>DESCOPED → WEB</td></tr>
            </tbody>
          </table>

          <h3>Planned BLE GATT service (wearable side)</h3>
          <p>
            Had the wearable been built, the device would have exposed a single
            primary service with three notifying characteristics. This is the
            design I drafted during the research phase — sized each packet
            against a 7.5 ms connection interval budget on BLE 5.0:
          </p>
          <pre className="dd-code">{`Service  0xFCA1  "Focus Sensor"
├── Char 0xFCA2  PPG samples        NOTIFY   4 B × 8 = 32 B @ 50 Hz
│    └── format: int16 ir, int16 red (little-endian)
├── Char 0xFCA3  EDA + IMU samples  NOTIFY   12 B        @ 25 Hz
│    └── format: uint16 eda, int16[3] accel, int16[3] gyro
├── Char 0xFCA4  Device state       READ|NOTIFY  6 B
│    └── format: uint8 battery, uint8 mode, uint32 millis
└── Char 0xFCA5  Config             WRITE    variable
     └── format: TLV — sample rate, LED power, feature flags`}</pre>

          <h3>Signal pipeline (what the Signal Lab actually runs)</h3>
          <pre className="dd-code">{`raw PPG @ 50 Hz
   │
   ▼
[ DC-remove ]         high-pass, fc = 0.5 Hz
   │
   ▼
[ Band-pass ]         0.8 – 3.0 Hz  (HR band)
   │
   ▼
[ Moving avg ]        N = 5 samples
   │
   ├── plot trace ────────▶ scope
   │
   ▼
[ Peak detect ]       adaptive threshold, refractory 300 ms
   │
   ▼
[ HR estimate ]       60 000 / mean(Δpeak_ms)
   │
   ▼
[ HR buffer ]         30-sample rolling window → output BPM`}</pre>

          <h3>Drift-detection heuristic</h3>
          <p>
            The drift score combines three normalized features into a weighted
            sum. Thresholds were chosen to be conservative — a single spike
            won&apos;t fire; three concurrent signals will:
          </p>
          <pre className="dd-code">{`drift = 0.45 * z(ΔHR_30s)       // heart rate falling
      + 0.35 * (1 - motion)     // stillness during work block
      + 0.20 * z(EDA_tonic)     // skin-conductance rise

fire check-in  if  drift > 0.7  for > 20 s
fire replan    if  drift > 0.9  for > 60 s`}</pre>

          <h3>Data model (planner)</h3>
          <pre className="dd-code">{`Task {
  id: uuid
  label: string
  minutes: int          // 5-480
  category: enum        // deep_work | admin | rest | social | self
  scheduledAt: datetime
  drift_events: DriftEvent[]
  check_ins: CheckIn[]
}

DriftEvent {
  ts: datetime
  score: float          // 0-1
  features: { dHR, motion, eda }
}

CheckIn {
  ts: datetime
  question: string
  answer: "yes" | "no" | "skip"
  led_to_replan: boolean
}`}</pre>

          <h3>Out of scope for this showcase</h3>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.2rem' }}>
            <li>Real hardware bring-up (descoped — see Walkthrough §Pivot)</li>
            <li>On-device firmware (would have been ESP-IDF / NimBLE)</li>
            <li>Voice-to-plan LLM integration (mocked in the planner demo)</li>
            <li>Battery life &amp; power management analysis</li>
            <li>Native mobile packaging — web prototype only</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
