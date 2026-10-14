"use client";

import { useCallback, useId, useState } from "react";

import { DemoBadge, Heading } from "@/components/ui";
import type { MessageDictionary } from "@/content/messages";
import type { Locale } from "@/i18n/config";

const LOCALE_TAGS = {
  de: "de-DE",
  en: "en-GB",
} as const satisfies Record<Locale, string>;

/*
 * The volume range and default describe mid-sized industrial installations
 * rather than a round number that looks impressive. The price is an input the
 * reader sets, never a forecast.
 */
const MIN_UNCOVERED = 1_000;
const MAX_UNCOVERED = 50_000;
const UNCOVERED_STEP = 500;
const DEFAULT_UNCOVERED = 5_000;

const MIN_PRICE = 50;
const MAX_PRICE = 150;
const PRICE_STEP = 1;
const DEFAULT_PRICE = 85;

const PENALTY_PER_TONNE = 100;

/** Sector-typical magnitudes in the same order as `messages.presets`. In both
    calculator modes they serve only as order-of-magnitude starting points,
    never as claims about a sector. */
const PRESET_VALUES = [2_000, 5_000, 9_000, 30_000] as const;

function formatCurrency(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    maximumFractionDigits: 0,
  }).format(value);
}

type EuaRiskCalculatorProps = Readonly<{
  locale: Locale;
  messages: MessageDictionary["home"]["calculator"];
}>;

type CalculatorMode = "deficit" | "surplus";

export function EuaRiskCalculator({
  locale,
  messages,
}: EuaRiskCalculatorProps) {
  const [mode, setMode] = useState<CalculatorMode>("deficit");
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [uncovered, setUncovered] = useState(DEFAULT_UNCOVERED);

  const priceId = useId();
  const uncoveredId = useId();
  const presetGroupId = useId();
  const modeRadioName = useId();

  const handlePriceChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPrice(Number(event.target.value));
    },
    [],
  );

  const handleUncoveredChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setUncovered(Number(event.target.value));
    },
    [],
  );

  const isDeficit = mode === "deficit";
  const volumeLabel = isDeficit
    ? messages.uncoveredLabel
    : messages.surplusVolumeLabel;
  const volumeHint = isDeficit
    ? messages.uncoveredHint
    : messages.surplusVolumeHint;

  /* Same arithmetic, two readings: in deficit mode the volume prices out as
     the procurement need plus the conditional penalty; in surplus mode the
     identical t × price product is the calculated equivalent value of the
     holdings at the reader's own assumption. */
  const budget = price * uncovered;
  const penalty = PENALTY_PER_TONNE * uncovered;
  const totalRisk = budget + penalty;
  const assetValue = price * uncovered;

  return (
    <div className="rounded-card border-border bg-surface shadow-panel border">
      <div className="border-border flex flex-wrap items-start justify-between gap-4 border-b px-6 py-6 sm:px-8">
        <div>
          <p className="text-muted font-mono text-xs tracking-wider uppercase">
            {messages.eyebrow}
          </p>
          <Heading
            id="eua-calculator-title"
            as="h2"
            size="section"
            className="mt-3 font-semibold text-balance"
          >
            {isDeficit ? messages.title : messages.surplusTitle}
          </Heading>
        </div>
        <DemoBadge
          label={messages.demoLabel}
          assistiveLabel={messages.demoAssistiveLabel}
        />
      </div>

      <div className="grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* ─── Inputs ─── */}
        <div className="grid content-start gap-8">
          {/* Mode switch: native radios styled as a segmented control, so
              arrow keys and screen readers work without extra wiring. */}
          <fieldset className="border-0 p-0">
            <legend className="text-ink text-sm font-medium">
              {messages.modeLabel}
            </legend>
            <div className="border-border bg-surface-muted rounded-control mt-3 inline-flex gap-1 border p-1">
              {(["deficit", "surplus"] as const).map((option) => {
                const selected = mode === option;
                return (
                  <label
                    key={option}
                    /* The selected state carries a real border as well as the
                       dark fill: forced-colors mode strips author backgrounds
                       but keeps borders, so the active segment stays
                       distinguishable there. */
                    className={`rounded-control ease-calm cursor-pointer border px-3.5 py-1.5 text-sm font-medium transition-colors duration-[var(--motion-duration-fast)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-focus)] ${
                      selected
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "text-ink-soft hover:text-ink border-transparent"
                    }`}
                  >
                    <input
                      type="radio"
                      name={modeRadioName}
                      value={option}
                      checked={selected}
                      onChange={() => setMode(option)}
                      className="sr-only"
                    />
                    {option === "deficit"
                      ? messages.modeDeficit
                      : messages.modeSurplus}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="border-0 p-0">
            <legend id={presetGroupId} className="text-ink text-sm font-medium">
              {messages.presetLabel}
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESET_VALUES.map((preset, index) => {
                const selected = uncovered === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setUncovered(preset)}
                    className={`rounded-control ease-calm min-h-9 border px-3 py-1.5 text-xs font-medium transition-colors duration-[var(--motion-duration-fast)] ${
                      selected
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-border bg-surface text-ink-soft hover:border-border-strong hover:text-ink"
                    }`}
                  >
                    {messages.presets[index]}
                    {/* An opacity here dropped the tonne count to 3.61:1 on
                        white. Use the muted token instead, which clears AA. */}
                    <span
                      className={`ml-1.5 font-mono ${
                        selected ? "text-zinc-300" : "text-muted"
                      }`}
                    >
                      {formatNumber(preset, locale)} t
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label
                htmlFor={uncoveredId}
                className="text-ink text-sm font-medium"
              >
                {volumeLabel}
              </label>
              <output
                htmlFor={uncoveredId}
                className="text-ink font-mono text-xl font-semibold tracking-tight"
              >
                {formatNumber(uncovered, locale)}{" "}
                <span className="text-muted text-sm font-normal">
                  {messages.uncoveredUnit}
                </span>
              </output>
            </div>
            <p className="text-muted mt-1 text-xs leading-5">{volumeHint}</p>
            <input
              id={uncoveredId}
              type="range"
              min={MIN_UNCOVERED}
              max={MAX_UNCOVERED}
              step={UNCOVERED_STEP}
              value={uncovered}
              onChange={handleUncoveredChange}
              className="mt-4 w-full"
              aria-valuetext={`${formatNumber(uncovered, locale)} ${messages.uncoveredUnit}`}
            />
            <div className="text-muted mt-2 flex justify-between font-mono text-[11px]">
              <span>{formatNumber(MIN_UNCOVERED, locale)} t</span>
              <span>{formatNumber(MAX_UNCOVERED, locale)} t</span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label htmlFor={priceId} className="text-ink text-sm font-medium">
                {messages.priceLabel}
              </label>
              <output
                htmlFor={priceId}
                className="text-ink font-mono text-xl font-semibold tracking-tight"
              >
                {formatNumber(price, locale)}{" "}
                <span className="text-muted text-sm font-normal">
                  {messages.priceUnit}
                </span>
              </output>
            </div>
            <p className="text-muted mt-1 text-xs leading-5">
              {messages.priceHint}
            </p>
            <input
              id={priceId}
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={PRICE_STEP}
              value={price}
              onChange={handlePriceChange}
              className="mt-4 w-full"
              aria-valuetext={`${formatNumber(price, locale)} ${messages.priceUnit}`}
            />
            <div className="text-muted mt-2 flex justify-between font-mono text-[11px]">
              <span>{MIN_PRICE} €</span>
              <span>{MAX_PRICE} €</span>
            </div>
          </div>
        </div>

        {/* ─── Result: risk reading in deficit mode, asset reading in
            surplus mode. Same deterministic t × price arithmetic. ─── */}
        <div className="rounded-card border-border bg-surface-muted grid content-start gap-5 border p-6">
          {isDeficit ? (
            <>
              <div>
                <p className="text-ink text-sm font-medium">
                  {messages.budgetLabel}
                </p>
                <p className="text-ink mt-1 font-mono text-3xl font-semibold tracking-tight">
                  {formatCurrency(budget, locale)}
                </p>
                <p className="text-muted mt-1 font-mono text-xs">
                  {formatNumber(uncovered, locale)} t ×{" "}
                  {formatNumber(price, locale)} €
                </p>
                <p className="text-muted mt-2 text-xs leading-5">
                  {messages.budgetHint}
                </p>
              </div>

              <div className="border-border border-t pt-5">
                <p className="text-accent-ink text-sm font-medium">
                  {messages.penaltyLabel}
                </p>
                <p className="text-accent-ink mt-1 font-mono text-2xl font-semibold tracking-tight">
                  + {formatCurrency(penalty, locale)}
                </p>
                <p className="text-muted mt-1 font-mono text-xs">
                  {formatNumber(uncovered, locale)} t × {PENALTY_PER_TONNE} €
                </p>
                <p className="text-muted mt-2 text-xs leading-5">
                  {messages.penaltyHint}
                </p>
              </div>

              <div className="rounded-control border-border bg-surface border p-4">
                <p className="text-ink text-sm font-medium">
                  {messages.totalRiskLabel}
                </p>
                <p className="text-ink mt-1 font-mono text-3xl font-semibold tracking-tight">
                  {formatCurrency(totalRisk, locale)}
                </p>
                <p className="text-muted mt-2 text-xs leading-5">
                  {messages.totalRiskHint}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-asset-ink text-sm font-medium">
                  {messages.assetValueLabel}
                </p>
                <p className="text-asset-ink mt-1 font-mono text-3xl font-semibold tracking-tight">
                  {formatCurrency(assetValue, locale)}
                </p>
                <p className="text-muted mt-1 font-mono text-xs">
                  {formatNumber(uncovered, locale)} t ×{" "}
                  {formatNumber(price, locale)} €
                </p>
                <p className="text-muted mt-2 text-xs leading-5">
                  {messages.assetValueHint}
                </p>
              </div>

              <div className="rounded-control border-border bg-surface border p-4">
                <p className="text-ink-soft text-sm leading-6">
                  {messages.assetNote}
                </p>
              </div>
            </>
          )}

          <a
            href="mailto:kontakt@carboncue.eu?subject=EUA%20Risikoanalyse%20Erstgespr%C3%A4ch"
            className="rounded-control ease-calm flex min-h-11 w-full items-center justify-center border border-zinc-950 bg-zinc-950 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors duration-[var(--motion-duration-fast)] hover:bg-zinc-800"
          >
            {messages.ctaButton}
          </a>
        </div>
      </div>
    </div>
  );
}
