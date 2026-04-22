'use client';

export default function Walkthrough() {
  return (
    <div>
      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">01 · WALKTHROUGH</span>
            <span className="dd-panel-title">Problem · Process · Outcome</span>
          </div>
          <div className="dd-chip is-cyan">DESIGN THINKING</div>
        </div>

        <div className="dd-pipe-grid">
          <div className="dd-stage is-problem">
            <div className="dd-stage-code">01 · THE PROBLEM</div>
            <div className="dd-stage-title">Time slips away and nobody notices.</div>
            <p className="dd-stage-body">
              Students plan their day, then drift — phone, fatigue, rabbit holes.
              The plan becomes a lie after the first interruption because nothing
              is watching the <em>state of the person</em> executing it. Existing
              productivity apps track tasks, not attention.
            </p>
          </div>

          <div className="dd-stage is-process">
            <div className="dd-stage-code">02 · THE PROCESS</div>
            <div className="dd-stage-title">A wearable that flags drift, an app that replans.</div>
            <p className="dd-stage-body">
              Pitch: an ESP32-class wearable streams PPG (heart rate), EDA (skin
              conductance), and IMU data over BLE to a phone app. The app runs a
              drift-detection heuristic against the current time-budget block and
              fires a check-in or auto-reschedules if the user looks off-task.
            </p>
          </div>

          <div className="dd-stage is-outcome">
            <div className="dd-stage-code">03 · THE OUTCOME</div>
            <div className="dd-stage-title">A software prototype of both halves.</div>
            <p className="dd-stage-body">
              Hardware access didn't come together in time. The project was
              rescoped to a <strong>browser-based prototype</strong> that
              implements the planner UI end-to-end and simulates the sensor
              stream with synthetic PPG/EDA data running through the same filter
              &amp; drift-detection logic the wearable would have used.
            </p>
          </div>
        </div>

        {/* Honest pivot callout */}
        <div className="dd-pivot">
          <div className="dd-pivot-icon">⚠ PIVOT</div>
          <div style={{ color: 'var(--dd-text-dim)', fontSize: '0.92rem', lineHeight: 1.6 }}>
            <strong>What actually happened:</strong> between the pitch approval
            (Feb 16) and the showcase, I couldn't secure the sensor kit I'd
            planned on (MAX30101 PPG + GSR breakout) through the instructional
            labs in a timeframe that left room to build, debug, and test on-body.
            Parallel coursework &amp; internship commitments ate the buffer I had
            penciled in for soldering &amp; BLE bring-up.
            <br /><br />
            <strong>The call:</strong> rather than produce a half-working hardware
            stack with no software on top, I collapsed scope to a
            <em style={{ color: 'var(--dd-amber)', fontStyle: 'normal' }}> software-only prototype</em> that
            faithfully models the signal side with simulated data, and builds the
            app-side UX end-to-end. The ECE skills the project was meant to
            develop — BLE protocol design, signal filtering, feature extraction,
            systems integration — are all exercised in code, just without
            real wires.
          </div>
        </div>
      </div>

      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">01.1</span>
            <span className="dd-panel-title">Journey, step by step</span>
          </div>
        </div>
        <div className="dd-body">
          <p><strong>Feb 16 · Pitch approved (50/50).</strong> Initial scope had three systems:
          the wearable, the BLE link, and the planner app. Ambitious — I knew hardware was the long pole.</p>

          <p><strong>Feb 17 – Mar 1 · Research phase.</strong> I compared PPG modules
          (MAX30101, MAX30102, AFE4420), EDA front-end options, and BLE stacks
          on ESP32 vs. nRF52. I drafted a GATT service table for the wearable
          (see §03 Architecture) and picked the signal features I wanted to
          extract — HR, HRV RMSSD, EDA tonic level, IMU motion-energy.</p>

          <p><strong>Mar 2 – Mar 20 · Hardware planning stalls.</strong> I visited
          the instructional labs twice to inquire about the components on my
          parts list. Availability was uncertain and the window to actually
          solder + debug started looking tight given my other courseload. I
          continued working on the app side assuming a late start on hardware.</p>

          <p><strong>Mar 21 · The scope call.</strong> I made the decision to cut
          hardware from the MVP and commit fully to the software prototype,
          with synthetic signals standing in for real sensors. This was the
          right engineering call given the time left — better to ship a
          coherent half than a broken whole.</p>

          <p><strong>Mar 22 – Apr 18 · Software build.</strong> Built the
          time-token planner UI, the synthetic signal generator, the filter
          pipeline, the HR peak detector, and the drift heuristic. Wired them
          into this portfolio page as interactive demos.</p>

          <p><strong>Apr 21 · Showcase.</strong> This dashboard is the deliverable.</p>
        </div>
      </div>
    </div>
  );
}
