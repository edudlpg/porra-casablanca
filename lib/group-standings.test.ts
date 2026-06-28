import { describe, expect, it } from "vitest";

import { buildBestThirdPlaceRows, buildGroupStandings, compareStandingRows } from "@/lib/group-standings";

function team(id: string, name: string, groupCode: "E" | "L") {
  return {
    id,
    name,
    flagUrl: null,
    groupCode,
  };
}

describe("compareStandingRows", () => {
  it("usa Fair Play antes del fallback alfabetico", () => {
    const ghana = {
      team: team("ghana", "Ghana", "L"),
      points: 4,
      goalDifference: 0,
      goalsFor: 2,
    };
    const ecuador = {
      team: team("ecuador", "Ecuador", "E"),
      points: 4,
      goalDifference: 0,
      goalsFor: 2,
    };

    expect([ecuador, ghana].sort(compareStandingRows).map((row) => row.team.name)).toEqual([
      "Ghana",
      "Ecuador",
    ]);
  });

  it("usa ranking FIFA si todo lo anterior sigue empatado", () => {
    const alpha = {
      team: team("alpha", "Alpha", "E"),
      points: 4,
      goalDifference: 0,
      goalsFor: 2,
    };
    const zeta = {
      team: team("zeta", "Zeta", "L"),
      points: 4,
      goalDifference: 0,
      goalsFor: 2,
    };

    expect(
      [zeta, alpha]
        .sort((left, right) =>
          compareStandingRows(left, right, {
            fifaRankingByTeamName: new Map([
              ["Alpha", 40],
              ["Zeta", 12],
            ]),
            teamConductScoreByTeamName: new Map([
              ["Alpha", -3],
              ["Zeta", -3],
            ]),
          }),
        )
        .map((row) => row.team.name),
    ).toEqual(["Zeta", "Alpha"]);
  });
});

describe("buildBestThirdPlaceRows", () => {
  it("ordena terceros empatados con los criterios FIFA extendidos", () => {
    const teams = [
      team("germany", "Alemania", "E"),
      team("ivory-coast", "Costa de Marfil", "E"),
      team("ecuador", "Ecuador", "E"),
      team("curacao", "Curazao", "E"),
      team("england", "Inglaterra", "L"),
      team("croatia", "Croacia", "L"),
      team("ghana", "Ghana", "L"),
      team("panama", "Panamá", "L"),
    ];
    const standings = buildGroupStandings(teams, [
      {
        homeTeamId: "ecuador",
        awayTeamId: "curacao",
        homeScore: 2,
        awayScore: 0,
        homeTeam: teams[2],
        awayTeam: teams[3],
      },
      {
        homeTeamId: "germany",
        awayTeamId: "ecuador",
        homeScore: 1,
        awayScore: 0,
        homeTeam: teams[0],
        awayTeam: teams[2],
      },
      {
        homeTeamId: "ivory-coast",
        awayTeamId: "ecuador",
        homeScore: 1,
        awayScore: 0,
        homeTeam: teams[1],
        awayTeam: teams[2],
      },
      {
        homeTeamId: "ghana",
        awayTeamId: "panama",
        homeScore: 2,
        awayScore: 0,
        homeTeam: teams[6],
        awayTeam: teams[7],
      },
      {
        homeTeamId: "england",
        awayTeamId: "ghana",
        homeScore: 1,
        awayScore: 0,
        homeTeam: teams[4],
        awayTeam: teams[6],
      },
      {
        homeTeamId: "croatia",
        awayTeamId: "ghana",
        homeScore: 1,
        awayScore: 0,
        homeTeam: teams[5],
        awayTeam: teams[6],
      },
    ]);

    expect(buildBestThirdPlaceRows(standings).map((row) => row.team.name)).toEqual([
      "Ghana",
      "Ecuador",
    ]);
  });
});
