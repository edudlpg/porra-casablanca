import { prisma } from "@/lib/prisma";
import { synchronizeTournamentProgression } from "@/lib/tournament-progression";

const DEMO_ROUND_NAMES = ["Demo", "Demo semifinales", "Demo final"];
const SEMIFINAL_ROUND_NAME = "Demo semifinales";
const FINAL_ROUND_NAME = "Demo final";
const PLACEHOLDER_HOME = "Ganador Demo semifinal 1";
const PLACEHOLDER_AWAY = "Ganador Demo semifinal 2";

const demoTeams = ["España", "Francia", "Brasil", "Argentina"];

async function deleteExistingDemoRounds() {
  await prisma.prediction.deleteMany({
    where: {
      match: {
        round: {
          name: {
            in: DEMO_ROUND_NAMES,
          },
        },
      },
    },
  });

  await prisma.match.deleteMany({
    where: {
      round: {
        name: {
          in: DEMO_ROUND_NAMES,
        },
      },
    },
  });

  await prisma.round.deleteMany({
    where: {
      name: {
        in: DEMO_ROUND_NAMES,
      },
    },
  });
}

async function ensurePlaceholderTeam(name: string) {
  return prisma.team.upsert({
    where: { name },
    update: {},
    create: {
      name,
      flagUrl: null,
      groupCode: null,
    },
  });
}

async function main() {
  await deleteExistingDemoRounds();

  const [teams, placeholderHome, placeholderAway] = await Promise.all([
    prisma.team.findMany({
      where: {
        name: {
          in: demoTeams,
        },
      },
    }),
    ensurePlaceholderTeam(PLACEHOLDER_HOME),
    ensurePlaceholderTeam(PLACEHOLDER_AWAY),
  ]);

  const teamByName = new Map(teams.map((team) => [team.name, team.id]));

  for (const teamName of demoTeams) {
    if (!teamByName.has(teamName)) {
      throw new Error(`No existe el equipo necesario para la demo: ${teamName}`);
    }
  }

  const semifinalRound = await prisma.round.create({
    data: {
      name: SEMIFINAL_ROUND_NAME,
      unlockAt: new Date("2026-05-18T08:00:00.000Z"),
      startDate: new Date("2026-05-18T00:00:00.000Z"),
      endDate: new Date("2026-05-18T22:59:00.000Z"),
    },
  });

  const finalRound = await prisma.round.create({
    data: {
      name: FINAL_ROUND_NAME,
      unlockAt: new Date("2026-05-18T22:00:00.000Z"),
      startDate: new Date("2026-05-19T00:00:00.000Z"),
      endDate: new Date("2026-05-19T22:59:00.000Z"),
    },
  });

  await prisma.match.createMany({
    data: [
      {
        roundId: semifinalRound.id,
        homeTeamId: teamByName.get("España")!,
        awayTeamId: teamByName.get("Francia")!,
        homeSlotLabel: "España",
        awaySlotLabel: "Francia",
        venueName: "Demo Partido 901",
        venueCity: "Las Palmas",
        startsAt: new Date("2026-05-18T20:00:00.000Z"),
      },
      {
        roundId: semifinalRound.id,
        homeTeamId: teamByName.get("Brasil")!,
        awayTeamId: teamByName.get("Argentina")!,
        homeSlotLabel: "Brasil",
        awaySlotLabel: "Argentina",
        venueName: "Demo Partido 902",
        venueCity: "Las Palmas",
        startsAt: new Date("2026-05-18T20:30:00.000Z"),
      },
      {
        roundId: finalRound.id,
        homeTeamId: placeholderHome.id,
        awayTeamId: placeholderAway.id,
        homeSlotLabel: "Ganador Partido 901",
        awaySlotLabel: "Ganador Partido 902",
        venueName: "Demo Final",
        venueCity: "Las Palmas",
        startsAt: new Date("2026-05-19T20:00:00.000Z"),
      },
    ],
  });

  await synchronizeTournamentProgression(prisma);

  console.log("Demo knockout creada: semifinales hoy y final mañana.");
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
