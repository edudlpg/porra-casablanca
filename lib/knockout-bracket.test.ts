import { describe, expect, it } from "vitest";

import { getBracketSlotDisplayName } from "@/lib/knockout-bracket";

describe("getBracketSlotDisplayName", () => {
  it("mantiene el slot cuando aun no se ha resuelto el equipo", () => {
    expect(getBracketSlotDisplayName("Ganador Partido 74", "Ganador Partido 74")).toBe(
      "Ganador Partido 74",
    );
    expect(getBracketSlotDisplayName("1º Grupo E", "1º Grupo E")).toBe("1º Grupo E");
  });

  it("muestra el equipo real cuando el slot ya fue sincronizado", () => {
    expect(getBracketSlotDisplayName("Ganador Partido 74", "España")).toBe("España");
    expect(getBracketSlotDisplayName("1º Grupo E", "Alemania")).toBe("Alemania");
  });

  it("usa el equipo cuando no hay etiqueta de slot", () => {
    expect(getBracketSlotDisplayName(null, "Argentina")).toBe("Argentina");
  });
});
