import { prisma } from "@/lib/prisma";
import { getDefaultBroadcastForTeams } from "@/lib/broadcasts";

async function main() {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  const daznMatchIds: string[] = [];
  const rtveMatchIds: string[] = [];

  for (const match of matches) {
    const broadcast = getDefaultBroadcastForTeams(match.homeTeam.name, match.awayTeam.name);

    if (broadcast === "RTVE") {
      rtveMatchIds.push(match.id);
    } else {
      daznMatchIds.push(match.id);
    }
  }

  if (daznMatchIds.length) {
    await prisma.match.updateMany({
      where: {
        id: {
          in: daznMatchIds,
        },
      },
      data: {
        broadcast: "DAZN",
      },
    });
  }

  if (rtveMatchIds.length) {
    await prisma.match.updateMany({
      where: {
        id: {
          in: rtveMatchIds,
        },
      },
      data: {
        broadcast: "RTVE",
      },
    });
  }

  console.log(`Updated ${matches.length} matches.`);
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
