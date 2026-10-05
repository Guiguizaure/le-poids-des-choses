import { describe, expect, it } from "vitest";
import { installAccess, installMode, isIos } from "./install";

const base = {
  standalone: false,
  dismissed: false,
  canPrompt: false,
  ios: false,
};

describe("bandeau d'installation", () => {
  it("Android / Chrome : propose l'installation", () => {
    expect(installMode({ ...base, canPrompt: true })).toBe("prompt");
  });
  it("iPhone : explique « Partager, puis Sur l'écran d'accueil »", () => {
    expect(installMode({ ...base, ios: true })).toBe("ios");
  });
  it("disparaît si l'app est déjà installée ou si le bandeau a été fermé", () => {
    expect(installMode({ ...base, canPrompt: true, standalone: true })).toBe(
      "hidden",
    );
    expect(installMode({ ...base, ios: true, dismissed: true })).toBe("hidden");
  });
  it("navigateur sans installation possible : rien", () => {
    expect(installMode(base)).toBe("hidden");
  });
  it("accès permanent : reste disponible une fois le bandeau fermé", () => {
    const androidClosed = { ...base, canPrompt: true, dismissed: true };
    const iphoneClosed = { ...base, ios: true, dismissed: true };
    expect(installMode(androidClosed)).toBe("hidden");
    expect(installAccess(androidClosed)).toBe("prompt");
    expect(installMode(iphoneClosed)).toBe("hidden");
    expect(installAccess(iphoneClosed)).toBe("ios");
  });
  it("accès permanent : masqué si l'app est installée ou impossible à installer", () => {
    expect(installAccess({ ...base, canPrompt: true, standalone: true })).toBe(
      "hidden",
    );
    expect(installAccess({ ...base, ios: true, standalone: true })).toBe(
      "hidden",
    );
    expect(installAccess(base)).toBe("hidden");
  });
  it("détecte iPhone, iPad et iPadOS", () => {
    expect(
      isIos("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)"),
    ).toBe(true);
    expect(isIos("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 5)).toBe(
      true,
    );
    expect(isIos("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", 0)).toBe(
      false,
    );
    expect(isIos("Mozilla/5.0 (Linux; Android 15)")).toBe(false);
  });
});
