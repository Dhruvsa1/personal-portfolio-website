# Discovery Project — Line-by-Line Presentation Script

**Total target time:** 4:45 – 5:00
**Open the page on:** `/discovery` → Overview tab
**Read each line out loud.** `[brackets]` = what to click. Pause where it says (pause).

---

## 0:00 — OVERVIEW (~30 sec)

> *Already on Overview tab when you start.*

"Hi, I'm Dhruvsai."

"My Discovery Project is the **Time Token Planner with a Focus Sensor**."

"The pitch was simple: your day has 1,440 minutes — treat them like a budget."

"Then pair it with a wrist sensor that reads your heart rate, motion, and skin conductance to detect when you're zoning out — so the app can step in and replan your day."

(pause — 1 second)

`[Click "01 Walkthrough" in the sidebar]`

---

## 0:30 — WALKTHROUGH (~75 sec)

"Here's how the project actually played out."

"The **problem**: students plan their day, then drift — phones, fatigue, rabbit holes. Existing productivity apps track tasks, but they don't watch the person."

"The **process** was: a wearable that flags drift, and an app that replans on top of it."

"The **outcome** — and I want to be honest about this — is a software-only prototype."

(pause — 2 seconds)

`[Scroll down to the orange PIVOT box]`

"Here's why."

"Between February and March, I couldn't get the sensor parts I needed through the instructional labs in time to actually solder, debug, and test the wearable on-body."

"In week four, I made the call to **descope the hardware** entirely."

"Rather than ship a half-working hardware stack with no app on top, I built the whole software side: the planner, the signal pipeline, the drift detector."

"The hardware is missing. The brain isn't."

(pause — 1 second)

`[Click "03 Architecture" in the sidebar]`

---

## 1:45 — ARCHITECTURE (~50 sec)

"This is the system design."

"Red dashed boxes are what got descoped. Solid boxes are what's actually running in the prototype."

(pause — 1 second)

"The wearable would have read three signals — **PPG for heart rate**, **EDA for skin conductance**, **IMU for motion** — and streamed them over Bluetooth to the phone."

"The phone runs the filter pipeline, extracts features like BPM, and outputs a drift score that drives the planner."

`[Scroll down to the BLE protocol stack diagram]`

"I designed the Bluetooth side end-to-end."

"This is the **GATT service** — three characteristics streaming sensor data, sized against a 7.5 millisecond connection interval on BLE 5."

"I didn't build it. But I specified it."

(pause — 1 second)

`[Click "04 Live: Planner" in the sidebar]`

---

## 2:35 — PLANNER DEMO (~30 sec)

"This is the planner UI, running live."

"Each colored block is a task category — deep work, rest, social, self-care. The full bar is your 1,440 minutes."

`[Click in the input field, type: studying 30m, press Enter]`

"Type a task, hit add, and the budget reshapes."

`[Point at the right side of the screen]`

"The check-in panel on the right is what the wearable would trigger."

`[Click the "NO ✗" button]`

"When you say no, the drift score rises and the system suggests a replan."

"That's how the two halves of the system talk to each other."

(pause — 1 second)

`[Click "05 Live: Signal Lab" in the sidebar]`

---

## 3:05 — SIGNAL LAB DEMO (~60 sec) — *the showpiece*

"And this is the brain of the wearable — the signal processing pipeline running live on simulated PPG data."

(pause — 1 second)

`[Point at the scope]`

"The **red line** is the raw sensor signal. Noisy, with baseline wander."

"The **cyan line** is the same signal after I run a filter to clean it up."

"The **amber triangles** are heartbeats my code detects using an adaptive threshold."

"And the **72 BPM** on the right is calculated from the average gap between those beats."

(pause — 2 seconds)

`[Click the "+ MOTION ART." button]`

"Now watch what happens when I add a motion artifact."

(pause — 2 seconds while audience sees the raw line go wild)

"The raw line goes crazy — that's what real wearable data looks like when someone moves their wrist."

"But the filtered line stays stable. The BPM stays accurate. That's the whole point of doing signal processing."

`[Click "+ MOTION ART." again to turn it off]`

"If I had the actual sensor, this exact code would run on its output."

"It's not a mock. It's the real pipeline fed simulated input."

(pause — 1 second)

`[Click "08 ECE Skills Gained" in the sidebar]`

---

## 4:05 — ECE SKILLS (~30 sec)

"The ECE skills I gained, mapped to evidence on the page."

"**Digital signal processing** — the filter and peak detector you just saw."

"**Bluetooth protocol design** — the GATT service in the architecture diagram."

"**Embedded systems thinking** — sensor selection and power budgeting."

"**Sensor front-end design** from the research phase."

"**Systems integration** tying it all together."

"And **engineering scoping** — the judgment to descope hardware when the timeline got tight."

(pause — 1 second)

`[Click "09 Reflections" in the sidebar]`

---

## 4:35 — REFLECTIONS + CLOSING (~25 sec)

"Quick reflection."

"Going in, I was torn between the **Computing** and **Devices** threads. This project pushed me toward Devices. The signal-side thinking was the part I enjoyed most."

"I'm planning to take **ECE 3550 Feedback Control** and **ECE 4180 Embedded Systems** specifically because of what this project surfaced for me."

(pause — 1 second)

"That's my Discovery Project."

"The design is real. The code is real. Only the hardware is missing — and that's a tractable summer build."

"Happy to take questions."

---

## Pre-recording checklist

- [ ] Browser zoomed to ~110%
- [ ] Already on `/discovery` Overview tab when recording starts
- [ ] Have this script open on a second monitor or printed out
- [ ] Read it through ONCE at conversational pace before hitting record
- [ ] Don't rush the Signal Lab demo — let the audience see the motion artifact toggle
- [ ] Breathe between sections
- [ ] If you stumble, don't restart — just pause and continue

## If they ask you a question after

**"Is the heart rate real?"**
> "It's computed from synthetic data, but the computation is real. The same code would run on samples from an actual MAX30101."

**"Why didn't you order the parts yourself?"**
> "I wanted to use the instructional labs since that's the channel the course encouraged. By the time it was clear that path wasn't going to work, my buffer for soldering and debug time was gone. I'm ordering the parts personally now to continue over the summer."

**"What's the most important ECE skill you took away?"**
> "Engineering scoping. Knowing when to cut a feature rather than ship something half-broken — that judgment doesn't come from a problem set."

**"Could this actually work on a wearable?"**
> "The pipeline yes — that's already production-ready code. The drift heuristic would need tuning on real physiological data. My weights are reasonable guesses, not trained values, and that's explicitly in my Reflections."
