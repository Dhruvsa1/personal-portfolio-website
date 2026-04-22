'use client';

import { useEffect, useState } from 'react';

/* ===================================================================
   PHOTOS & REFERENCES
   Each card is a hand-drawn SVG sketch of a component researched
   during the pitch phase — clearly a research reference, not a
   personal-hardware photo.
   Click any card to open a modal with a real product image from the
   internet, the original concept sketch, full specs, and a link
   to the authoritative source.
   =================================================================== */

interface Ref {
  id: string;
  title: string;
  sub: string;
  note: string;
  tag: string;
  svg: React.ReactNode;
  /** URL to a real photo of this component from the internet. */
  realImageUrl: string;
  /** Authoritative reference page (Wikipedia / datasheet / etc.). */
  sourceUrl: string;
  sourceLabel: string;
  /** Full spec table shown in the modal. */
  specs: [string, string][];
  /** Longer description shown in the modal. */
  longDesc: string;
}

const REFS: Ref[] = [
  {
    id: 'max30101',
    title: 'MAX30101 PPG sensor',
    sub: 'BREAKOUT · 3.3 V · I²C',
    note: 'Photoplethysmograph LED + photodiode package. Short-listed as the HR sensor front-end. Samples at 50 Hz via I²C FIFO.',
    tag: 'SENSOR · HR',
    svg: <PpgSensorSvg />,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/MAX30100_Sensor.jpg/400px-MAX30100_Sensor.jpg',
    sourceUrl: 'https://www.analog.com/en/products/max30101.html',
    sourceLabel: 'Analog Devices product page',
    longDesc:
      'An integrated pulse-oximetry and heart-rate monitor module. Contains red + IR LEDs, a photodetector, low-noise analog front-end, and a 32-sample FIFO accessed over I²C. I evaluated this against the MAX30102 and AFE4420 based on SNR, power, and sample-rate flexibility.',
    specs: [
      ['Package',      '5.6 × 3.3 × 1.55 mm OESIP'],
      ['Supply',       '1.8 V + 3.3 V'],
      ['Interface',    'I²C, up to 400 kHz'],
      ['LEDs',         'Red, IR, Green (3-ch)'],
      ['Sample rate',  '50–3200 Hz'],
      ['Resolution',   '18-bit ADC'],
      ['Power',        '~0.7 mA typ @ 50 Hz'],
    ],
  },
  {
    id: 'eda',
    title: 'GSR / EDA electrodes',
    sub: 'Ag/AgCl pads · 2-wire',
    note: 'Skin-conductance sensing via two finger electrodes into a differential-amp + ADC front-end. Researched as the arousal proxy.',
    tag: 'SENSOR · EDA',
    svg: <EdaSensorSvg />,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Galvanic_Skin_Response_Sensor.jpg/400px-Galvanic_Skin_Response_Sensor.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Electrodermal_activity',
    sourceLabel: 'Electrodermal activity — Wikipedia',
    longDesc:
      'Galvanic-skin-response / electrodermal-activity sensing measures the electrical conductance of the skin, which varies with sweat-gland activity and sympathetic nervous system arousal. Two Ag/AgCl electrodes feed a differential amplifier, then an ADC samples the signal at 4–10 Hz. Used in affective computing, lie detection, and stress-biofeedback systems.',
    specs: [
      ['Signal',         '0.5 – 30 µS (microsiemens) typical'],
      ['Front-end',      'Differential op-amp + RC filter'],
      ['ADC resolution', '16-bit recommended'],
      ['Sample rate',    '4 Hz (tonic) · 20 Hz (phasic)'],
      ['Electrode',      'Ag/AgCl · fingertip or palm'],
      ['Latency',        '1–3 s response to stimulus'],
    ],
  },
  {
    id: 'esp32',
    title: 'ESP32 DevKitC-V4',
    sub: 'BLE 5 · 240 MHz',
    note: 'Target MCU for the wearable. Dual-core Xtensa, on-chip BLE stack via NimBLE, 3.3 V rail. Chosen for BLE maturity + dev ecosystem.',
    tag: 'MCU · BLE',
    svg: <EspSvg />,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/ESP32_Espressif_ESP-WROOM-32_Dev_Board.jpg/400px-ESP32_Espressif_ESP-WROOM-32_Dev_Board.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/ESP32',
    sourceLabel: 'ESP32 — Wikipedia',
    longDesc:
      'A dual-core Xtensa LX6 microcontroller with integrated Wi-Fi and Bluetooth 5 LE. The DevKitC-V4 board exposes all GPIO pins, adds USB-UART for programming, and regulates 5 V → 3.3 V on-board. Chosen over the nRF52 for the breadth of its community, the maturity of NimBLE, and my prior experience flashing ESP-IDF.',
    specs: [
      ['CPU',        'Xtensa LX6 dual-core @ 240 MHz'],
      ['RAM',        '520 KB SRAM'],
      ['Flash',      '4 MB (module dependent)'],
      ['Wireless',   'Wi-Fi 802.11 b/g/n, BT 4.2 BR/EDR + BLE 5'],
      ['BLE PHY',    '1 M, 2 M, Coded'],
      ['ADC',        '12-bit, 18 ch'],
      ['Current',    '240 mA peak TX · ~30 µA deep sleep'],
    ],
  },
  {
    id: 'mpu6050',
    title: 'MPU-6050 IMU',
    sub: '6-axis · ±2 g · 1 kHz',
    note: 'Researched for motion artifact rejection and movement intensity features. 25 Hz sample rate in the BLE packet budget.',
    tag: 'SENSOR · MOTION',
    svg: <ImuSvg />,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/MPU-6050_module.jpg/400px-MPU-6050_module.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Inertial_measurement_unit',
    sourceLabel: 'Inertial measurement unit — Wikipedia',
    longDesc:
      'A 6-axis inertial measurement unit with a 3-axis accelerometer + 3-axis gyroscope on one die. Reads over I²C. Used for motion-artifact rejection (cancelling PPG corruption during wrist motion) and as a direct feature — low motion during a work block is one input to the drift score.',
    specs: [
      ['Accel range',  '±2 / ±4 / ±8 / ±16 g (prog.)'],
      ['Gyro range',   '±250 / 500 / 1000 / 2000 °/s'],
      ['ADC',          '16-bit each axis'],
      ['Output rate',  'up to 1 kHz'],
      ['Interface',    'I²C, up to 400 kHz'],
      ['Package',      '4 × 4 × 0.9 mm QFN'],
      ['Power',        '3.9 mA normal · 8 µA standby'],
    ],
  },
  {
    id: 'lipo',
    title: 'Li-Po battery + TP4056',
    sub: '300 mAh · 3.7 V',
    note: 'Planned power subsystem. Charger IC + protection board. Estimated 18–24 hr life at 50 Hz PPG + BLE notify.',
    tag: 'POWER',
    svg: <BatterySvg />,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Lithium_polymer_battery.jpg/400px-Lithium_polymer_battery.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Lithium_polymer_battery',
    sourceLabel: 'Lithium polymer battery — Wikipedia',
    longDesc:
      'A lithium polymer cell at 3.7 V nominal, paired with a TP4056 charger IC and a protection board (over-voltage / over-current / short-circuit). The 300 mAh pack was sized against a measured ~15 mA average load: PPG sampling (0.7 mA) + BLE notify (5–10 mA avg with connection events) + MCU (5 mA active). Estimated life: 300 / 15 = 20 h per charge.',
    specs: [
      ['Capacity',     '300 mAh'],
      ['Nominal V',    '3.7 V'],
      ['Charge V',     '4.2 V max'],
      ['Charge IC',    'TP4056 · 1 A max · CC-CV'],
      ['Protection',   'DW01A + 8205A MOSFET'],
      ['Connector',    'JST-PH 2.0 mm'],
      ['Size',         '~30 × 20 × 6 mm'],
    ],
  },
  {
    id: 'enclosure',
    title: 'Wearable enclosure concept',
    sub: '38 mm watch-form · PLA',
    note: 'Target form factor sketch — watch-style wrist strap, 36–40 mm case, window over the PPG LED cluster.',
    tag: 'MECHANICAL',
    svg: <EnclosureSvg />,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Watch_S5_Edelstahl_Milanaise.jpg/400px-Apple_Watch_S5_Edelstahl_Milanaise.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Smartwatch',
    sourceLabel: 'Smartwatch — Wikipedia',
    longDesc:
      'The target form factor was a wrist-worn enclosure: 36–40 mm case, 22 mm lug width for a standard strap, and an optical window over the PPG LED cluster making skin contact. I planned to 3D-print the shell in PLA for the prototype (ABS for a second rev) and source the strap off-the-shelf. The reference image shows what a commercial smartwatch looks like — the mechanical target I was benchmarking against.',
    specs: [
      ['Case diameter', '36 – 40 mm'],
      ['Material',      'PLA (proto) / ABS (v2)'],
      ['Strap',         'Standard 22 mm silicone'],
      ['Skin window',   'Optical PMMA over PPG LED'],
      ['Fastening',     'Magnetic / standard pin buckle'],
      ['Weight target', '< 40 g'],
    ],
  },
  {
    id: 'ppg',
    title: 'PPG waveform study',
    sub: 'synthetic · 72 BPM',
    note: 'Reference waveform I generated while writing the peak detector. Annotates the systolic peak and dicrotic notch used by adaptive-threshold algorithms.',
    tag: 'SIGNAL',
    svg: <PpgWaveSvg />,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Photoplethysmogram.svg/600px-Photoplethysmogram.svg.png',
    sourceUrl: 'https://en.wikipedia.org/wiki/Photoplethysmogram',
    sourceLabel: 'Photoplethysmogram — Wikipedia',
    longDesc:
      'A photoplethysmogram (PPG) captures the pulsatile change in blood volume under the skin. Each beat shows a sharp systolic peak, a smaller dicrotic notch (aortic valve closure), and a diastolic decline. Heart rate estimation relies on finding systolic peaks reliably despite noise, baseline wander, and motion artifacts — which is exactly what the adaptive-threshold peak detector in the Signal Lab does.',
    specs: [
      ['Typical fundamental', '0.8 – 3.0 Hz (50–180 BPM)'],
      ['Baseline wander',     '~0.1 Hz respiration'],
      ['Motion artifact',     '2–10 Hz depending on activity'],
      ['Features used',       'HR, HRV RMSSD, dicrotic ratio'],
      ['Sample rate',         '25–250 Hz typical for wearables'],
    ],
  },
  {
    id: 'breadboard',
    title: 'Breadboard bring-up plan',
    sub: 'ESP32 + MAX30101 + MPU',
    note: 'Wiring sketch I drafted for the planned bench bring-up. I²C bus shared, EDA electrodes broken out through MCP3421 ADC.',
    tag: 'WIRING',
    svg: <BreadboardSvg />,
    realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/400_points_breadboard.jpg/400px-400_points_breadboard.jpg',
    sourceUrl: 'https://en.wikipedia.org/wiki/Breadboard',
    sourceLabel: 'Breadboard — Wikipedia',
    longDesc:
      'For bench bring-up I planned a solderless breadboard layout: the ESP32 straddling the center gap, the MAX30101 and MPU-6050 sharing the I²C bus (SDA → GPIO21, SCL → GPIO22, distinct 7-bit addresses 0x57 and 0x68), an MCP3421 external ADC bridging the EDA front-end to I²C, and a JST-PH header to the Li-Po pack through the TP4056 board. Decoupling caps (100 nF) on each chip rail.',
    specs: [
      ['Topology',   'ESP32 straddles center gap'],
      ['I²C bus',    'SDA → GPIO21 · SCL → GPIO22'],
      ['Addresses',  'MAX30101: 0x57 · MPU-6050: 0x68'],
      ['EDA ADC',    'MCP3421 · 18-bit · 0x68'],
      ['Power',      'Li-Po → TP4056 → 3V3 LDO'],
      ['Decoupling', '100 nF + 10 µF per rail'],
    ],
  },
];

export default function PhotosRefs() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = REFS.find((r) => r.id === activeId) ?? null;

  // Close on ESC
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [active]);

  return (
    <div>
      <div className="dd-panel">
        <div className="dd-panel-head">
          <div>
            <span className="dd-panel-title-code">07 · PHOTOS &amp; REFS</span>
            <span className="dd-panel-title">Research references &amp; concept sketches</span>
          </div>
          <div className="dd-chip">CLICK A CARD</div>
        </div>

        <div className="dd-body" style={{ marginBottom: '1rem' }}>
          These are the components and form-factors I researched during the pitch
          phase. Each card shows my concept sketch — <strong>not a photo of hardware
          I built or wore.</strong> Click any card to open a modal with a real
          product photo from the internet, full specs, and a link to the
          authoritative reference page.
        </div>

        <div className="dd-refs-grid">
          {REFS.map((r) => (
            <button
              key={r.id}
              className="dd-ref-card dd-ref-card-btn"
              onClick={() => setActiveId(r.id)}
              aria-label={`Open details for ${r.title}`}
            >
              <div className="dd-ref-visual">{r.svg}</div>
              <div className="dd-ref-caption">
                <div className="dd-ref-title">{r.title}</div>
                <div className="dd-ref-sub">{r.sub}</div>
                <div className="dd-ref-note">{r.note}</div>
                <span className="dd-ref-tag">{r.tag}</span>
                <span className="dd-ref-open">▸ VIEW PHOTO &amp; SPECS</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && <Modal ref_={active} onClose={() => setActiveId(null)} />}
    </div>
  );
}

/* ===================================================================
   MODAL
   =================================================================== */

function Modal({ ref_, onClose }: { ref_: Ref; onClose: () => void }) {
  const [imageBroken, setImageBroken] = useState(false);

  return (
    <div className="dd-modal-backdrop" onClick={onClose}>
      <div className="dd-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="dd-modal-close" onClick={onClose} aria-label="Close">×</button>

        <div className="dd-modal-head">
          <div>
            <div className="dd-modal-tag">{ref_.tag}</div>
            <h2 className="dd-modal-title">{ref_.title}</h2>
            <div className="dd-modal-sub">{ref_.sub}</div>
          </div>
        </div>

        <div className="dd-modal-body">
          {/* LEFT — real photo + sketch */}
          <div className="dd-modal-visuals">
            <div className="dd-modal-photo">
              <div className="dd-modal-photo-label">● REAL PHOTO · FROM THE INTERNET</div>
              {!imageBroken ? (
                <img
                  src={ref_.realImageUrl}
                  alt={ref_.title}
                  className="dd-modal-img"
                  onError={() => setImageBroken(true)}
                />
              ) : (
                <div className="dd-modal-img-fallback">
                  <div className="dd-modal-img-fallback-glyph">⚠</div>
                  <div>Image failed to load.</div>
                  <a href={ref_.sourceUrl} target="_blank" rel="noopener noreferrer" className="dd-modal-img-fallback-link">
                    View real photos at source →
                  </a>
                </div>
              )}
            </div>

            <div className="dd-modal-sketch">
              <div className="dd-modal-photo-label">◇ CONCEPT SKETCH · MY RESEARCH</div>
              <div className="dd-modal-sketch-inner">{ref_.svg}</div>
            </div>
          </div>

          {/* RIGHT — description + specs + link */}
          <div className="dd-modal-info">
            <div className="dd-modal-section-head">ABOUT</div>
            <p className="dd-modal-text">{ref_.longDesc}</p>

            <div className="dd-modal-section-head" style={{ marginTop: '1.2rem' }}>SPECIFICATIONS</div>
            <table className="dd-modal-spec-table">
              <tbody>
                {ref_.specs.map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <a
              className="dd-modal-source"
              href={ref_.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>→ {ref_.sourceLabel}</span>
              <span style={{ fontFamily: 'var(--dd-mono)', fontSize: '0.68rem', letterSpacing: '0.1em' }}>OPEN ↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   ILLUSTRATIONS — inline SVG, no external images
   (Same as before — these are the cards' concept sketches.)
   =================================================================== */

function PpgSensorSvg() {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <rect x="40" y="40" width="120" height="70" rx="8"
            fill="#1a1a2e" stroke="#5eead4" strokeWidth="1.2" />
      <circle cx="80" cy="75" r="10" fill="#fb7185" opacity="0.9" />
      <circle cx="80" cy="75" r="4" fill="#fca5a5" />
      <circle cx="120" cy="75" r="10" fill="#5eead4" opacity="0.9" />
      <circle cx="120" cy="75" r="4" fill="#a7f3d0" />
      <rect x="55" y="50" width="6" height="6" fill="#f7b955" />
      <rect x="139" y="50" width="6" height="6" fill="#f7b955" />
      <text x="100" y="130" fill="#94a3b8" fontSize="9" fontFamily="monospace"
            textAnchor="middle" letterSpacing="1">MAX30101</text>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={60 + i * 22} y={110} width="3" height="8" fill="#94a3b8" />
      ))}
    </svg>
  );
}

function EdaSensorSvg() {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <circle cx="70" cy="75" r="22" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx="70" cy="75" r="14" fill="#1a1a2e" stroke="#5eead4" strokeWidth="1" />
      <circle cx="130" cy="75" r="22" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx="130" cy="75" r="14" fill="#1a1a2e" stroke="#5eead4" strokeWidth="1" />
      <line x1="92" y1="75" x2="108" y2="75"
            stroke="#f7b955" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="100" y="60" fill="#f7b955" fontSize="10"
            fontFamily="monospace" textAnchor="middle">ΔV → ADC</text>
      <text x="100" y="125" fill="#94a3b8" fontSize="9"
            fontFamily="monospace" textAnchor="middle" letterSpacing="1">GSR ELECTRODES</text>
    </svg>
  );
}

function EspSvg() {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <rect x="30" y="30" width="140" height="90" rx="4"
            fill="#0f1320" stroke="#a78bfa" strokeWidth="1.2" />
      <rect x="60" y="45" width="80" height="30" fill="#141a2b" stroke="#5eead4" strokeWidth="1" />
      <text x="100" y="64" fill="#5eead4" fontSize="9"
            fontFamily="monospace" textAnchor="middle">ESP32-WROOM</text>
      <path d="M 40 35 Q 50 20 60 35" fill="none" stroke="#f7b955" strokeWidth="1.2" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <g key={i}>
          <rect x={35 + i * 14} y="122" width="3" height="8" fill="#94a3b8" />
        </g>
      ))}
      <text x="100" y="105" fill="#94a3b8" fontSize="8"
            fontFamily="monospace" textAnchor="middle">BLE 5 · 240 MHz · 3V3</text>
    </svg>
  );
}

function ImuSvg() {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <rect x="60" y="50" width="80" height="50" rx="4"
            fill="#1a1a2e" stroke="#5eead4" strokeWidth="1.2" />
      <text x="100" y="78" fill="#5eead4" fontSize="10"
            fontFamily="monospace" textAnchor="middle">MPU-6050</text>
      <line x1="100" y1="75" x2="100" y2="30" stroke="#fb7185" strokeWidth="1.2" />
      <line x1="100" y1="75" x2="145" y2="75" stroke="#5eead4" strokeWidth="1.2" />
      <line x1="100" y1="75" x2="130" y2="105" stroke="#f7b955" strokeWidth="1.2" />
      <text x="100" y="25" fill="#fb7185" fontSize="9" textAnchor="middle" fontFamily="monospace">Z</text>
      <text x="150" y="78" fill="#5eead4" fontSize="9" fontFamily="monospace">X</text>
      <text x="134" y="115" fill="#f7b955" fontSize="9" fontFamily="monospace">Y</text>
      <text x="100" y="130" fill="#94a3b8" fontSize="8"
            fontFamily="monospace" textAnchor="middle">6-AXIS IMU</text>
    </svg>
  );
}

function BatterySvg() {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <rect x="40" y="50" width="110" height="55" rx="4"
            fill="#141a2b" stroke="#f7b955" strokeWidth="1.2" />
      <rect x="150" y="65" width="8" height="25" rx="2" fill="#f7b955" />
      <rect x="48" y="58" width="40" height="39" rx="2" fill="#5eead4" opacity="0.4" />
      <rect x="92" y="58" width="20" height="39" rx="2" fill="#5eead4" opacity="0.15" />
      <text x="100" y="85" fill="#5eead4" fontSize="10"
            fontFamily="monospace" textAnchor="middle" fontWeight="600">300 mAh</text>
      <text x="100" y="125" fill="#94a3b8" fontSize="8"
            fontFamily="monospace" textAnchor="middle" letterSpacing="1">Li-Po · 3.7 V</text>
    </svg>
  );
}

function EnclosureSvg() {
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <rect x="85" y="15" width="30" height="22" fill="#141a2b" />
      <rect x="85" y="113" width="30" height="22" fill="#141a2b" />
      <rect x="60" y="37" width="80" height="76" rx="14"
            fill="#0f1320" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="72" y="49" width="56" height="52" rx="4"
            fill="#05060c" stroke="#5eead4" strokeWidth="0.8" />
      <circle cx="100" cy="75" r="5" fill="#fb7185" opacity="0.7" />
      <rect x="141" y="68" width="6" height="14" rx="1" fill="#94a3b8" />
    </svg>
  );
}

function PpgWaveSvg() {
  const points: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    const hz = 1.2;
    const y = 50 +
      -30 * Math.sin(2 * Math.PI * hz * t * 2.4) -
      10 * Math.sin(2 * Math.PI * hz * t * 4.8 + 0.7);
    points.push(`${i * (200 / 60)},${y}`);
  }
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <line x1="0" y1="50" x2="200" y2="50"
            stroke="rgba(148,163,184,0.15)" strokeDasharray="2 3" />
      <polyline points={points.join(' ')}
                fill="none" stroke="#5eead4" strokeWidth="1.6" />
      <circle cx="58" cy="22" r="3" fill="#f7b955" />
      <circle cx="137" cy="22" r="3" fill="#f7b955" />
      <text x="58" y="16" fontSize="7" fill="#f7b955"
            fontFamily="monospace" textAnchor="middle">peak</text>
      <text x="137" y="16" fontSize="7" fill="#f7b955"
            fontFamily="monospace" textAnchor="middle">peak</text>
      <text x="100" y="140" fontSize="8" fill="#94a3b8"
            fontFamily="monospace" textAnchor="middle">PPG · 72 BPM · 50 Hz</text>
    </svg>
  );
}

function BreadboardSvg() {
  const holes = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 14; c++) {
      holes.push(
        <circle key={`${r}-${c}`} cx={25 + c * 12} cy={45 + r * 11} r="1.3"
                fill="#94a3b8" opacity="0.4" />
      );
    }
  }
  return (
    <svg viewBox="0 0 200 150" width="100%" height="100%">
      <rect x="15" y="35" width="175" height="80" rx="3"
            fill="#1a1a2e" stroke="rgba(148,163,184,0.3)" />
      {holes}
      <line x1="15" y1="75" x2="190" y2="75"
            stroke="rgba(251,113,133,0.3)" strokeWidth="0.8" />
      <line x1="15" y1="86" x2="190" y2="86"
            stroke="rgba(94,234,212,0.3)" strokeWidth="0.8" />
      <path d="M 60 56 Q 80 100 110 67" stroke="#f7b955"
            strokeWidth="1.4" fill="none" />
      <path d="M 90 45 Q 130 28 160 56" stroke="#5eead4"
            strokeWidth="1.4" fill="none" />
      <text x="100" y="130" fontSize="8" fill="#94a3b8"
            fontFamily="monospace" textAnchor="middle" letterSpacing="1">BRING-UP SKETCH</text>
    </svg>
  );
}
