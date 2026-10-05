import { describe, expect, it } from "vitest";
import { isAllowedOrigin, trustedOrigin } from "./origin";

describe("isAllowedOrigin", () => {
  it.each([
    "https://lepoidsdeschoses.com",
    "https://www.lepoidsdeschoses.com",
    "https://le-poids-des-choses.pages.dev",
    "https://feat-comptes.le-poids-des-choses.pages.dev",
    "https://1a2b3c4d.le-poids-des-choses.pages.dev",
  ])("accepte %s", (origin) => {
    expect(isAllowedOrigin(origin)).toBe(true);
  });

  it.each([
    "http://lepoidsdeschoses.com",
    "https://lepoidsdeschoses.com:8443",
    "https://lepoidsdeschoses.com/jardin",
    "https://evil.com",
    "https://lepoidsdeschoses.com.evil.com",
    "https://a.b.le-poids-des-choses.pages.dev",
    "https://autre-projet.pages.dev",
    "https://le-poids-des-choses.pages.dev.evil.com",
    "https://-x.le-poids-des-choses.pages.dev",
    "null",
    "",
    "https://localhost:8790",
  ])("refuse %s", (origin) => {
    expect(isAllowedOrigin(origin)).toBe(false);
  });

  it("localhost seulement si ALLOW_LOCALHOST", () => {
    expect(isAllowedOrigin("https://localhost:8790", true)).toBe(true);
    expect(isAllowedOrigin("http://127.0.0.1:8788", true)).toBe(true);
    expect(isAllowedOrigin("https://evil.com", true)).toBe(false);
  });
});

describe("trustedOrigin", () => {
  const post = (url: string, origin?: string) =>
    new Request(url, {
      method: "POST",
      headers: origin ? { Origin: origin } : {},
    });

  it("exige un en-tête Origin égal à l'adresse appelée", () => {
    const url = "https://lepoidsdeschoses.com/api/auth/link";
    expect(trustedOrigin(post(url, "https://lepoidsdeschoses.com"))).toBe(
      "https://lepoidsdeschoses.com",
    );
    expect(trustedOrigin(post(url))).toBeNull();
    expect(
      trustedOrigin(post(url, "https://www.lepoidsdeschoses.com")),
    ).toBeNull();
    expect(trustedOrigin(post(url, "https://evil.com"))).toBeNull();
  });

  it("refuse une adresse appelée hors de la liste, même cohérente", () => {
    expect(
      trustedOrigin(post("https://evil.com/api/auth/link", "https://evil.com")),
    ).toBeNull();
  });
});
