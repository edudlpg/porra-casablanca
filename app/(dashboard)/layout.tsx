import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <AppShell isAdmin={session.user.role === Role.ADMIN}>{children}</AppShell>;
}
