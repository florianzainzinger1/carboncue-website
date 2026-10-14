import { DemoBadge, Heading, Prose } from "@/components/ui";
import type { MessageDictionary } from "@/content/messages";
import type { Locale } from "@/i18n/config";
import { calculateDemoPosition, type DemoPositionInput } from "@/lib/demo";

/**
 * The worked example on the product page, laid out as an arithmetic statement
 * rather than four equal cards: requirement minus coverage equals gap, and the
 * gap priced out is the one number a controller actually takes away.
 *
 * Provenance used to sit in a grey four-field panel above the figures. It is
 * now a single line, and the model assumptions and disclaimer panels below the
 * figures collapsed into one footnote, so nothing competes with the result.
 * The section still carries a DEMO badge because every figure in it is
 * synthetic.
 */

const EXAMPLE_INPUT = {
  obligationEua: 125_000,
  freeAllocationEua: 50_000,
  heldAllowancesEua: 20_000,
  plannedPurchasesEua: 10_000,
  priceCentsPerEua: 8_750,
} as const satisfies DemoPositionInput;

const LOCALE_TAGS = {
  de: "de-DE",
  en: "en-GB",
} as const satisfies Record<Locale, string>;

function formatQuantity(value: number, unit: string, locale: Locale): string {
  return `${new Intl.NumberFormat(LOCALE_TAGS[locale], {
    maximumFractionDigits: 0,
  }).format(value)} ${unit}`;
}

function formatEuroCents(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

function formatExampleDate(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

type TermProps = Readonly<{
  stage: string;
  dataKey: string;
  title: string;
  rawValue: number;
  value: string;
}>;

function Term({ stage, dataKey, title, rawValue, value }: TermProps) {
  return (
    <li
      data-demo-stage={stage}
      className="rounded-card border-border bg-surface border p-5"
    >
      <Heading as="h3" size="subsection">
        {title}
      </Heading>
      <div
        data-demo-figure
        data-demo-value={dataKey}
        data-raw-value={rawValue}
        className="mt-4"
      >
        <p className="text-ink font-mono text-2xl leading-tight font-semibold tracking-[-0.03em]">
          {value}
        </p>
      </div>
    </li>
  );
}

function Operator({ symbol, label }: { symbol: string; label: string }) {
  return (
    <li
      aria-hidden="true"
      className="text-muted flex items-center justify-center font-mono text-2xl leading-none font-medium"
      data-demo-operator={label}
    >
      {symbol}
    </li>
  );
}

type DemoPositionVisualProps = Readonly<{
  locale: Locale;
  messages: MessageDictionary["demo"];
}>;

export function DemoPositionVisual({
  locale,
  messages,
}: DemoPositionVisualProps) {
  const result = calculateDemoPosition(EXAMPLE_INPUT);
  const formattedPrice = `${formatEuroCents(result.input.priceCentsPerEua, locale)}`;

  return (
    <section
      id="demo-position"
      className="border-border bg-canvas px-page py-section border-t"
      aria-labelledby="demo-position-title"
      data-demo-status={result.status}
    >
      <div className="max-w-site mx-auto">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)] lg:gap-14">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <p className="text-primary font-mono text-xs font-medium tracking-[0.14em] uppercase">
                {messages.eyebrow}
              </p>
              <DemoBadge
                label={messages.badgeLabel}
                assistiveLabel={messages.badgeAssistiveLabel}
              />
            </div>
            <Heading id="demo-position-title" as="h2" size="title">
              {messages.title}
            </Heading>
          </div>
          <Prose size="lead">{messages.summary}</Prose>
        </div>

        <p className="text-muted mt-10 font-mono text-xs tracking-wide">
          {messages.provenanceLabel}: {messages.installationName} (
          {formatExampleDate(result.exampleDate, locale)})
        </p>

        <ol
          className="mt-3 grid list-none gap-3 p-0 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-stretch"
          aria-label={messages.stagesLabel}
        >
          <Term
            stage="obligation"
            dataKey="obligation"
            title={messages.obligationTitle}
            rawValue={result.input.obligationEua}
            value={formatQuantity(
              result.input.obligationEua,
              result.units.obligationEua,
              locale,
            )}
          />
          <Operator symbol="−" label={messages.minusAssistiveLabel} />
          <Term
            stage="coverage"
            dataKey="coverage"
            title={messages.coverageTitle}
            rawValue={result.coverageEua}
            value={formatQuantity(
              result.coverageEua,
              result.units.coverageEua,
              locale,
            )}
          />
          <Operator symbol="=" label={messages.equalsAssistiveLabel} />
          <Term
            stage="gap"
            dataKey="gap"
            title={messages.gapTitle}
            rawValue={result.gapEua}
            value={formatQuantity(result.gapEua, result.units.gapEua, locale)}
          />
        </ol>

        <div
          data-demo-stage="budget"
          className="rounded-card border-border bg-surface shadow-panel mt-4 border p-8 md:p-10"
        >
          <Heading as="h3" size="subsection">
            {messages.budgetTitle}
          </Heading>
          <div
            data-demo-figure
            data-demo-value="budget"
            data-raw-value={result.budgetCents}
            className="mt-4"
          >
            <p className="text-ink text-display font-mono font-semibold tracking-[-0.04em]">
              {formatEuroCents(result.budgetCents, locale)}
            </p>
            <p className="sr-only">{messages.budgetValueLabel}</p>
          </div>
          <p
            className="text-muted mt-4 text-sm leading-6"
            data-demo-figure
            data-demo-value="price"
            data-raw-value={result.input.priceCentsPerEua}
          >
            {messages.budgetPriceNote.replace("{price}", formattedPrice)}
          </p>
        </div>

        <p className="text-muted mt-6 text-xs leading-5">{messages.footnote}</p>
      </div>
    </section>
  );
}
