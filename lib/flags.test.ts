import { describe, expect, it } from "vitest";

import { extractFlagCode, getDisplayFlagUrl, getFlagEmoji, getLocalFlagUrl } from "@/lib/flags";

describe("flag helpers", () => {
  it("extrae el codigo desde la URL de FlagCDN", () => {
    expect(extractFlagCode("https://flagcdn.com/es.svg")).toBe("es");
    expect(extractFlagCode("https://flagcdn.com/w80/gb-eng.png")).toBe("gb-eng");
  });

  it("convierte codigos ISO en emoji de bandera", () => {
    expect(getFlagEmoji("https://flagcdn.com/es.svg")).toBe("🇪🇸");
    expect(getFlagEmoji("https://flagcdn.com/us.svg")).toBe("🇺🇸");
  });

  it("normaliza las banderas de FlagCDN a PNG para renderizado", () => {
    expect(getDisplayFlagUrl("https://flagcdn.com/es.svg")).toBe("https://flagcdn.com/w80/es.png");
    expect(getDisplayFlagUrl("https://flagcdn.com/w80/gb-eng.png", 160)).toBe("https://flagcdn.com/w160/gb-eng.png");
  });

  it("deriva la ruta local cuando reconoce el codigo de bandera", () => {
    expect(getLocalFlagUrl("https://flagcdn.com/es.svg")).toBe("/flags/es.png");
    expect(getLocalFlagUrl("https://flagcdn.com/w80/gb-eng.png")).toBe("/flags/gb-eng.png");
  });

  it("soporta banderas de subdivision usadas por Inglaterra y Escocia", () => {
    const englandFlag = getFlagEmoji("https://flagcdn.com/gb-eng.svg");
    const scotlandFlag = getFlagEmoji("https://flagcdn.com/gb-sct.svg");

    expect(englandFlag).not.toBeNull();
    expect(scotlandFlag).not.toBeNull();
    expect(englandFlag).not.toBe("🏴");
    expect(scotlandFlag).not.toBe("🏴");
    expect(Array.from(englandFlag ?? "")).toHaveLength(7);
    expect(Array.from(scotlandFlag ?? "")).toHaveLength(7);
  });

  it("devuelve null cuando no puede derivar una bandera", () => {
    expect(getFlagEmoji(null)).toBeNull();
    expect(getFlagEmoji("https://example.com/custom-flag.png")).toBeNull();
    expect(getDisplayFlagUrl(null)).toBeNull();
  });
});
