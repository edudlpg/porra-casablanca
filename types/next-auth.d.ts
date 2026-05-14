import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      avatarUrl?: string | null;
      role: Role;
    };
  }

  interface User {
    username?: string;
    avatarUrl?: string | null;
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    avatarUrl?: string | null;
    role?: Role;
  }
}
