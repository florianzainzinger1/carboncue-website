import { beforeEach, describe, expect, it, vi } from "vitest";

const sqlMock = vi.fn();
const sendMock = vi.fn();

vi.mock("@vercel/postgres", () => ({
  sql: (...args: unknown[]) => sqlMock(...args),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { POST } from "../../src/app/api/contact/route";

function jsonRequest(body: unknown): Request {
  return new Request("http://127.0.0.1/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validLead = {
  name: "Anna Beispiel",
  company: "Beispiel Industrie GmbH",
  email: "anna@beispiel-industrie.example",
  message: "Bitte um Rückruf.",
  website_url: "",
};

describe("POST /api/contact", () => {
  beforeEach(() => {
    sqlMock.mockReset().mockResolvedValue({ rows: [] });
    sendMock
      .mockReset()
      .mockResolvedValue({ data: { id: "email" }, error: null });
  });

  it("stores a valid lead and sends the notification email", async () => {
    const response = await POST(jsonRequest(validLead));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });

    expect(sqlMock).toHaveBeenCalledTimes(1);
    const [, ...values] = sqlMock.mock.calls[0] as [unknown, ...unknown[]];
    expect(values).toEqual([
      "Anna Beispiel",
      "Beispiel Industrie GmbH",
      "anna@beispiel-industrie.example",
      "Bitte um Rückruf.",
    ]);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const emailArgs = sendMock.mock.calls[0][0] as Record<string, unknown>;
    expect(emailArgs.to).toBe("kontakt@carboncue.eu");
    expect(emailArgs.subject).toBe(
      "🚨 Neuer CarbonCue Lead: Beispiel Industrie GmbH",
    );
    expect(emailArgs.replyTo).toBe("anna@beispiel-industrie.example");
    expect(emailArgs.text).toContain("Anna Beispiel");
  });

  it("acknowledges a filled honeypot without storing or emailing", async () => {
    const response = await POST(
      jsonRequest({ ...validLead, website_url: "https://spam.example" }),
    );

    expect(response.status).toBe(200);
    expect(sqlMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid payload with 400 and no side effects", async () => {
    const response = await POST(
      jsonRequest({ name: "", company: "X", email: "not-an-email" }),
    );

    expect(response.status).toBe(400);
    expect(sqlMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects unknown fields to keep the payload contract strict", async () => {
    const response = await POST(jsonRequest({ ...validLead, admin: true }));

    expect(response.status).toBe(400);
    expect(sqlMock).not.toHaveBeenCalled();
  });

  it("rejects a body that is not JSON", async () => {
    const response = await POST(
      new Request("http://127.0.0.1/api/contact", {
        method: "POST",
        body: "name=Anna",
      }),
    );

    expect(response.status).toBe(400);
  });

  it("returns 500 when the lead cannot be stored, and sends no email", async () => {
    sqlMock.mockRejectedValueOnce(new Error("connection refused"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(jsonRequest(validLead));

    expect(response.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("still succeeds when the notification email fails after the insert", async () => {
    sendMock.mockRejectedValueOnce(new Error("resend down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(jsonRequest(validLead));

    expect(response.status).toBe(200);
    expect(sqlMock).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });
});
