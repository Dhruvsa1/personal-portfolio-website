# Discovery Project — 5-Minute Presentation Script

**Course:** ECE 1100 · Spring 2026
**Due:** Wednesday 12:30 pm
**Format:** Virtual (Zoom/Teams), recorded
**Deliverable:** Tour the Discovery Project feature on your ePortfolio — no slide deck
**URL to open on-screen:** `http://<your-portfolio>/discovery`

---

## Before you present — 2-minute setup

1. Open the portfolio in a full-screen browser tab. Hide bookmarks bar, close extensions sidebar.
2. Navigate directly to **`/discovery`** — don't make them watch you load the home page first.
3. Make sure the dashboard is on **Overview**. Zoom browser to ~110% so text is readable on the recorded Zoom share.
4. Have the **Signal Lab** sub-tab ready in case you want to show it a second time.
5. If you recorded a walkthrough MP4, drop it into `public/discovery/walkthrough.mp4` so the Videos tab has something to play — otherwise don't go to that tab.

---

## The 5-minute tour (script)

This maps to the **5 rubric items**: Idea · Progress · ECE Skill · Overall Experience · Presentation. Hit each one explicitly.

### 0:00 – 0:30 · Opening (rubric: "Discovery Project Idea")

> *On Overview tab.*

> "Hey everyone, I'm Dhruvsai. My Discovery Project is a system I called the **Time Token Planner plus a wearable Focus Sensor**. The pitch was: treat the 1,440 minutes in your day like a spendable budget, and pair it with a wrist-worn sensor that picks up physiological signals — heart rate, skin conductance, motion — to detect when you're drifting off-task. When it sees drift, the app replans your day automatically.
>
> The ECE angle was deliberate: I wanted hands-on exposure to **embedded sensor front-ends, Bluetooth Low Energy protocol design, and digital signal processing** — those are the three things I was targeting when I wrote the pitch."

**Action:** Point at the watch mockup on the right side of Overview. Point at the 4 status tiles — "pitch approved 50 out of 50, scope pivoted hardware to software, prototype shipped, 5 ECE skill areas."

---

### 0:30 – 1:30 · Walkthrough + the pivot (rubric: "Project Progress" — successes AND failures)

> *Click sidebar → "01 Walkthrough".*

> "Here's what actually happened over the semester. Problem, process, outcome. The problem: students plan their day and then drift — phones, fatigue, rabbit holes. Existing productivity apps track tasks but don't look at the state of the person doing them. My process was a wearable that flags drift and an app that replans.
>
> But I want to be honest about what happened — this is the pivot."

**Action:** Scroll down to the amber "PIVOT" callout.

> "Between pitch approval on February 16 and today, I couldn't secure the sensor kit — MAX30101 PPG plus GSR breakout — through the instructional labs in time to actually solder, debug, and test on-body. Parallel coursework and my internship ate the buffer.
>
> Around week 4, on March 21, I made the call to **descope the hardware** and commit fully to a software prototype. Rather than ship a half-working hardware stack with no app on top, I built a browser-based prototype that simulates the sensor stream with synthetic data and runs it through the **exact same filter and drift-detection pipeline** the wearable would have used. The ECE skills the project was meant to develop are all exercised in code — just without real wires. That was an engineering judgment call and I think it was the right one."

---

### 1:30 – 2:15 · Architecture (rubric bridge to "ECE Skill")

> *Click sidebar → "03 Architecture".*

> "I want to show you the system design, because this is where most of the embedded-systems thinking lives."

**Action:** Scroll through Figure 3.1 (system block diagram).

> "Red-dashed blocks are the pieces I descoped — the wearable with the PPG, EDA, IMU, and the ESP32. Solid blocks are what I actually built in software: the sample buffer, the filter pipeline, feature extraction, the drift detector, and the planner UI."

**Action:** Scroll to Figure 3.2.

> "This is the **BLE GATT service** I drafted during the research phase. Three notifying characteristics — PPG at 50 Hz, EDA plus IMU at 25, and a device-state characteristic. I sized each packet against a 7.5 millisecond connection interval on BLE 5 with the 1 megabit PHY. That's the kind of protocol-level thinking I wouldn't have touched without this project."

**Action:** Scroll to Figure 3.3.

> "And this is the signal processing pipeline — which I'm about to show you running live."

---

### 2:15 – 3:30 · Signal Lab demo (rubric: "ECE Skill" — the proof)

> *Click sidebar → "05 Live: Signal Lab".*

> "This isn't stock footage and it isn't a mock-up. This is a real DSP pipeline running in your browser right now. The **red trace is the raw synthetic PPG** — heart rate fundamental, a harmonic, baseline wander, noise. The **cyan trace is the filtered signal** after a 5-tap moving average. The **amber triangles are peaks** detected by an adaptive threshold algorithm — mean plus 0.35 sigma — with a 300 millisecond refractory window to reject double-triggers.
>
> The heart rate number on the right — 72 BPM — is computed from the mean inter-peak interval over an 8-interval rolling window. Sixty thousand divided by the average delta. That's real."

**Action:** Click the **"+ MOTION ART."** toggle.

> "Now watch what happens if I inject a motion artifact. The raw trace gets corrupted at a 6 Hz frequency — that's what real wrist-worn PPG looks like when someone's moving. But the filtered trace stays readable, and the peak detector keeps finding beats. That robustness is the whole point of doing the signal-processing work — and if I'd had the hardware, this same code would be running on the samples coming out of the MAX30101 over BLE."

**Action:** Toggle motion artifact off.

---

### 3:30 – 4:00 · Planner demo (rubric: "ECE Skill" continued — systems integration)

> *Click sidebar → "04 Live: Planner".*

> "The app side. The day is 1,440 minutes. Each colored segment in the budget bar is a task category — deep work, admin, rest, social, self-care. I type a task like **'studying 45m'** in natural text, and the parser allocates it into the budget."

**Action:** Click the input, type `studying 45m`, press Enter. Show the budget bar reshape.

> "The check-in panel on the right is how the drift-detection fires — a simple yes or no prompt. And the drift score at the bottom is the weighted heuristic from the design doc: 45 percent heart-rate delta, 35 percent stillness, 20 percent EDA rise. This is where the two halves of the system integrate — the signals feed the planner, the planner reschedules on drift."

---

### 4:00 – 4:45 · Reflections (rubric: "Overall Experience")

> *Click sidebar → "10 Reflections".*

> "The most valuable thing I got from this project wasn't the code — it was the experience of **scoping an ambitious project honestly** when reality didn't cooperate. My original pitch was over-scoped for one person on a semester schedule. Making the call to cut scope in March, instead of pushing on and producing nothing, is the same call a professional engineer has to make.
>
> Going in, I was torn between the **Computing** and **Devices** threads. This project pushed me toward Devices — the signal-side thinking was the part I enjoyed most. I'm planning on ECE 3550 Feedback Control and ECE 4180 Embedded Systems Design specifically because of what this project surfaced for me."

---

### 4:45 – 5:00 · Close (rubric: continuation)

> "I want to keep going on this. The MAX30101 and an ESP32 dev kit are under $30 on DigiKey. I can order them personally, get BLE bring-up working over the summer, and port the exact pipeline you just saw onto the MCU. The software prototype is a foundation — only the wires are missing.
>
> That's my Discovery Project. Happy to take questions."

---

## Anticipated questions & honest answers

**Q: Why didn't the instructional labs have the parts?**
A: "The availability was uncertain when I checked in February and March, and my window to actually build and debug kept getting compressed by other coursework. Rather than gamble on parts arriving in time, I made the scope call early enough to build something coherent."

**Q: Is the heart rate on your scope real?**
A: "It's computed from synthetic data, but the computation is real — the same peak-detection and HR-estimation code would run on real PPG samples. The signal is synthetic; the pipeline isn't."

**Q: Would this actually work on a wearable?**
A: "The heuristic as designed would need tuning on real physiological data — my drift weights are reasonable guesses, not trained parameters. That's explicitly in the &quot;what I'd do next&quot; section."

**Q: What did you learn that you couldn't have learned from a class?**
A: "Scoping. Every other engineering course gives you a bounded problem. This is the first time I had to decide, in the middle of a project, that the plan I'd written wasn't the plan I could execute — and that the right move was to cut rather than slip. That judgment doesn't come from a problem set."

**Q: What ECE skill are you most proud of gaining?**
A: "The BLE / GATT protocol design work. I didn't know what a service, characteristic, or connection interval was before this project. I can now draft a wireless sensor protocol against a bandwidth budget, and that's a concrete skill I'll use in Devices-thread coursework."

---

## Rubric self-check

| Rubric criterion | Hit at | Covered by |
|---|---|---|
| Discovery Project Idea | 0:00–0:30 | Overview narration |
| Project Progress (incl. failures) | 0:30–1:30 | Walkthrough + honest pivot |
| ECE Skill | 1:30–3:30 | Architecture + Signal Lab demo + Planner |
| Overall Experience | 4:00–4:45 | Reflections tab |
| Presentation (command of material) | entire | no reading off screen; conversational |
| Visuals on ePortfolio | entire | dashboard IS the visual |

---

## Recording your demo video (for the Videos tab)

If your PL wants a recorded video in addition to the live Zoom, or you want to have one ready as a backup:

**Windows:** Press `Win + G` → Xbox Game Bar → Record. Or install **OBS Studio** (free).
**macOS:** Press `⇧ + ⌘ + 5` → "Record Selected Portion" → draw around your browser → Record.

**Record this:**
1. Open `/discovery` on Overview (3 seconds of silence — frame).
2. Click through Walkthrough → Design Doc → Architecture → Signal Lab (interact with the toggles for 5 seconds) → Planner (add one task live) → Reflections. 60–90 seconds total, narration optional.
3. Save as `walkthrough.mp4`. Move to `public/discovery/walkthrough.mp4`. The Videos tab will auto-embed it.

---

## Last-mile polish checklist

- [ ] `/discovery` loads on Overview without errors
- [ ] Signal Lab waveform is already filling the scope when you arrive (no 10-second blank wait)
- [ ] You can add a task in the Planner on-camera without a typo
- [ ] Browser zoom at ~110% for readability on Zoom share
- [ ] Screen recording backup saved (optional)
- [ ] You've run through the script once out loud, timed it — aim for 4:30, leave buffer

You got this.
