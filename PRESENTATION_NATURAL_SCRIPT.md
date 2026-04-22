# Discovery Project — Natural Voice Script

**Target time:** ~5 minutes
**Open on:** `/discovery` Overview tab
**Style:** Sounds like you, not a polished script. Keep "basically", "obviously", "in a nutshell" — they're authentic.

---

## OVERVIEW

"Hi, I'm Dhruvsai."

"My Discovery Project was basically a **Time Token Planner plus a Focus and Boredom Sensor**."

"In a nutshell, there'd be a UI on a mobile app where you can plan out your day and allot your time for different tasks and block periods."

"And then there'd be a wearable device — like a watch — that tracks your heart rate, skin conductance, and motion using an IMU sensor."

"All that sensor data feeds into the app and decides whether you're actually doing the tasks you said you'd do at the start of the day."

`[Click "01 Walkthrough"]`

---

## WALKTHROUGH

"So the whole purpose of this — for me personally — is that I'd plan my day every morning and then drift off, get distracted, and not finish what I was supposed to."

"I wanted to build something that would keep me in check and make sure I actually stay locked in throughout the day."

"My timeline was: get the pitch approved first, then research the hardware components I'd need and how to integrate them with the software side."

*(pause — scroll to PIVOT box)*

"Now this is the honest part."

"I went to the instructional labs around three or four times trying to get the hardware. Each time they said the parts weren't available."

"I wasn't willing to drop a bunch of my own money on it, so that was a roadblock."

"I had to compromise and go software-only — which obviously isn't ideal, but I still got to apply a lot of the same ECE skills, just on the simulation side instead of real hardware."

`[Click "03 Architecture"]`

---

## ARCHITECTURE

"If I had built the wearable side, this is how it would've worked."

"You'd have a **PPG sensor** for heart rate, an **EDA sensor** for skin conductance, and an **IMU sensor** for motion — all connected to an **ESP32**, which is basically the brain of the wearable."

"The ESP32 would take all that sensor data and send it over Bluetooth to a phone."

"On the phone, the data goes through a pipeline where the noise gets filtered out and you get a **drift score** — basically one number that tells you how focused the user is."

`[Scroll to BLE diagram]`

"And then the way the wearable talks to the phone is through Bluetooth, using something called a **GATT service** — that's just the standard way Bluetooth devices share data."

"I researched how to set this up but obviously didn't actually build it since the hardware never came together."

`[Click "04 Live: Planner"]`

---

## PLANNER

"This is a sample of what the planner UI would look like — obviously formatted differently for a phone screen, but the idea is the same."

"You add tasks and break them down by time."

`[Click input, type: studying 30m, Enter]`

"For example, I could add 'studying for ECE 1100 — thirty minutes', hit add, and it updates the time I've allotted."

"Each color is a category — deep work, rest, social, that kind of thing."

"On the right is the live check-in. If you say no, it bumps your drift score and suggests a replan."

`[Click "NO ✗"]`

"And if you skip it, it just prompts you to replan that block of your day."

`[Click "05 Live: Signal Lab"]`

---

## SIGNAL LAB

"This is a simulation of what the signal data would look like coming from the wearable."

"The **red line is the raw, unfiltered data** — basically a bunch of noise that you'd get straight off the sensor."

"After it goes through the pipeline, you get the **cleaner cyan line** with the actual heartbeats showing through."

"Those **yellow triangles are the peaks** — each one is a heartbeat my code detected."

"And from the gaps between those peaks, you can calculate beats per minute, which you can see on the right — 72 BPM."

*(pause)*

`[Click "+ MOTION ART."]`

"Now if I add a motion artifact — basically simulating someone moving their wrist — the raw line gets messy, but the filtered line and the BPM stay stable."

"That's the whole point of the signal processing."

*(pause)*

"And based on those numbers, we figure out if the user is focused or not."

"For example, if your heart rate is slightly elevated, that usually means you're focused and working."

"If your IMU is fluctuating, you're probably typing or writing."

"If everything's just still, you're probably not doing anything — which bumps your drift score."

`[Click "+ MOTION ART." again]`

`[Click "07 Photos & References"]`

---

## PHOTOS & REFS *(quick — 15 seconds)*

"This is just all the components I researched for the hardware side."

"You can click on each one and it shows the specs and why I picked it."

`[Optional — click ESP32 card to open modal, then close]`

`[Click "08 ECE Skills Gained"]`

---

## ECE SKILLS

"So the ECE skills I picked up from this."

"**Digital Signal Processing** — I had to figure out how to take all those sensor inputs and fuse them into a pipeline that produces a drift score."

"**Wireless protocols** — I researched how the wearable would communicate with a mobile app over Bluetooth, including GATT service design."

"**Embedded systems thinking** — picking the right sensors, microcontroller, and power setup for a watch-sized device."

"**Sensor front-end design** — comparing different PPG and EDA modules during the research phase."

"**Systems integration** — the biggest one. Tying the simulated sensor data into the pipeline, into the drift score, into the planner UI — making it all one system."

"And honestly, **engineering scoping** — having to make the call to drop hardware when the timeline didn't work out. That's a real skill too."

`[Click "09 Reflections"]`

---

## REFLECTIONS *(here's the part you skipped last time — just read it)*

"For reflections — honestly, the project didn't go the way I planned, but I still got a lot out of it."

"**What worked**: planning the system on paper before coding made the software side a lot easier when I got to it."

"**What didn't work**: I underestimated how hard it'd be to get hardware. I should've gone to the labs in week one instead of week three."

"Coming into ECE 1100, I was honestly torn between **Computing** and **Devices** as a thread."

"This project pushed me more toward Devices — the signal processing side and thinking about sensors was the part I enjoyed the most."

"I'm planning to take **ECE 3550** and **ECE 4180** next because of what this project got me interested in."

*(pause)*

"And I'd actually like to keep working on this over the summer — the components are like thirty bucks total on DigiKey, so I can just buy them myself and finally build the wearable."

"That's my Discovery Project. Thanks — happy to answer any questions."

---

## Key swaps to remember

| Don't say | Say |
|---|---|
| "HP 32" | "ESP32" *(say it slow: E-S-P thirty-two)* |
| "ITT service" | "GATT service" *(rhymes with "cat")* |
| "single lab" | "signal lab" |
| "drift detector factor" | "drift score" |
| "I don't know what to say" | *just read the reflections section* |
