import type { ReactNode } from "react";

import { BottomNav } from "@/components/layout/bottom-nav";

type AppShellProps = {
  children: ReactNode;
  isAdmin: boolean;
};

export function AppShell({ children, isAdmin }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-28 pt-6">
      {children}
      <BottomNav isAdmin={isAdmin} />
    </div>
  );
}
