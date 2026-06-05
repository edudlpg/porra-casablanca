import { afterEach, describe, expect, it, vi } from "vitest";

import { formatDateTime, isMatchEditable, isRoundInWindow, isRoundOpen, isRoundPredictionWindow } from "@/lib/utils";

describe("date formatting", () => {
  it("muestra la misma fecha absoluta en la zona horaria indicada por Intl", () => {
    const openingMatchTime = "2026-06-11T19:00:00.000Z";

    expect(
      new Intl.DateTimeFormat("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Atlantic/Canary",
      }).format(new Date(openingMatchTime)),
    ).toBe("11 jun 2026, 20:00");

    expect(
      new Intl.DateTimeFormat("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(new Date(openingMatchTime)),
    ).toBe("11 jun 2026, 19:00");

    expect(formatDateTime(openingMatchTime)).toMatch(/11 jun 2026/);
  });
});

describe("round availability helpers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("abre la fase cuando se alcanza unlockAt", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-28T12:00:00.000Z"));

    expect(isRoundOpen("2026-06-28T12:00:00.000Z")).toBe(true);
    expect(isRoundOpen("2026-06-28T12:01:00.000Z")).toBe(false);
  });

  it("mantiene la fase activa solo hasta endDate cuando se usa ventana completa", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-28T12:00:00.000Z"));

    expect(isRoundInWindow("2026-06-28T11:00:00.000Z", "2026-06-28T13:00:00.000Z")).toBe(true);
    expect(isRoundInWindow("2026-06-28T11:00:00.000Z", "2026-06-28T11:59:00.000Z")).toBe(false);
  });

  it("mantiene las predicciones abiertas solo hasta startDate", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-28T12:00:00.000Z"));

    expect(isRoundPredictionWindow("2026-06-28T11:00:00.000Z", "2026-06-28T13:00:00.000Z")).toBe(true);
    expect(isRoundPredictionWindow("2026-06-28T11:00:00.000Z", "2026-06-28T12:00:00.000Z")).toBe(false);
  });

  it("solo permite editar si la fase está en ventana de predicción y el partido no ha empezado", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-20T12:00:00.000Z"));

    expect(
      isMatchEditable(
        "2026-06-20T18:00:00.000Z",
        false,
        "2026-06-19T12:00:00.000Z",
        "2026-06-21T12:00:00.000Z",
      ),
    ).toBe(true);

    expect(
      isMatchEditable(
        "2026-06-20T18:00:00.000Z",
        false,
        "2026-06-21T12:00:00.000Z",
        "2026-06-22T12:00:00.000Z",
      ),
    ).toBe(false);

    expect(
      isMatchEditable(
        "2026-06-20T11:00:00.000Z",
        false,
        "2026-06-19T12:00:00.000Z",
        "2026-06-21T12:00:00.000Z",
      ),
    ).toBe(false);

    expect(
      isMatchEditable(
        "2026-06-20T18:00:00.000Z",
        true,
        "2026-06-19T12:00:00.000Z",
        "2026-06-21T12:00:00.000Z",
      ),
    ).toBe(false);

    expect(
      isMatchEditable(
        "2026-06-20T18:00:00.000Z",
        false,
        "2026-06-19T12:00:00.000Z",
        "2026-06-20T11:59:00.000Z",
      ),
    ).toBe(false);
  });
});
