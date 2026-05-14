import { describe, expect, it } from "vitest";

import { getDefaultBroadcastForTeams } from "@/lib/broadcasts";

describe("broadcast helpers", () => {
  it("marca como RTVE los partidos del listado configurado", () => {
    expect(getDefaultBroadcastForTeams("México", "Sudáfrica")).toBe("RTVE");
    expect(getDefaultBroadcastForTeams("Colombia", "Portugal")).toBe("RTVE");
  });

  it("tolera el orden de local y visitante al comprobar RTVE", () => {
    expect(getDefaultBroadcastForTeams("Escocia", "Brasil")).toBe("RTVE");
    expect(getDefaultBroadcastForTeams("Alemania", "Ecuador")).toBe("RTVE");
  });

  it("deja el resto de partidos en DAZN", () => {
    expect(getDefaultBroadcastForTeams("Catar", "Suiza")).toBe("DAZN");
  });
});
