import { afterEach, describe, expect, it, vi } from "vitest";

import { isMatchEditable, isRoundOpen } from "@/lib/utils";

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

  it("solo permite editar si la fase está abierta y el partido no ha empezado", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-20T12:00:00.000Z"));

    expect(
      isMatchEditable(
        "2026-06-20T18:00:00.000Z",
        false,
        "2026-06-19T12:00:00.000Z",
      ),
    ).toBe(true);

    expect(
      isMatchEditable(
        "2026-06-20T18:00:00.000Z",
        false,
        "2026-06-21T12:00:00.000Z",
      ),
    ).toBe(false);

    expect(
      isMatchEditable(
        "2026-06-20T11:00:00.000Z",
        false,
        "2026-06-19T12:00:00.000Z",
      ),
    ).toBe(false);

    expect(
      isMatchEditable(
        "2026-06-20T18:00:00.000Z",
        true,
        "2026-06-19T12:00:00.000Z",
      ),
    ).toBe(false);
  });
});
