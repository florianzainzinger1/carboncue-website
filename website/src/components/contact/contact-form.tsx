"use client";

import { useEffect, useId, useRef, useState } from "react";

import type { MessageDictionary } from "@/content/messages";

/**
 * The B2B lead form on the contact page. It posts JSON to the same-origin
 * `/api/contact` route, which validates, stores the lead, and notifies the
 * founders by email.
 *
 * Anti-spam: an invisible `website_url` honeypot field. Humans never see or
 * fill it; naive bots do, and the API acknowledges those submissions without
 * processing them. The wrapper is removed from the accessibility tree and the
 * tab order so assistive technology and keyboard users are never routed
 * through it.
 *
 * The form is uncontrolled: values are read from FormData on submit, so
 * typing causes no re-renders and the server-rendered markup stays inert
 * until hydration.
 */

type ContactFormMessages = MessageDictionary["contact"]["form"];

type SubmissionState = "idle" | "submitting" | "success" | "error";

const fieldBase =
  "rounded-control border-border-strong bg-surface text-ink placeholder:text-muted w-full border px-3.5 py-2.5 text-sm leading-6";
const labelBase = "text-ink mb-1.5 block text-sm font-medium";

export function ContactForm({ messages }: { messages: ContactFormMessages }) {
  const [state, setState] = useState<SubmissionState>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const nameId = useId();
  const companyId = useId();
  const emailId = useId();
  const messageId = useId();
  const errorId = useId();

  useEffect(() => {
    // Marks the form as interactive on the DOM rather than through state, so
    // hydration causes no re-render. Tests wait for this attribute before
    // submitting; a submit before hydration would fall back to the browser's
    // native submission instead of the JSON POST.
    formRef.current?.setAttribute("data-hydrated", "true");
  }, []);

  useEffect(() => {
    // Submitting unmounts the form together with the focused submit button,
    // which would silently drop keyboard and screen-reader users at the top
    // of the document. Moving focus onto the confirmation both restores
    // their place and makes assistive technology read it out.
    if (state === "success") {
      successRef.current?.focus();
    }
  }, [state]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "submitting") return;

    const formData = new FormData(event.currentTarget);
    setState("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          company: formData.get("company"),
          email: formData.get("email"),
          message: formData.get("message"),
          website_url: formData.get("website_url"),
        }),
      });

      setState(response.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="rounded-card border-border bg-surface-muted mt-10 max-w-xl border p-6"
      >
        <p className="text-ink text-base font-semibold">
          {messages.successTitle}
        </p>
        <p className="text-ink-soft mt-2 text-sm leading-6">
          {messages.successBody}
        </p>
      </div>
    );
  }

  return (
    /* method="post" keeps a pre-hydration or no-JavaScript submission from
       putting the entered personal data into the URL's query string. */
    <form
      ref={formRef}
      method="post"
      onSubmit={handleSubmit}
      className="mt-10 grid max-w-xl gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={nameId} className={labelBase}>
            {messages.nameLabel}
          </label>
          <input
            id={nameId}
            name="name"
            type="text"
            required
            maxLength={200}
            autoComplete="name"
            className={fieldBase}
          />
        </div>
        <div>
          <label htmlFor={companyId} className={labelBase}>
            {messages.companyLabel}
          </label>
          <input
            id={companyId}
            name="company"
            type="text"
            required
            maxLength={200}
            autoComplete="organization"
            className={fieldBase}
          />
        </div>
      </div>

      <div>
        <label htmlFor={emailId} className={labelBase}>
          {messages.emailLabel}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          required
          maxLength={320}
          autoComplete="email"
          className={fieldBase}
        />
      </div>

      <div>
        <label htmlFor={messageId} className={labelBase}>
          {messages.messageLabel}
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={5}
          maxLength={5000}
          className={`${fieldBase} resize-y`}
        />
      </div>

      {/* Honeypot: visually and programmatically hidden. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -z-10 h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="contact-website-url">Website</label>
        <input
          id="contact-website-url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="h-0 w-0 border-0 p-0 opacity-0"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={state === "submitting"}
          aria-describedby={state === "error" ? errorId : undefined}
          className="rounded-control ease-calm shadow-subtle inline-flex min-h-11 w-full items-center justify-center gap-2.5 border border-zinc-950 bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-[var(--motion-duration-fast)] hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {state === "submitting" && (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {state === "submitting"
            ? messages.submittingLabel
            : messages.submitLabel}
        </button>
        {state === "error" && (
          <p
            id={errorId}
            role="alert"
            className="text-accent-risk mt-3 text-sm leading-6"
          >
            {messages.errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}
