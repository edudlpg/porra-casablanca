import { describe, expect, it } from "vitest";

import { calculatePredictionScore } from "@/lib/scoring";

describe("calculatePredictionScore", () => {
  it("devuelve EXACT y 3 puntos cuando el resultado coincide exactamente", () => {
    expect(calculatePredictionScore(2, 1, 2, 1)).toEqual({
      points: 3,
      scoreType: "EXACT",
    });
  });

  it("prioriza EXACT por encima de diferencia y signo", () => {
    expect(calculatePredictionScore(0, 0, 0, 0)).toEqual({
      points: 3,
      scoreType: "EXACT",
    });
  });

  it("devuelve GOAL_DIFFERENCE y 2 puntos cuando coincide la diferencia", () => {
    expect(calculatePredictionScore(2, 0, 3, 1)).toEqual({
      points: 2,
      scoreType: "GOAL_DIFFERENCE",
    });
  });

  it("aplica GOAL_DIFFERENCE también a empates con diferencia 0", () => {
    expect(calculatePredictionScore(1, 1, 0, 0)).toEqual({
      points: 2,
      scoreType: "GOAL_DIFFERENCE",
    });
  });

  it("devuelve FINAL_RESULT y 1 punto cuando solo coincide el signo", () => {
    expect(calculatePredictionScore(2, 1, 3, 0)).toEqual({
      points: 1,
      scoreType: "FINAL_RESULT",
    });
  });

  it("devuelve FAILED y 0 puntos cuando no acierta nada", () => {
    expect(calculatePredictionScore(1, 0, 0, 2)).toEqual({
      points: 0,
      scoreType: "FAILED",
    });
  });
});
