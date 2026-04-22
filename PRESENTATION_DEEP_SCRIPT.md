# Discovery Project — In-Depth Line-by-Line Script

**Total target time:** ~6 minutes (rubric says approximately 5; 6 is safe)
**Open:** `/discovery` → Overview tab
**How to use:** Read each line out loud. `[brackets]` = click action. *(italics)* = pause.
**If running long:** every line is independent — drop one sentence from any section, the script still flows.

---

## 0:00 — OVERVIEW (~70 seconds)

"Hi everyone, I'm Dhruvsai Dhulipudi, and this is my Discovery Project."

"The project is called the **Time Token Planner with a Focus and Boredom Sensor**."

"The idea came from a personal frustration. I plan my day every morning, write down what I want to get done — and by the afternoon I've drifted. Phone, fatigue, rabbit holes. The plan is basically dead by 3 PM."

"Existing productivity apps don't solve this because they only track tasks. They don't track whether you're actually engaged."

"So my pitch was a **two-part system**."

"Part one is a **planner app** where your day is a budget of 1,440 minutes — every minute you spend on something is a token out of that budget."

"Part two is a **wrist-worn sensor** — basically a smartwatch — that reads three physiological signals: your heart rate from a PPG sensor, your skin conductance from EDA electrodes, and your motion from an accelerometer."

"When the sensor detects you've zoned out, it tells the app — and the app either checks in on you, or auto-replans the rest of your day."

"That was the pitch back in February."

*(pause)*

`[Click "01 Walkthrough" in the sidebar]`

---

## 1:10 — WALKTHROUGH (~95 seconds)

"Here's how the project actually played out across the semester."

"This page breaks it into three stages — **Problem, Process, and Outcome**."

"The **problem**, as I mentioned: students plan their day, then drift. Existing apps track *what* you should be doing, but not whether you're actually doing it."

"The **process** was the wearable plus the app — physiological signals feed a drift detector, and the drift detector feeds the planner."

"The **outcome** is the part I want to be honest about. It's a software-only prototype. The hardware never got built."

*(pause — 2 seconds)*

`[Scroll down to the orange PIVOT callout]`

"Here's why."

"My original timeline assumed I'd have the parts kit by week two — a MAX30101 PPG sensor, an EDA breakout, an MPU-6050 IMU, and an ESP32 microcontroller — all sourced through the instructional labs."

"I visited the labs twice in February and March. Component availability was uncertain, and the window I had left to actually solder, debug, and bring up Bluetooth started shrinking fast as my other coursework piled on."

"In **week four — March 21st** — I made the call to descope the hardware entirely."

"Rather than show up here with a half-built wearable and no app on top, I spent the rest of the semester building **the entire software side** — the planner UI, the synthetic signal pipeline, the drift detector, all of it."

"The hardware is missing. But the brain — the part that turns raw sensor data into useful judgment — that's all here."

*(pause)*

`[Click "03 Architecture" in the sidebar]`

---

## 2:45 — ARCHITECTURE (~75 seconds)

"This is the system design — three diagrams that together describe what I designed and what I built."

"In Figure 3.1, the **red dashed boxes are descoped** — that's the wearable hardware side. The **solid boxes are running** — that's the software side I implemented."

"Reading left to right: the wearable would have read three signals at the sample rates listed — PPG at 50 hertz, EDA at 4 hertz, IMU at 25 hertz."

"Those signals stream over Bluetooth Low Energy to the phone."

"The phone runs the filter pipeline, extracts features like beats per minute, and outputs a **drift score** — a single number between 0 and 1 — that tells the planner whether the user is on-task or zoning out."

`[Scroll down to Figure 3.2 — the BLE diagram]`

"This is the Bluetooth side I designed end-to-end."

"The wearable would expose a **GATT service** with three notifying characteristics — one for PPG samples, one for EDA plus IMU, and one for device state."

"I sized each packet against a 7.5 millisecond connection interval on BLE 5 with the 1-megabit physical layer — which is what determines how often the wearable can push data without overflowing the radio buffer."

"I didn't get to flash this onto a chip. But I have a complete spec for it."

`[Click "04 Live: Planner" in the sidebar]`

---

## 4:00 — PLANNER DEMO (~45 seconds)

"This is the planner UI, running live in the browser."

"The horizontal bar at the top is your **1,440-minute daily budget**. Every colored block is a task, every color is a category — deep work in green, rest in gray, social in amber, self-care in red."

"You can see the categories tally up below the bar, with how many minutes go into each."

`[Click in the input field, type: studying 30m, press Enter]`

"You can add a task in plain English — 'studying 30m' — and the parser figures out the duration and category and slots it into the budget."

"On the right is the **live check-in panel**. This is what the wearable would trigger when it detects drift."

`[Click "NO ✗"]`

"When the user says they're not on task, the **drift score climbs** — and the system flags that the day should be replanned."

`[Click "05 Live: Signal Lab" in the sidebar]`

---

## 4:45 — SIGNAL LAB (~90 seconds) — *the showpiece*

"This is the most technically dense part of the project — the **Signal Lab**."

"Everything you see on this scope is running live in your browser on a **simulated PPG signal** — that's a photoplethysmogram, the same kind of signal an Apple Watch reads off your wrist using an LED and a photodetector."

`[Point at the scope]`

"The **red line** is the raw signal coming out of a hypothetical sensor — heart rate fundamental, baseline wander from breathing, and noise. This is messy, ugly data — exactly what real wearables produce."

"The **cyan line** is that same signal after I run it through a **moving-average filter**, five samples wide. The filter cleans up the noise without losing the heart-rate information underneath."

"The **amber triangles** are individual heartbeats my code detects, using an **adaptive threshold** — mean plus 0.35 standard deviations — with a 300-millisecond refractory window so it doesn't double-trigger on the same beat."

"And the **72 BPM** on the right is computed from the **average inter-peak interval** over the last 8 beats. Sixty thousand divided by the average gap in milliseconds."

*(pause — 2 seconds)*

`[Click "+ MOTION ART." button]`

"Now watch this."

*(pause — let the audience see the raw line corrupt for 2 seconds)*

"I'm injecting a motion artifact at 6 hertz — that's roughly what the signal looks like when someone's pumping their arm at the gym, or typing fast at a keyboard."

"The raw line gets destroyed. But the **filtered line stays stable**, the peak detector still finds the beats, and the BPM readout doesn't budge."

"That robustness is the entire point of doing **digital signal processing** — and if I had the real MAX30101 hardware, this same exact code would run on its output."

`[Click "+ MOTION ART." again to turn off]`

`[Click "08 ECE Skills Gained" in the sidebar]`

---

## 6:15 — ECE SKILLS (~45 seconds)

"These are the six ECE skill areas I touched, each tied back to a specific piece of the project."

"**Digital signal processing** — the filter, peak detector, and BPM estimator I just demoed."

"**Bluetooth and wireless protocols** — designing the GATT service and sizing packets against the connection interval."

"**Embedded systems thinking** — picking sensors, sample rates, and bus topology against power and bandwidth budgets."

"**Sensor front-end design** — comparing PPG modules, EDA topologies, and ADC requirements during the research phase."

"**Systems integration** — tying the simulated signal stream, the DSP pipeline, the drift heuristic, and the planner into one coherent system."

"And **engineering scoping and tradeoffs** — making the call to descope hardware when the timeline got tight, instead of pushing on and shipping nothing usable."

`[Click "09 Reflections" in the sidebar]`

---

## 7:00 — REFLECTIONS + CLOSE (~45 seconds)

"Quick reflection."

"**What worked**: writing the GATT spec and the signal pipeline on paper before I touched any code. By the time I started building, the interfaces were already defined."

"**What didn't**: I underestimated the lead time on parts. I should have placed my parts request in week one, not week three."

"Going in, I was torn between the **Computing** and **Devices** threads."

"This project pushed me toward Devices. The signal-side thinking — sample rates, filter design, feature extraction — was the part I enjoyed most."

"I'm planning to take **ECE 3550 Feedback Control** and **ECE 4180 Embedded Systems Design** specifically because of what this project surfaced for me."

*(pause)*

"That's my Discovery Project."

"The design is real. The code is real. Only the hardware is missing — and at under thirty dollars on DigiKey, that's a tractable summer build."

"Happy to take questions."

---

## Pre-recording checklist

- [ ] Browser at ~110% zoom
- [ ] On `/discovery` Overview tab when recording starts
- [ ] Script open on second monitor or printed out
- [ ] Read it once at conversational pace before hitting record
- [ ] Don't rush the Signal Lab — let the motion artifact toggle breathe
- [ ] Breathe between sections, especially after PIVOT callout

## Q&A prep

**"Is the heart rate real?"**
> "Computed from synthetic data, but the computation is real. The same code would run on samples from an actual MAX30101."

**"Why didn't you just order the parts yourself?"**
> "I wanted to use the channel the course encouraged. By the time it was clear the labs path wasn't going to work, my buffer for soldering and debug time was gone. I'm ordering parts personally now to continue this over the summer."

**"What's the most important ECE skill you took away?"**
> "Engineering scoping. Knowing when to cut a feature rather than ship something half-broken — that judgment doesn't come from a problem set."

**"Could this actually work as a real wearable?"**
> "The pipeline yes — that's already production-ready code. The drift heuristic would need tuning on real physiological data. My weights are reasonable engineering guesses, not trained values, and that's explicitly in my Reflections section."

**"What's a GATT service?"**
> "It's how Bluetooth Low Energy organizes data — like a directory of variables the wearable exposes, that the phone can read or subscribe to. I designed three: one for PPG samples, one for EDA + IMU, one for device state."

**"What does PPG stand for?"**
> "Photoplethysmogram. An LED shines into your skin, a photodetector measures how much light bounces back, and the variation tracks your blood-volume pulse — which is your heartbeat."
