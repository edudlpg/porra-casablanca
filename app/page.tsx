import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

import { auth } from "@/lib/auth";

export default async function IndexPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === Role.ADMIN) {
    redirect("/home");
  }

  redirect("/home");
}
