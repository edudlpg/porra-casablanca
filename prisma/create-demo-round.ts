import { prisma } from "@/lib/prisma";
import { calculatePredictionScore } from "@/lib/scoring";

const DEMO_ROUND_NAME = "Demo";

const DEMO_MATCHES = [
  {
    homeTeam: "España",
    awayTeam: "Francia",
    venueName: "Demo Stadium",
    venueCity: "Las Palmas",
    startsAt: new Date("2026-05-12T16:00:00.000Z"),
    homeScore: 2,
    awayScore: 1,
  },
  {
    homeTeam: "Brasil",
    awayTeam: "Argentina",
    venueName: "Demo Arena",
    venueCity: "Santa Cruz de Tenerife",
    startsAt: new Date("2026-05-12T19:30:00.000Z"),
    homeScore: 1,
    awayScore: 1,
  },
] as const;

function randomScore() {
  return Math.floor(Math.random() * 5);
}

async function main() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const teams = await prisma.team.findMany({
    where: {
      name: {
        in: Array.from(new Set(DEMO_MATCHES.flatMap((match) => [match.homeTeam, match.awayTeam]))),
      },
    },
  });

  const teamByName = new Map(teams.map((team) => [team.name, team.id]));

  const round = await prisma.round.upsert({
    where: { name: DEMO_ROUND_NAME },
    update: {
      unlockAt: new Date("2026-05-11T08:00:00.000Z"),
      startDate: new Date("2026-05-12T00:00:00.000Z"),
      endDate: new Date("2026-05-12T23:59:00.000Z"),
    },
    create: {
      name: DEMO_ROUND_NAME,
      unlockAt: new Date("2026-05-11T08:00:00.000Z"),
      startDate: new Date("2026-05-12T00:00:00.000Z"),
      endDate: new Date("2026-05-12T23:59:00.000Z"),
    },
  });

  await prisma.prediction.deleteMany({
    where: {
      match: {
        roundId: round.id,
      },
    },
  });

  await prisma.match.deleteMany({
    where: {
      roundId: round.id,
    },
  });

  for (const demoMatch of DEMO_MATCHES) {
    const match = await prisma.match.create({
      data: {
        roundId: round.id,
        homeTeamId: teamByName.get(demoMatch.homeTeam)!,
        awayTeamId: teamByName.get(demoMatch.awayTeam)!,
        venueName: demoMatch.venueName,
        venueCity: demoMatch.venueCity,
        startsAt: demoMatch.startsAt,
        homeScore: demoMatch.homeScore,
        awayScore: demoMatch.awayScore,
        isLocked: true,
      },
    });

    for (const user of users) {
      const predictedHomeScore = randomScore();
      const predictedAwayScore = randomScore();
      const scored = calculatePredictionScore(
        predictedHomeScore,
        predictedAwayScore,
        demoMatch.homeScore,
        demoMatch.awayScore,
      );

      await prisma.prediction.create({
        data: {
          userId: user.id,
          matchId: match.id,
          predictedHomeScore,
          predictedAwayScore,
          points: scored.points,
          scoreType: scored.scoreType,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
