import { describe, expect, it } from "vitest";

import { worldCup2026Fixtures } from "@/prisma/world-cup-2026";

function formatCanaryDate(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Atlantic/Canary",
  }).format(date);
}

function getFixture(roundName: string, homeTeam: string, awayTeam: string) {
  const fixture = worldCup2026Fixtures.find(
    (candidate) =>
      candidate.roundName === roundName &&
      candidate.homeTeam === homeTeam &&
      candidate.awayTeam === awayTeam,
  );

  if (!fixture) {
    throw new Error(`Fixture not found: ${roundName} ${homeTeam} vs ${awayTeam}`);
  }

  return fixture;
}

describe("worldCup2026Fixtures", () => {
  it("stores knockout fixtures so user-facing dates render correctly in Canary time", () => {
    expect(formatCanaryDate(getFixture("Dieciseisavos de final", "2º Grupo A", "2º Grupo B").startsAt)).toBe(
      "28/6/26, 20:00",
    );
    expect(formatCanaryDate(getFixture("Dieciseisavos de final", "1º Grupo C", "2º Grupo F").startsAt)).toBe(
      "29/6/26, 18:00",
    );
    expect(formatCanaryDate(getFixture("Final", "Ganador Partido 101", "Ganador Partido 102").startsAt)).toBe(
      "19/7/26, 20:00",
    );
  });
});
