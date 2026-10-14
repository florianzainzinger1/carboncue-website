"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { DemoBadge } from "@/components/ui";

import {
  ComplianceYearGraph,
  type ComplianceYearGraphLabels,
} from "./compliance-year-graph";

/**
 * The "compliance year" scroll story, ported from the earlier CarbonCue
 * prototype.
 *
 * A sticky panel holds one evolving figure; the steps scroll past it. An
 * IntersectionObserver picks the active step for the discrete states, and a
 * scroll listener scrubs the curve → bar morph (steps 3→4) and the surplus
 * scene (steps 5→6) continuously, so those transitions progress with the
 * reader's scrolling in both directions. No animation dependency is added
 * (docs/engineering/stack.md keeps the dependency budget deliberately small,
 * and the site currently scores 100 on Lighthouse performance).
 *
 * The sticky panel centres itself in the viewport through its sticky offset
 * (`top: max(4rem, 50vh - half the panel height)`) rather than through a
 * full-height flex wrapper. The difference matters at the edges: a flex
 * wrapper physically pushes the figure down inside its column, which opened a
 * dead gap between the section intro and the figure. With the offset
 * approach the figure sits at the grid top on entry - level with the
 * top-aligned first step - then rides the vertical middle while stuck, and
 * the last row is roughly panel-height and top-aligned, so the final step
 * comes to rest level with the panel's top edge just as it unsticks. Steps
 * that have scrolled past the active one fade out upwards (large screens, no
 * reduced motion).
 *
 * Progressive enhancement: the server renders every step at full contrast and
 * the figure in its first state. Without JavaScript the whole story is still
 * readable top to bottom - only the sticky/advancing behaviour is lost.
 * `prefers-reduced-motion` is honoured twice over: the global CSS rule
 * collapses the remaining transitions, and the scrub listener never attaches —
 * `morph`/`surplus` snap to 0 or 1 per active step instead.
 */

export type ComplianceYearStep = Readonly<{
  kicker: string;
  title: string;
  text: string;
}>;

export type ComplianceYearStoryLabels = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  panelTitle: string;
  demoBadgeLabel: string;
  demoBadgeAssistiveLabel: string;
  steps: readonly ComplianceYearStep[];
  graph: ComplianceYearGraphLabels;
}>;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void): () => void {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function ComplianceYearStory({
  labels,
}: {
  labels: ComplianceYearStoryLabels;
}) {
  const [active, setActive] = useState(0);
  const [scrub, setScrub] = useState({ morph: 0, surplus: 0 });
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLOListElement>(null);

  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  /* The curve → bar morph and the surplus scene are scrubbed by scroll:
     their progress is the position of the viewport midline between the
     centres of steps 3→4 and 5→6. Under reduced motion no listener attaches
     and the figure snaps per step instead. */
  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const center = (index: number) => {
        const node = stepRefs.current[index];
        if (!node) return null;
        const box = node.getBoundingClientRect();
        return box.top + box.height / 2;
      };
      const c3 = center(2);
      const c4 = center(3);
      const c5 = center(4);
      const c6 = center(5);
      if (c3 === null || c4 === null || c5 === null || c6 === null) return;

      const mid = window.innerHeight / 2;
      const progress = (from: number, to: number) =>
        to === from ? 0 : Math.min(1, Math.max(0, (mid - from) / (to - from)));
      const morph = progress(c3, c4);
      const surplus = progress(c5, c6);

      // Bail out to the previous object when nothing changed, so idle scroll
      // frames elsewhere on the page do not re-render the story.
      setScrub((previous) =>
        previous.morph === morph && previous.surplus === surplus
          ? previous
          : { morph, surplus },
      );

      // The IntersectionObserver only updates the active step while a row
      // intersects its midline band. After an instant jump (End/Home, a hash
      // link, restored scroll position) no row may intersect it, which would
      // leave the discrete flags contradicting the scrubbed morph — e.g. the
      // step-5 closing check floating over the step-1 curve. Correcting the
      // active step from the same measurement keeps both in sync on the
      // first scroll frame — but ONLY for jumps of two or more steps.
      // Adjacent transitions stay with the observer's band, which has
      // natural hysteresis; a per-frame nearest-step override would flap at
      // row boundaries and restart the timed accents (the red gap wipe
      // visibly flickered between steps 2 and 3).
      let nearest = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;
      stepRefs.current.forEach((node, index) => {
        if (!node) return;
        const box = node.getBoundingClientRect();
        const distance = Math.abs(box.top + box.height / 2 - mid);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });
      setActive((previous) =>
        Math.abs(nearest - previous) >= 2 ? nearest : previous,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const morph = reducedMotion ? (active >= 3 ? 1 : 0) : scrub.morph;
  const surplus = reducedMotion ? (active >= 5 ? 1 : 0) : scrub.surplus;

  useEffect(() => {
    // Flag enhancement on the DOM rather than through state: setting state
    // synchronously inside an effect triggers a cascading render.
    listRef.current?.setAttribute("data-enhanced", "true");

    const nodes = stepRefs.current.filter(
      (node): node is HTMLLIElement => node !== null,
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the vertical middle of the viewport, so the
        // figure tracks the step the reader is actually looking at.
        let best: { index: number; distance: number } | null = null;
        const middle = window.innerHeight / 2;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = nodes.indexOf(entry.target as HTMLLIElement);
          if (index === -1) continue;
          const box = entry.boundingClientRect;
          const distance = Math.abs(box.top + box.height / 2 - middle);
          if (best === null || distance < best.distance) {
            best = { index, distance };
          }
        }

        if (best !== null) setActive(best.index);
      },
      {
        // A band across the middle of the viewport decides the active step.
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="compliance-year-title"
      className="px-page border-border/80 bg-surface border-t pt-16 pb-10 md:pt-24 md:pb-12"
    >
      <div className="max-w-site mx-auto">
        <div className="max-w-3xl">
          <p className="text-muted font-mono text-xs tracking-wider uppercase">
            {labels.eyebrow}
          </p>
          <h2
            id="compliance-year-title"
            className="text-ink text-section mt-3 font-semibold text-balance"
          >
            {labels.title}
          </h2>
          <p className="max-w-reading text-muted mt-4 text-base leading-7 md:text-lg md:leading-8">
            {labels.summary}
          </p>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Centred while stuck via the sticky offset (15rem is half the
              measured panel height), but naturally at the grid top on entry,
              so no dead gap opens after the section intro. The max() keeps
              the panel below the 4rem header on short viewports. */}
          <div className="lg:sticky lg:top-[max(4rem,calc(50vh_-_14.6rem))] lg:self-start">
            <figure className="rounded-card border-border bg-surface w-full border">
              <figcaption className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5">
                <span className="text-ink text-sm font-semibold">
                  {labels.panelTitle}
                </span>
                <div className="flex items-center gap-3">
                  <DemoBadge
                    label={labels.demoBadgeLabel}
                    assistiveLabel={labels.demoBadgeAssistiveLabel}
                  />
                  <span
                    className="flex items-center gap-1.5"
                    aria-hidden="true"
                  >
                    {labels.steps.map((step, index) => (
                      <span
                        key={step.title}
                        className={
                          index === active
                            ? "bg-ink h-1.5 w-5 rounded-full transition-all"
                            : index < active
                              ? "h-1.5 w-1.5 rounded-full bg-zinc-400 transition-all"
                              : "bg-border h-1.5 w-1.5 rounded-full transition-all"
                        }
                      />
                    ))}
                  </span>
                </div>
              </figcaption>
              <div className="px-4 py-4">
                <ComplianceYearGraph
                  active={active}
                  morph={morph}
                  surplus={surplus}
                  labels={labels.graph}
                />
              </div>
            </figure>
          </div>

          <ol ref={listRef} className="grid gap-10 lg:gap-0">
            {labels.steps.map((step, index) => (
              <li
                key={step.title}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                aria-current={active === index ? "step" : undefined}
                className={
                  // First and last rows are top-aligned so both edge steps
                  // start level with the panel's top edge; the last row is
                  // roughly panel-height so the alignment holds exactly when
                  // the panel stops sticking, and its top margin restores
                  // the same step-to-step rhythm the centred middle rows
                  // have. Middle rows centre on the centred panel.
                  index === 0
                    ? "lg:flex lg:min-h-[45vh] lg:flex-col lg:justify-start"
                    : index === labels.steps.length - 1
                      ? "lg:mt-[20vh] lg:flex lg:min-h-[min(29.2rem,calc(36.5vw_+_0.33rem))] lg:flex-col lg:justify-start"
                      : "lg:flex lg:min-h-[60vh] lg:flex-col lg:justify-center"
                }
              >
                <div
                  className="story-step"
                  data-active={active === index ? "true" : undefined}
                  data-passed={index < active ? "true" : undefined}
                >
                  <p className="text-muted font-mono text-xs tracking-wider uppercase">
                    {index + 1} · {step.kicker}
                  </p>
                  <h3 className="text-ink mt-3 text-xl font-semibold text-balance md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="max-w-reading text-muted mt-3 text-base leading-7">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
