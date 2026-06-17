import { afterEach, describe, expect, it, vi } from "vitest";

import {
  addDaysToDateParam,
  formatDateParam,
  formatDateTime,
  getDateParamRange,
  isMatchEditable,
  isRoundInWindow,
  isRoundOpen,
  isRoundPredictionWindow,
  normalizeDateParam,
} from "@/lib/utils";

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

describe("match day helpers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("obtiene la fecha local de la aplicación para el día por defecto", () => {
    expect(formatDateParam(new Date("2026-06-16T23:30:00.000Z"))).toBe("2026-06-17");
  });

  it("valida y normaliza el parámetro de fecha", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-17T08:00:00.000Z"));

    expect(normalizeDateParam("2026-06-11")).toBe("2026-06-11");
    expect(normalizeDateParam("2026-02-31")).toBe("2026-06-17");
    expect(normalizeDateParam("invalid")).toBe("2026-06-17");
  });

  it("navega entre días con formato estable", () => {
    expect(addDaysToDateParam("2026-06-11", -1)).toBe("2026-06-10");
    expect(addDaysToDateParam("2026-06-30", 1)).toBe("2026-07-01");
  });

  it("calcula el rango UTC de un día en la zona local de la aplicación", () => {
    const range = getDateParamRange("2026-06-17");

    expect(range.start.toISOString()).toBe("2026-06-16T23:00:00.000Z");
    expect(range.end.toISOString()).toBe("2026-06-17T23:00:00.000Z");
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
