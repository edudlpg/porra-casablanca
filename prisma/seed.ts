import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import { getDefaultBroadcastForTeams } from "@/lib/broadcasts";
import { prisma } from "@/lib/prisma";
import { getWorldCup2026FixtureVenue, worldCup2026Fixtures, worldCup2026Rounds, worldCup2026Teams } from "@/prisma/world-cup-2026";

function getPlaceholderTeams() {
  const qualifiedTeamNames = new Set(worldCup2026Teams.map((team) => team.name));

  return Array.from(
    new Set(
      worldCup2026Fixtures
        .flatMap((fixture) => [fixture.homeTeam, fixture.awayTeam])
        .filter((name) => !qualifiedTeamNames.has(name)),
    ),
  ).map((name) => ({
    name,
    flagUrl: null,
  }));
}

async function main() {
  const adminPasswordHash = await bcrypt.hash("admin1234", 10);
  const userPasswordHash = await bcrypt.hash("usuario1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@porra.local" },
    update: {
      name: "Admin",
      username: "admin",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
    create: {
      name: "Admin",
      username: "admin",
      email: "admin@porra.local",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "maria@porra.local" },
    update: {
      name: "Maria",
      username: "maria",
      passwordHash: userPasswordHash,
      role: Role.USER,
    },
    create: {
      name: "Maria",
      username: "maria",
      email: "maria@porra.local",
      passwordHash: userPasswordHash,
      role: Role.USER,
    },
  });

  await prisma.prediction.deleteMany();
  await prisma.match.deleteMany();
  await prisma.round.deleteMany();
  await prisma.team.deleteMany();
  await prisma.appConfig.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      entryFee: 0,
    },
  });

  await prisma.team.createMany({
    data: [...worldCup2026Teams, ...getPlaceholderTeams()],
  });

  for (const round of worldCup2026Rounds) {
    await prisma.round.create({
      data: round,
    });
  }

  const [teams, rounds] = await Promise.all([
    prisma.team.findMany(),
    prisma.round.findMany(),
  ]);

  const teamByName = new Map(teams.map((team) => [team.name, team.id]));
  const roundByName = new Map(rounds.map((round) => [round.name, round.id]));

  await prisma.match.createMany({
    data: worldCup2026Fixtures.map((fixture) => ({
      ...getWorldCup2026FixtureVenue(fixture.homeTeam, fixture.awayTeam),
      roundId: roundByName.get(fixture.roundName)!,
      homeTeamId: teamByName.get(fixture.homeTeam)!,
      awayTeamId: teamByName.get(fixture.awayTeam)!,
      startsAt: fixture.startsAt,
      homeScore: null,
      awayScore: null,
      broadcast: getDefaultBroadcastForTeams(fixture.homeTeam, fixture.awayTeam),
      isLocked: false,
    })),
  });
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
