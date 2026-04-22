'use client';

import { useEffect, useRef, useState } from 'react';

/* ===================================================================
   SIGNAL LAB
   - Generates synthetic PPG at 50 Hz
   - Optional moving-average filter
   - Peak detection with adaptive threshold + 300ms refractory
   - Live HR estimate, EDA readout, drift score
   =================================================================== */

const FS = 50;              // sample rate, Hz
const WINDOW_SECONDS = 10;  // canvas shows the last 10 seconds
const BUFFER_LEN = FS * WINDOW_SECONDS;

interface Peak { t: number; y: number; }   // t is global sample index

export default function SignalLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Pre-seed the buffer with 10 s of synthetic PPG so the scope is full on mount.
  // useState lazy init guarantees seedBuffers() runs exactly once.
  const [initial] = useState(() => seedBuffers(72));
  const sampleIdxRef = useRef(BUFFER_LEN);          // "we already produced BUFFER_LEN samples"
  const rawBufRef = useRef<number[]>(initial.seedRaw);
  const filtBufRef = useRef<number[]>(initial.seedFilt);
  const peaksRef = useRef<Peak[]>(initial.seedPeaks);
  const targetHrRef = useRef(72);
  const maBufRef = useRef<number[]>(initial.seedFilt.slice(-5));

  const [running, setRunning] = useState(true);
  const [showFiltered, setShowFiltered] = useState(true);
  const [showRaw, setShowRaw] = useState(true);
  const [artifact, setArtifact] = useState(false);

  const [hr, setHr] = useState(72);
  const [eda, setEda] = useState(4.8);
  const [motion, setMotion] = useState(0.12);
  const [drift, setDrift] = useState(0.28);

  // Wander target HR gently
  useEffect(() => {
    const i = setInterval(() => {
      targetHrRef.current = 66 + Math.random() * 18;
    }, 4200);
    return () => clearInterval(i);
  }, []);

  // Animate side readouts
  useEffect(() => {
    const i = setInterval(() => {
      setEda((v) => clamp(v + (Math.random() - 0.5) * 0.4, 2, 10));
      setMotion((v) => clamp(v + (Math.random() - 0.5) * 0.15, 0, 1));
      setDrift((v) => clamp(v + (Math.random() - 0.5) * 0.08, 0, 1));
    }, 900);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const MA_WINDOW = 5;

    const step = () => {
      if (!running) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      // ~3 samples per frame at 60fps → ~180 Hz ceiling; we cap by taking
      // only what's needed to reach 50 Hz average.
      const samplesThisFrame = Math.max(1, Math.round(FS / 60));
      for (let i = 0; i < samplesThisFrame; i++) {
        const n = sampleIdxRef.current++;
        const t = n / FS;
        const hz = targetHrRef.current / 60;

        // Synthetic PPG: fundamental + harmonic + baseline wander + noise (+ optional motion artifact)
        const beat =
          Math.sin(2 * Math.PI * hz * t) +
          0.35 * Math.sin(4 * Math.PI * hz * t + 0.7);
        const wander = 0.3 * Math.sin(2 * Math.PI * 0.1 * t);
        const noise = (Math.random() - 0.5) * 0.25;
        const motionArt = artifact ? 1.1 * Math.sin(2 * Math.PI * 6 * t) : 0;
        const raw = beat + wander + noise + motionArt;

        rawBufRef.current.push(raw);
        rawBufRef.current.shift();

        // Moving-average filter
        maBufRef.current.push(raw);
        if (maBufRef.current.length > MA_WINDOW) maBufRef.current.shift();
        const avg =
          maBufRef.current.reduce((s, x) => s + x, 0) / maBufRef.current.length;
        filtBufRef.current.push(avg);
        filtBufRef.current.shift();
      }

      detectPeaks(filtBufRef.current, peaksRef.current, sampleIdxRef.current);
      const bpm = estimateBpm(peaksRef.current);
      if (bpm > 30 && bpm < 200) setHr(Math.round(bpm));

      draw(ctx, canvas, rawBufRef.current, filtBufRef.current, peaksRef.current,
           sampleIdxRef.current, { showRaw, showFiltered });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [running, showRaw, showFiltered, artifact]);

  return (
    <div>
      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">05 · LIVE</span>
            <span className="dd-panel-title">Signal Lab — synthetic PPG + DSP pipeline</span>
          </div>
          <div className="dd-chip is-cyan">● STREAMING @ 50 Hz</div>
        </div>

        <div className="dd-body" style={{ marginBottom: '1rem' }}>
          This isn&apos;t stock footage — it&apos;s a real DSP pipeline running
          in your browser on a synthetic PPG stream. The raw trace is a
          heart-rate fundamental plus harmonic, baseline wander, and noise. The
          filter is a 5-tap moving average; peaks are detected with an adaptive
          threshold (mean + 0.35·σ) and a 300&nbsp;ms refractory window; heart
          rate is estimated from the mean inter-peak interval. Toggle the motion
          artifact to see how the raw signal gets corrupted while the filter
          + peak detector stay stable.
        </div>

        <div className="dd-lab-grid">
          {/* SCOPE */}
          <div className="dd-scope">
            <div className="dd-scope-head">
              <div className="dd-scope-head-left">
                <span style={{ color: 'var(--dd-rose)' }}>● RAW</span>
                <span style={{ color: 'var(--dd-cyan)' }}>● FILTERED</span>
                <span style={{ color: 'var(--dd-amber)' }}>▼ PEAK</span>
              </div>
              <span>CH1 · PPG · 50 Hz · 10 s</span>
            </div>
            <canvas ref={canvasRef} className="dd-scope-canvas" />
            <div className="dd-scope-footer">
              <span>{running ? '▶ RUN' : '⏸ PAUSED'}</span>
              <span>BUFFER {BUFFER_LEN} SAMP · ADAPTIVE THRESH · REFR. 300 ms</span>
            </div>

            <div className="dd-toggle-row">
              <button className={`dd-toggle ${running ? 'is-on' : ''}`}
                      onClick={() => setRunning((r) => !r)}>
                {running ? '⏸ PAUSE' : '▶ RUN'}
              </button>
              <button className={`dd-toggle ${showRaw ? 'is-on' : ''}`}
                      onClick={() => setShowRaw((s) => !s)}>RAW</button>
              <button className={`dd-toggle ${showFiltered ? 'is-on' : ''}`}
                      onClick={() => setShowFiltered((s) => !s)}>FILTER</button>
              <button className={`dd-toggle ${artifact ? 'is-on' : ''}`}
                      onClick={() => setArtifact((a) => !a)}>+ MOTION ART.</button>
            </div>
          </div>

          {/* READOUTS */}
          <div>
            <div className="dd-readout">
              <div className="dd-readout-label">HEART RATE</div>
              <div className="dd-readout-value is-rose">
                {hr}<span className="dd-readout-unit">BPM</span>
              </div>
              <div className="dd-readout-delta">filtered · 8-interval rolling mean</div>
            </div>
            <div className="dd-readout">
              <div className="dd-readout-label">EDA (SIM)</div>
              <div className="dd-readout-value is-cyan">
                {eda.toFixed(1)}<span className="dd-readout-unit">µS</span>
              </div>
              <div className="dd-readout-delta">tonic skin conductance</div>
            </div>
            <div className="dd-readout">
              <div className="dd-readout-label">MOTION</div>
              <div className="dd-readout-value is-amber">
                {motion.toFixed(2)}<span className="dd-readout-unit">|a|</span>
              </div>
              <div className="dd-readout-delta">IMU accel magnitude · 25 Hz</div>
            </div>
            <div className="dd-readout"
                 style={drift > 0.7 ? { borderColor: 'var(--dd-rose)' } : undefined}>
              <div className="dd-readout-label">DRIFT SCORE</div>
              <div className="dd-readout-value"
                   style={{ color: drift > 0.7 ? 'var(--dd-rose)' : 'var(--dd-text)' }}>
                {drift.toFixed(2)}
              </div>
              <div className="dd-readout-delta">
                {drift > 0.7 ? '⚠ check-in fired' : 'within envelope'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   DSP & rendering helpers
   =================================================================== */

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Seed the raw + filtered buffers with BUFFER_LEN samples of synthetic PPG,
 * running the same pipeline we use in the live loop. Also detect peaks on
 * the filtered buffer so HR markers show up immediately on mount.
 * Global sample index for the seed spans [0, BUFFER_LEN).
 */
function seedBuffers(initialHr: number) {
  const seedRaw: number[] = new Array(BUFFER_LEN);
  const seedFilt: number[] = new Array(BUFFER_LEN);
  const maWin = 5;
  const ma: number[] = [];
  const hz = initialHr / 60;

  // Deterministic-ish noise for a stable seed (uses Math.random; fine on client)
  for (let i = 0; i < BUFFER_LEN; i++) {
    const t = i / FS;
    const beat =
      Math.sin(2 * Math.PI * hz * t) +
      0.35 * Math.sin(4 * Math.PI * hz * t + 0.7);
    const wander = 0.3 * Math.sin(2 * Math.PI * 0.1 * t);
    const noise = (Math.random() - 0.5) * 0.25;
    const raw = beat + wander + noise;
    seedRaw[i] = raw;

    ma.push(raw);
    if (ma.length > maWin) ma.shift();
    seedFilt[i] = ma.reduce((s, x) => s + x, 0) / ma.length;
  }

  // Detect peaks in the seed using the same algorithm (simplified scan over full window)
  const mean = seedFilt.reduce((s, x) => s + x, 0) / seedFilt.length;
  const variance =
    seedFilt.reduce((s, x) => s + (x - mean) ** 2, 0) / seedFilt.length;
  const sd = Math.sqrt(variance);
  const thresh = mean + 0.35 * sd;
  const refractory = Math.floor(0.3 * FS);
  const seedPeaks: Peak[] = [];
  for (let i = 2; i < BUFFER_LEN - 2; i++) {
    if (seedPeaks.length && i - seedPeaks[seedPeaks.length - 1].t < refractory) continue;
    const y = seedFilt[i];
    if (y > thresh &&
        y > seedFilt[i - 1] && y > seedFilt[i - 2] &&
        y > seedFilt[i + 1] && y > seedFilt[i + 2]) {
      seedPeaks.push({ t: i, y });
    }
  }

  return { seedRaw, seedFilt, seedPeaks };
}

function detectPeaks(buf: number[], peaks: Peak[], sampleIdx: number) {
  // Visible window in global sample space: [sampleIdx - BUFFER_LEN, sampleIdx)
  const bufStart = sampleIdx - BUFFER_LEN;

  // Drop peaks that scrolled off
  while (peaks.length && peaks[0].t < bufStart) peaks.shift();

  // Scan only the newest ~1 second of samples — earlier ones were already checked
  const scanLen = FS;
  const scanFrom = Math.max(2, buf.length - scanLen);
  const scanTo = buf.length - 2;

  // Adaptive threshold over the last 2 seconds
  const N = FS * 2;
  const segStart = buf.length - N;
  const seg = buf.slice(segStart);
  const mean = seg.reduce((s, x) => s + x, 0) / seg.length;
  const variance = seg.reduce((s, x) => s + (x - mean) ** 2, 0) / seg.length;
  const sd = Math.sqrt(variance);
  const thresh = mean + 0.35 * sd;

  const refractory = Math.floor(0.3 * FS);
  const lastPeakT = peaks.length ? peaks[peaks.length - 1].t : -Infinity;

  for (let i = scanFrom; i < scanTo; i++) {
    const globalT = bufStart + i;
    if (globalT - lastPeakT < refractory) continue;

    const y = buf[i];
    if (y > thresh &&
        y > buf[i - 1] && y > buf[i - 2] &&
        y > buf[i + 1] && y > buf[i + 2]) {
      if (peaks.length === 0 || globalT - peaks[peaks.length - 1].t >= refractory) {
        peaks.push({ t: globalT, y });
      }
    }
  }
}

function estimateBpm(peaks: Peak[]): number {
  if (peaks.length < 4) return 0;
  const recent = peaks.slice(-8);
  const intervals: number[] = [];
  for (let i = 1; i < recent.length; i++) {
    intervals.push((recent[i].t - recent[i - 1].t) / FS);
  }
  const mean = intervals.reduce((s, x) => s + x, 0) / intervals.length;
  return 60 / mean;
}

function draw(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  rawBuf: number[],
  filtBuf: number[],
  peaks: Peak[],
  sampleIdx: number,
  opts: { showRaw: boolean; showFiltered: boolean }
) {
  const rect = canvas.getBoundingClientRect();
  const W = rect.width;
  const H = rect.height;

  ctx.clearRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const x = (i / 10) * W;
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let i = 0; i <= 4; i++) {
    const y = (i / 4) * H;
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Center line (zero)
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
  ctx.setLineDash([2, 4]);
  ctx.beginPath();
  ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
  ctx.setLineDash([]);

  const amp = H * 0.32;
  const xStep = W / (BUFFER_LEN - 1);

  if (opts.showRaw) {
    ctx.strokeStyle = 'rgba(251, 113, 133, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < rawBuf.length; i++) {
      const x = i * xStep;
      const y = H / 2 - rawBuf[i] * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  if (opts.showFiltered) {
    ctx.strokeStyle = '#5eead4';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = 'rgba(94, 234, 212, 0.4)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let i = 0; i < filtBuf.length; i++) {
      const x = i * xStep;
      const y = H / 2 - filtBuf[i] * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Peak markers — convert global peak index to local buffer index
  const bufStart = sampleIdx - BUFFER_LEN;
  ctx.fillStyle = '#f7b955';
  for (const p of peaks) {
    const localI = p.t - bufStart;
    if (localI < 0 || localI >= BUFFER_LEN) continue;
    const x = localI * xStep;
    const y = H / 2 - (filtBuf[localI] ?? 0) * amp;
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x - 4, y - 16);
    ctx.lineTo(x + 4, y - 16);
    ctx.closePath();
    ctx.fill();
  }
}
