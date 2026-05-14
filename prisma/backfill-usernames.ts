import { prisma } from "@/lib/prisma";

function slugifyUsername(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
}

async function getAvailableUsername(base: string, taken: Set<string>) {
  let candidate = base || "usuario";
  let counter = 1;

  while (taken.has(candidate)) {
    candidate = `${base || "usuario"}${counter}`;
    counter += 1;
  }

  taken.add(candidate);
  return candidate;
}

async function main() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const taken = new Set(
    users.map((user) => user.username?.toLowerCase()).filter((value): value is string => Boolean(value)),
  );

  for (const user of users) {
    if (user.username) {
      continue;
    }

    const emailBase = user.email ? user.email.split("@")[0] ?? "" : "";
    const base = slugifyUsername(emailBase || user.name);
    const username = await getAvailableUsername(base, taken);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        username,
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
