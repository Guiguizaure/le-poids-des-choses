import { describe, expect, it } from "vitest";
import { checkTurnstileKey } from "./check";

describe("checkTurnstileKey", () => {
  it("prévient sans bloquer quand la clé publique manque", () => {
    expect(checkTurnstileKey({})).toMatchObject({ ok: true });
    expect(checkTurnstileKey({}).message).toMatch(/^Attention/);
    expect(
      checkTurnstileKey({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4AAA" }).message,
    ).toBe("Turnstile : clé publique définie.");
  });
});
