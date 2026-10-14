import { sql } from "@vercel/postgres";
import { Resend } from "resend";
import { z } from "zod";

/**
 * Receives contact-form submissions: validates the payload, drops honeypot
 * hits, stores the lead in the `leads` table, and notifies the founders by
 * email.
 *
 * Failure policy: a database failure is a hard 500 (the lead would be lost),
 * while an email failure after a successful insert still returns 200 — the
 * lead is captured and the notification can be recovered from the table.
 *
 * Required environment: `POSTGRES_URL` (provided by the linked Vercel
 * Postgres/Neon database) and `RESEND_API_KEY`. `CONTACT_FROM_EMAIL` may
 * override the sender once a domain is verified in Resend.
 */

const NOTIFICATION_RECIPIENT = "kontakt@carboncue.eu";

/* Resend's shared onboarding sender works without domain verification but
   only delivers to the Resend account owner's address. Configure
   CONTACT_FROM_EMAIL with a verified-domain sender for production. */
const DEFAULT_FROM = "CarbonCue Website <onboarding@resend.dev>";

const leadSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    company: z.string().trim().min(1).max(200),
    email: z.string().trim().max(320).pipe(z.email()),
    message: z
      .string()
      .trim()
      .max(5000)
      .optional()
      .nullable()
      .transform((value) => (value ? value : null)),
    // Honeypot. Never filled by humans; bots that fill it are acknowledged
    // without processing.
    website_url: z
      .string()
      .max(1000)
      .optional()
      .nullable()
      .transform((value) => value ?? ""),
  })
  .strict();

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);

  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 },
    );
  }

  const lead = parsed.data;

  if (lead.website_url !== "") {
    // Honeypot hit: pretend success so the bot learns nothing, store nothing.
    return Response.json({ ok: true });
  }

  try {
    await sql`
      INSERT INTO leads (name, company, email, message)
      VALUES (${lead.name}, ${lead.company}, ${lead.email}, ${lead.message})
    `;
  } catch (error) {
    console.error("[contact] lead insert failed:", error);
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: NOTIFICATION_RECIPIENT,
      replyTo: lead.email,
      subject: `🚨 Neuer CarbonCue Lead: ${lead.company}`,
      text: [
        "Neue Anfrage über das Kontaktformular:",
        "",
        `Name: ${lead.name}`,
        `Unternehmen: ${lead.company}`,
        `E-Mail: ${lead.email}`,
        "",
        "Nachricht:",
        lead.message ?? "(keine Nachricht hinterlassen)",
      ].join("\n"),
    });

    if (error) {
      console.error("[contact] notification email failed:", error);
    }
  } catch (error) {
    // The lead is stored; a lost notification must not fail the submission.
    console.error("[contact] notification email failed:", error);
  }

  return Response.json({ ok: true });
}
