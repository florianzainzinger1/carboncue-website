import { Card, Heading, Prose } from "@/components/ui";
import type { MessageDictionary } from "@/content/messages";

/**
 * The duality band between the scroll story and the calculator: one card per
 * direction of the position. Deficit carries the risk accent, surplus the
 * asset accent — as a thin leading rule and kicker only, so the cards stay
 * within the monochrome enterprise look. Copy is founder-approved
 * ("dokumentieren", deliberately not "bilanzieren"; no sale recommendation).
 */

type DualityMessages = MessageDictionary["home"]["duality"];

const cards = [
  {
    key: "deficit",
    ruleClass: "border-l-accent-risk",
    kickerClass: "text-accent-ink",
  },
  {
    key: "surplus",
    ruleClass: "border-l-asset",
    kickerClass: "text-asset-ink",
  },
] as const;

export function PositionDuality({ messages }: { messages: DualityMessages }) {
  return (
    <section
      className="px-page border-border/80 bg-surface border-t py-14 md:py-16"
      aria-labelledby="position-duality-title"
    >
      <div className="max-w-site mx-auto">
        <p
          id="position-duality-title"
          className="text-muted font-mono text-xs tracking-wider uppercase"
        >
          {messages.eyebrow}
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {cards.map(({ key, ruleClass, kickerClass }) => {
            const card = messages[key];
            return (
              <Card
                key={key}
                className={`border-l-4 ${ruleClass}`}
                aria-label={card.title}
              >
                <p
                  className={`font-mono text-xs font-medium tracking-[0.12em] uppercase ${kickerClass}`}
                >
                  {card.kicker}
                </p>
                <Heading as="h3" size="subsection" className="mt-3">
                  {card.title}
                </Heading>
                <Prose className="mt-3" tone="muted">
                  {card.body}
                </Prose>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
