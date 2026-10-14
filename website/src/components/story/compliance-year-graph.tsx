/**
 * One evolving figure that tells the whole compliance story as the reader
 * scrolls. Two scenes joined by a scroll-scrubbed morph:
 *
 *   scene 1 - the cumulative emission curve (steps 1-3)
 *     0  emissions climb     - the curve is drawn in
 *     1  allowances held     - dashed coverage line appears
 *     2  overshoot           - shortfall wedge wipes in from the crossover
 *
 *   scene 2 - the same year as a single stacked bar of tonnes (steps 4-5)
 *     3  the shortfall costs - driven by `morph` (scroll progress between
 *                              step 3 and step 4): the blocks glide from a
 *                              thin column at the December edge into the bar
 *                              with a bottom-up cascade, the coverage line
 *                              narrows its clip window and shifts green to
 *                              ink, its label travels with it, and two
 *                              compact charge chips appear beside the red
 *                              section. The frame itself never zooms - the
 *                              figure stays at one scale throughout.
 *     4  the gap is closed   - the red blocks sweep green.
 *     5  the other direction - driven by `surplus` (scroll progress between
 *                              step 5 and step 6): the coverage line rises
 *                              above the emissions, the top three blocks
 *                              overlay in the petrol asset colour as surplus
 *                              allowances, an emissions marker separates the
 *                              two zones, and the labels crossfade to
 *                              "surplus = bound capital".
 *
 * The morphing values are computed per frame from scroll progress and applied
 * inline, so the transition tracks the reader's scrolling in both directions
 * instead of firing as a timed animation. Only the discrete accents (gap
 * wipe, colour sweep at step 5, the closing check) remain CSS transitions.
 * Under prefers-reduced-motion the story component snaps `morph`/`release`
 * to 0 or 1 per step, so nothing animates.
 *
 * All figures are illustrative. The surrounding UI carries the DEMO label.
 */

const W = 520;
const H = 380;
const PAD = { l: 18, r: 20, t: 34, b: 44 };
const x0 = PAD.l;
const x1 = W - PAD.r;
const yB = H - PAD.b;
const yT = PAD.t;
const MAXV = 1.08;
/* 0.6 splits the 10-block bar exactly 6/4 at the coverage line. */
const COV = 0.6;

/** Seasonal weighting for a compliance year, turned into cumulative fractions. */
const SEASONAL = [
  0.86, 0.84, 0.95, 1.02, 1.05, 1.07, 1.08, 1.09, 1.05, 1.04, 0.99, 0.96,
];
const SUM = SEASONAL.reduce((sum, value) => sum + value, 0);
const CUM = (() => {
  let running = 0;
  return SEASONAL.map((value) => (running += value / SUM));
})();

const X = (month: number) => x0 + (month / 12) * (x1 - x0);
const Y = (value: number) => yB - (value / MAXV) * (yB - yT);

const EMISSION_POINTS: [number, number][] = [
  [X(0), Y(0)],
  ...CUM.map((value, index) => [X(index + 1), Y(value)] as [number, number]),
];
const Yc = Y(COV);
const yearEndY = Y(1);

/** The point at which cumulative emissions reach the coverage line. */
const CROSS = (() => {
  const values = [0, ...CUM];
  for (let k = 1; k < values.length; k++) {
    if (values[k] >= COV) {
      const t = (COV - values[k - 1]) / (values[k] - values[k - 1]);
      return { x: X(k - 1 + t) };
    }
  }
  return { x: X(12) };
})();

function smooth(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const LINE = smooth(EMISSION_POINTS);
const EMISSION_AREA = `${LINE} L ${X(12)} ${yB} L ${X(0)} ${yB} Z`;
const GAP_AREA = `${LINE} L ${X(12)} ${Yc} L ${X(0)} ${Yc} Z`;

/* ─── The block bar ──────────────────────────────────────────────────────
   10 equal blocks of 2,500 t span exactly the same vertical range as the
   year-end emission level, so the bar is the curve's final value redrawn as
   tonnes. 6 of 10 sit below the coverage line, which is COV = 0.6 by
   construction. Before the morph the blocks wait as a thin column at the
   December edge of the chart; the scrubbed morph glides them left and
   widens them into the bar. */
const BLOCK_COUNT = 10;
const BAR_X = 58;
const BAR_W = 96;
const BAR_GAP = 3;
const COLUMN_W = 14;
const COLUMN_X = x1 - COLUMN_W;
const BAR_TOP = yearEndY;
const BLOCK_H = (yB - BAR_TOP - (BLOCK_COUNT - 1) * BAR_GAP) / BLOCK_COUNT;
const BLOCK_STEP = BLOCK_H + BAR_GAP;
const blockTop = (index: number) => yB - BLOCK_H - index * BLOCK_STEP;
const COVERED_BLOCKS = Array.from({ length: BLOCK_COUNT }, (_, i) => i).filter(
  (i) => blockTop(i) >= Yc,
).length;

const RISK = "#dc2626";
const RISK_TEXT = "#b91c1c";
const COVERED = "#047857";
const ASSET = "#0e7490";
const ASSET_TEXT = "#155e75";
const INK = "#09090b";
const MUTED = "#6b6b73";

/* Surplus scene geometry: the top three blocks of the bar read as surplus
   allowances (7,500 t), the emissions marker sits below them, and the
   coverage line comes to rest just above the bar. */
const SURPLUS_BLOCKS = 3;
const SURPLUS_TOP_Y = blockTop(BLOCK_COUNT - 1) - 7;
const EMISSIONS_MARKER_Y =
  blockTop(BLOCK_COUNT - SURPLUS_BLOCKS - 1) - BAR_GAP / 2;
const SURPLUS_ZONE_MID_Y = (blockTop(BLOCK_COUNT - 1) + EMISSIONS_MARKER_Y) / 2;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Linear interpolation between two #rrggbb colours. */
function lerpColor(from: string, to: string, t: number): string {
  const channel = (hex: string, i: number) =>
    Number.parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16);
  const mix = (i: number) =>
    Math.round(lerp(channel(from, i), channel(to, i), t));
  return `rgb(${mix(0)}, ${mix(1)}, ${mix(2)})`;
}

export type ComplianceYearGraphLabels = Readonly<{
  alt: string;
  emissions: string;
  allowances: string;
  shortfallStarts: string;
  chargesKicker: string;
  coveredLabel: string;
  uncoveredLabel: string;
  penaltyShort: string;
  repurchaseShort: string;
  closedLabel: string;
  surplusLabel: string;
  surplusShort: string;
  months: readonly string[];
}>;

export function ComplianceYearGraph({
  active,
  morph,
  surplus,
  labels,
}: {
  active: number;
  /** Scroll progress of the curve → bar morph (step 3 → step 4), 0..1. */
  morph: number;
  /** Scroll progress of the surplus scene (step 5 → step 6), 0..1. */
  surplus: number;
  labels: ComplianceYearGraphLabels;
}) {
  const showCoverage = active >= 1;
  const showGap = active >= 2;
  const closed = active >= 4;
  const surplusEased = smoothstep(clamp01(surplus));

  /* ── Scrubbed phase values ─────────────────────────────────────────── */
  const curveOpacity = 1 - clamp01(morph / 0.6);
  const blocksOpacity = clamp01((morph - 0.1) / 0.5);
  const lineMorph = smoothstep(clamp01((morph - 0.15) / 0.7));
  const labelMorph = smoothstep(clamp01((morph - 0.2) / 0.6));
  /* The in-block zone labels join the choreography late in the morph, once
     the blocks have mostly finished forming. */
  const zoneLabelsIn = clamp01((morph - 0.55) / 0.3);

  /* The charge chips only exist while the red section does: they appear as
     the morph completes and leave when the gap closes, so they never sit
     over the closed/surplus annotations of the later steps. */
  const calloutOpacity = closed ? 0 : clamp01((morph - 0.8) / 0.2);

  /* In the surplus scene the coverage line rises from the 6/4 split to just
     above the bar: allocation now exceeds emissions. Its travelling label
     would sweep straight through the stationary closed/surplus labels on the
     way up, so it dips out over the collision band and returns at the top. */
  const lineY = lerp(Yc, SURPLUS_TOP_Y, surplusEased);
  const allowancesLabelDip =
    1 -
    smoothstep(clamp01((surplusEased - 0.15) / 0.2)) *
      (1 - smoothstep(clamp01((surplusEased - 0.65) / 0.2)));

  /* The persistent allowances label rides the coverage line: from the left
     edge of the chart in scene 1 to the right of the bar in scene 2. */
  const coverageLineY = lineY;
  const allowancesLabelX = lerp(x0 + 2, BAR_X + BAR_W + 16, labelMorph);

  return (
    <div
      className="relative"
      data-story-scene={
        surplus >= 0.5 ? "surplus" : morph >= 0.5 ? "bar" : "curve"
      }
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={labels.alt}
      >
        <defs>
          <linearGradient id="cyg-emissions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={INK} stopOpacity={0.1} />
            <stop offset="100%" stopColor={INK} stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="cyg-gap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={RISK} stopOpacity={0.32} />
            <stop offset="100%" stopColor={RISK} stopOpacity={0.08} />
          </linearGradient>
          <clipPath id="cyg-gapclip">
            <rect
              className="story-wipe"
              x={CROSS.x}
              y={yT - 6}
              height={yB - yT + 12}
              width={showGap ? x1 - CROSS.x + 4 : 0}
            />
          </clipPath>
          {/* The coverage line persists across both scenes; its clip window
              is scrubbed from the full chart down to the bar's span. */}
          <clipPath id="cyg-covclip">
            <rect
              x={lerp(x0 - 2, BAR_X - 10, lineMorph)}
              y={lineY - 6}
              width={lerp(x1 - x0 + 4, BAR_W + 20, lineMorph)}
              height={12}
            />
          </clipPath>
        </defs>

        {/* ─── Scene 1: the cumulative emission curve (scrubbed out) ─── */}
        <g
          style={{
            opacity: curveOpacity,
            transform: `scale(${1 - 0.04 * clamp01(morph)})`,
            transformBox: "view-box",
            transformOrigin: "center",
          }}
          aria-hidden={curveOpacity === 0 ? "true" : undefined}
        >
          <line
            x1={x0}
            y1={yB}
            x2={x1}
            y2={yB}
            stroke="var(--color-border)"
            strokeWidth={1}
          />
          {[3, 6, 9].map((month) => (
            <line
              key={month}
              x1={X(month)}
              y1={yT}
              x2={X(month)}
              y2={yB}
              stroke="var(--color-border-subtle)"
              strokeWidth={1}
            />
          ))}
          {labels.months.map((month, index) => (
            <text
              key={month}
              x={X([0, 3, 6, 9, 12][index] ?? 0)}
              y={yB + 18}
              textAnchor="middle"
              fontSize={10.5}
              fill={MUTED}
              fontWeight={500}
            >
              {month}
            </text>
          ))}

          <path d={EMISSION_AREA} fill="url(#cyg-emissions)" />
          <path
            d={LINE}
            fill="none"
            stroke={INK}
            strokeWidth={2.6}
            strokeLinecap="round"
          />
          <text
            x={X(12)}
            y={yearEndY - 10}
            textAnchor="end"
            fontSize={11}
            fontWeight={700}
            fill={INK}
          >
            {labels.emissions}
          </text>

          <g clipPath="url(#cyg-gapclip)">
            <path d={GAP_AREA} fill="url(#cyg-gap)" />
          </g>

          <g className="story-fade" style={{ opacity: showGap ? 1 : 0 }}>
            <line
              x1={CROSS.x}
              y1={Yc}
              x2={CROSS.x}
              y2={yB}
              stroke={RISK}
              strokeWidth={1.2}
              strokeDasharray="3 3"
              opacity={0.7}
            />
            <circle
              cx={CROSS.x}
              cy={Yc}
              r={4.5}
              fill="var(--color-surface)"
              stroke={RISK}
              strokeWidth={2}
            />
            <text
              x={CROSS.x}
              y={yB + 18}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              fill={RISK_TEXT}
            >
              {labels.shortfallStarts}
            </text>
          </g>
        </g>

        {/* ─── The scrubbed morph layer: coverage line and tonne blocks.
            The figure keeps one scale throughout - no zoom frame. ─── */}
        <g>
          <g
            style={{ opacity: blocksOpacity }}
            aria-hidden={blocksOpacity === 0 ? "true" : undefined}
          >
            {Array.from({ length: BLOCK_COUNT }, (_, index) => {
              const isCovered = index < COVERED_BLOCKS || closed;
              // Bottom-up cascade: each block runs the same glide slightly
              // after the one below it, all tied to scroll progress.
              const spread = 0.35;
              const base = clamp01((morph - 0.05) / 0.8);
              const glide = smoothstep(
                clamp01(
                  base * (1 + spread) - (index / (BLOCK_COUNT - 1)) * spread,
                ),
              );
              return (
                <rect
                  key={index}
                  className="story-block"
                  x={lerp(COLUMN_X, BAR_X, glide)}
                  y={blockTop(index)}
                  width={lerp(COLUMN_W, BAR_W, glide)}
                  height={BLOCK_H}
                  rx={2}
                  fill={isCovered ? COVERED : RISK}
                  fillOpacity={isCovered ? 0.88 : 0.92}
                  style={{
                    // Top-down stagger for the colour sweep when the gap
                    // closes at step 5.
                    transitionDelay: closed
                      ? `${(BLOCK_COUNT - index) * 30}ms`
                      : "0ms",
                  }}
                />
              );
            })}
          </g>

          {/* ── Surplus scene: petrol overlays on the top blocks, an
              emissions marker below them, all scrubbed by `surplus`. ── */}
          <g
            style={{ opacity: surplusEased }}
            aria-hidden={surplusEased === 0 ? "true" : undefined}
          >
            {Array.from({ length: SURPLUS_BLOCKS }, (_, offset) => {
              const index = BLOCK_COUNT - SURPLUS_BLOCKS + offset;
              return (
                <rect
                  key={index}
                  x={BAR_X}
                  y={blockTop(index) + (1 - surplusEased) * 6}
                  width={BAR_W}
                  height={BLOCK_H}
                  rx={2}
                  fill={ASSET}
                  fillOpacity={0.9}
                />
              );
            })}
            <line
              x1={BAR_X - 10}
              y1={EMISSIONS_MARKER_Y}
              x2={BAR_X + BAR_W + 10}
              y2={EMISSIONS_MARKER_Y}
              stroke={INK}
              strokeWidth={1.4}
              strokeDasharray="3 3"
            />
          </g>

          {/* ── Zone labels sit inside the bar itself: white on the block
              fills, each centred within a SINGLE block - a zone-centre
              baseline would land on the white gap between blocks and stripe
              the glyphs illegible. They live in their own always-on group
              (painted after the petrol overlay, so "Überschuss" sits on the
              asset blocks) and are part of the choreography: both fade in
              late in the morph (step 4), the upper one crossfades
              "Ungedeckt" → "Gedeckt" with the closing sweep (step 5) and
              becomes "Überschuss" when the petrol blocks take over (step
              6). ── */}
          <g aria-hidden={zoneLabelsIn === 0 ? "true" : undefined}>
            <text
              className="story-fade"
              style={{ opacity: zoneLabelsIn * (closed ? 0 : 1) }}
              x={BAR_X + BAR_W / 2}
              y={blockTop(7) + BLOCK_H / 2 + 4}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill="#ffffff"
            >
              {labels.uncoveredLabel}
            </text>
            <text
              className="story-fade"
              style={{
                opacity: closed ? zoneLabelsIn * (1 - surplusEased) : 0,
              }}
              x={BAR_X + BAR_W / 2}
              y={blockTop(7) + BLOCK_H / 2 + 4}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill="#ffffff"
            >
              {labels.coveredLabel}
            </text>
            <text
              style={{ opacity: zoneLabelsIn * surplusEased }}
              x={BAR_X + BAR_W / 2}
              y={blockTop(7) + BLOCK_H / 2 + 4}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill="#ffffff"
            >
              {labels.surplusShort}
            </text>
            <text
              style={{ opacity: zoneLabelsIn }}
              x={BAR_X + BAR_W / 2}
              y={blockTop(3) + BLOCK_H / 2 + 4}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill="#ffffff"
            >
              {labels.coveredLabel}
            </text>
          </g>

          <g clipPath="url(#cyg-covclip)">
            <line
              className="story-fade"
              style={{ opacity: showCoverage ? 1 : 0 }}
              x1={x0}
              y1={lineY}
              x2={x1}
              y2={lineY}
              stroke={lerpColor(COVERED, INK, lineMorph)}
              strokeWidth={2}
              strokeDasharray="6 5"
            />
          </g>
        </g>

        {/* The allowances label follows its line through both scenes,
            morphing position and colour with scroll. */}
        <text
          className="story-fade"
          style={{ opacity: showCoverage ? allowancesLabelDip : 0 }}
          x={allowancesLabelX}
          y={coverageLineY - 8}
          fontSize={11}
          fontWeight={700}
          fill={lerpColor(COVERED, INK, labelMorph)}
        >
          {labels.allowances}
        </text>

        {/* ─── Scene 2 side annotations and the closing check ─── */}
        <g
          style={{ opacity: blocksOpacity }}
          aria-hidden={blocksOpacity < 0.1 ? "true" : undefined}
        >
          <text
            className="story-fade"
            x={BAR_X + BAR_W + 16}
            y={(BAR_TOP + Yc) / 2 + 4}
            fontSize={11}
            fontWeight={700}
            fill={COVERED}
            style={{ opacity: closed ? 1 - surplusEased : 0 }}
          >
            {labels.closedLabel}
          </text>
          {/* Surplus-scene labels: the asset zone and the emissions marker. */}
          <text
            x={BAR_X + BAR_W + 16}
            y={SURPLUS_ZONE_MID_Y + 4}
            fontSize={11}
            fontWeight={700}
            fill={ASSET_TEXT}
            opacity={surplusEased}
          >
            {labels.surplusLabel}
          </text>
          <text
            x={BAR_X + BAR_W + 16}
            y={EMISSIONS_MARKER_Y + 13}
            fontSize={10}
            fontWeight={600}
            fill={MUTED}
            opacity={surplusEased}
          >
            {labels.emissions}
          </text>
        </g>

        <g
          className="story-pop"
          style={{
            // The closing check leaves as the surplus scene takes over.
            opacity: closed && surplusEased < 0.3 ? 1 : 0,
            transform: closed && surplusEased < 0.3 ? "scale(1)" : "scale(0.4)",
          }}
        >
          <circle
            cx={BAR_X + BAR_W / 2}
            cy={BAR_TOP - 18}
            r={13}
            fill={COVERED}
          />
          <path
            d={`M ${BAR_X + BAR_W / 2 - 5.5} ${BAR_TOP - 18} l 3.6 3.8 l 7.4 -8.4`}
            fill="none"
            stroke="#ffffff"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* Two compact charge chips beside the red section - the full
          explanation lives in the step text next to the figure. HTML so both
          locales wrap and inherit the type tokens. */}
      <div
        className="story-fade pointer-events-none absolute top-[24%] right-0 flex w-[44%] flex-col items-start gap-2 pr-2 sm:pr-4"
        style={{ opacity: calloutOpacity }}
        aria-hidden={calloutOpacity < 0.9 ? "true" : undefined}
      >
        <p className="text-muted font-mono text-[0.625rem] tracking-[0.12em] uppercase">
          {labels.chargesKicker}
        </p>
        <p className="rounded-control border-border bg-surface shadow-subtle flex items-center gap-2 border px-2.5 py-1.5 text-xs leading-5 font-medium">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: RISK }}
            aria-hidden="true"
          />
          <span className="text-ink">{labels.penaltyShort}</span>
        </p>
        <p className="rounded-control border-border bg-surface shadow-subtle flex items-center gap-2 border px-2.5 py-1.5 text-xs leading-5 font-medium">
          <span
            className="bg-ink h-1.5 w-1.5 shrink-0 rounded-full"
            aria-hidden="true"
          />
          <span className="text-ink">{labels.repurchaseShort}</span>
        </p>
      </div>
    </div>
  );
}
