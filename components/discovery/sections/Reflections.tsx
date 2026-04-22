'use client';

export default function Reflections() {
  return (
    <div>
      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">10 · REFLECTIONS</span>
            <span className="dd-panel-title">Honest retro</span>
          </div>
          <div className="dd-chip is-violet">THREAD · DEVICES</div>
        </div>

        <div className="dd-reflect-grid">
          <div className="dd-reflect is-worked">
            <div className="dd-reflect-head">◆ WHAT WORKED</div>
            <ul className="dd-reflect-list">
              <li>Writing the GATT spec and signal pipeline on paper before any code — it made the eventual software prototype trivial to organize, because the interfaces were already defined.</li>
              <li>Treating synthetic signals as a first-class deliverable, not a compromise. The DSP pipeline in §05 would be the <strong>exact same code</strong> I&apos;d run on real PPG samples from a MAX30101 — it&apos;s not a mock, it&apos;s the real thing fed fake data.</li>
              <li>Making the scope-down call early enough (W4) to leave real time for a software prototype, instead of limping along with half-built hardware.</li>
            </ul>
          </div>

          <div className="dd-reflect is-didnt">
            <div className="dd-reflect-head">◆ WHAT DIDN&apos;T</div>
            <ul className="dd-reflect-list">
              <li>I underestimated the lead time on sensor access. I should have placed my parts request in week 1, not week 3.</li>
              <li>My original timeline assumed I&apos;d start BLE bring-up by week 4. In reality, weeks 1–3 were still decision-making on sensors. The bench time never materialized.</li>
              <li>I didn&apos;t build a fallback plan at pitch time. A &ldquo;software-only mode&rdquo; should have been in the spec from day one, not an emergency pivot.</li>
            </ul>
          </div>

          <div className="dd-reflect is-next">
            <div className="dd-reflect-head">◆ WHAT I&apos;D DO NEXT</div>
            <ul className="dd-reflect-list">
              <li>Order a MAX30101 + ESP32 DevKit personally (&lt;$30 total on DigiKey) and get BLE bring-up working over the summer.</li>
              <li>Port the existing DSP pipeline to ESP-IDF so it runs on the MCU itself — no phone needed for HR estimation.</li>
              <li>Replace the toy drift heuristic with a lightweight ML classifier trained on a public affect dataset.</li>
            </ul>
          </div>

          <div className="dd-reflect is-interest">
            <div className="dd-reflect-head">◆ INTEREST IN THE DEVICES THREAD</div>
            <ul className="dd-reflect-list">
              <li>Going in, I was torn between the Computing and Devices threads. This project pushed me toward <strong>Devices</strong> — the part of it I enjoyed most was the signal-side thinking: sample rates, quantization, filter tradeoffs.</li>
              <li>I want to take <em style={{ fontStyle: 'normal' }}>ECE 3550 Feedback Control</em> and <em style={{ fontStyle: 'normal' }}>ECE 4180 Embedded Systems Design</em> specifically because of what this project surfaced for me.</li>
              <li>I&apos;d continue this project — the prototype is real, the design is real, only the hardware is missing. That&apos;s a tractable summer build.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">10.1</span>
            <span className="dd-panel-title">Overall experience</span>
          </div>
        </div>
        <div className="dd-body">
          <p>
            The most valuable thing I took out of the Discovery Project wasn&apos;t
            the technical artifact — it was the experience of <strong>scoping
            an ambitious project honestly</strong> when reality doesn&apos;t cooperate.
            My original pitch was over-scoped for one person on a semester
            schedule. Making the call to collapse scope in March, rather than
            push on and produce nothing shippable, is the same call a
            professional engineer has to make on every real project.
          </p>
          <p>
            The software prototype is genuinely useful to me personally —
            I&apos;ll keep using the planner UI to organize my own days, and
            the signal pipeline is a foundation I can port to a real MCU the
            moment I have the parts. This project is continuing past the
            showcase; it&apos;s just a summer project now instead of a semester one.
          </p>
          <p style={{ color: 'var(--dd-text-faint)', fontStyle: 'italic' }}>
            &mdash; Dhruvsai Dhulipudi · ECE 1100 · Spring 2026
          </p>
        </div>
      </div>
    </div>
  );
}
