"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, Globe2, Home, ShieldCheck, UserCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  href: Route;
  label: string;
  icon: typeof Home;
};

const USER_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/jornadas", label: "Jornadas", icon: CalendarDays },
  { href: "/mundial", label: "Mundial", icon: Globe2 },
  { href: "/clasificacion", label: "Clasificación", icon: BarChart3 },
  { href: "/perfil", label: "Perfil", icon: UserCircle2 },
] satisfies NavItem[];

const ADMIN_ITEMS = [
  { href: "/admin", label: "Admin", icon: ShieldCheck },
] satisfies NavItem[];

type BottomNavProps = {
  isAdmin: boolean;
};

export function BottomNav({ isAdmin }: BottomNavProps) {
  const pathname = usePathname();
  const items = isAdmin ? [...USER_ITEMS, ...ADMIN_ITEMS] : USER_ITEMS;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between gap-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/home" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition",
                active
                  ? "bg-slate-950 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              <item.icon className={cn("size-4", active ? "text-white" : "text-current")} />
              <span className={cn("truncate", active ? "text-white" : "text-current")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
