import { describe, expect, it } from "vitest";

import { formatMatchVenue } from "@/lib/venues";

describe("formatMatchVenue", () => {
  it("prioriza estadio y ciudad cuando existen", () => {
    expect(
      formatMatchVenue({
        venueName: "Boston Stadium",
        venueCity: "Boston",
        round: { name: "Fase de grupos" },
      }),
    ).toBe("Boston Stadium, Boston");
  });

  it("vuelve al nombre de la jornada si faltan datos de sede", () => {
    expect(
      formatMatchVenue({
        venueName: null,
        venueCity: null,
        round: { name: "Octavos de final" },
      }),
    ).toBe("Octavos de final");
  });
});
