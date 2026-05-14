import { describe, expect, it } from "vitest";

import { buildRankingEntries } from "@/lib/ranking";

describe("buildRankingEntries", () => {
  it("ordena por puntos y calcula premios del bote", () => {
    const entries = buildRankingEntries(
      [
        {
          id: "u1",
          name: "Ana",
          email: "ana@example.com",
          predictions: [
            { points: 5, scoreType: "EXACT" },
            { points: 3, scoreType: "FINAL_RESULT" },
          ],
        },
        {
          id: "u2",
          name: "Beto",
          email: "beto@example.com",
          predictions: [{ points: 6, scoreType: "GOAL_DIFFERENCE" }],
        },
        {
          id: "u3",
          name: "Carla",
          email: "carla@example.com",
          predictions: [{ points: 2, scoreType: "FINAL_RESULT" }],
        },
        {
          id: "u4",
          name: "Dani",
          email: "dani@example.com",
          predictions: [{ points: 1, scoreType: "FAILED" }],
        },
      ],
      10,
    );

    expect(entries.map((entry) => entry.user.name)).toEqual(["Ana", "Beto", "Carla", "Dani"]);
    expect(entries[0]?.prizeAmount).toBe(10);
    expect(entries[1]?.prizeAmount).toBe(20);
    expect(entries[2]?.prizeAmount).toBe(10);
    expect(entries[3]?.prizeAmount).toBe(0);
  });

  it("reparte de forma razonable cuando solo hay dos participantes", () => {
    const entries = buildRankingEntries(
      [
        {
          id: "u1",
          name: "Ana",
          email: "ana@example.com",
          predictions: [{ points: 5, scoreType: "EXACT" }],
        },
        {
          id: "u2",
          name: "Beto",
          email: "beto@example.com",
          predictions: [{ points: 3, scoreType: "FINAL_RESULT" }],
        },
      ],
      10,
    );

    expect(entries[0]?.prizeAmount).toBe(0);
    expect(entries[1]?.prizeAmount).toBe(20);
  });
});
