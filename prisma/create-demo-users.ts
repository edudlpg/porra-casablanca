import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

const DEMO_USERS = Array.from({ length: 10 }, (_, index) => {
  const userNumber = String(index + 1).padStart(2, "0");

  return {
    name: `Usuario ${userNumber}`,
    username: `demo${userNumber}`,
    teamName: `demo${userNumber}`,
    email: `demo${userNumber}@porra.local`,
  };
});

async function main() {
  const passwordHash = await bcrypt.hash("usuario1234", 10);

  for (const user of DEMO_USERS) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        username: user.username,
        teamName: user.teamName,
        passwordHash,
        role: Role.USER,
      },
      create: {
        ...user,
        passwordHash,
        role: Role.USER,
      },
    });
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
