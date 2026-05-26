"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  assertAuthRateLimit,
  clearAuthRateLimit,
  getRequestIp,
  registerAuthFailure,
} from "@/lib/rate-limit";
import { signIn, signOut } from "@/lib/auth";
import { formDataToObject, loginSchema, registerSchema } from "@/lib/validations";

function getRateLimitErrorMessage(retryAfterMs: number) {
  const retryAfterMinutes = Math.max(1, Math.ceil(retryAfterMs / 60000));

  return `Demasiados intentos. Vuelve a intentarlo en ${retryAfterMinutes} min.`;
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const ip = await getRequestIp();
  const parsed = loginSchema.safeParse({ username, password });

  if (!parsed.success) {
    redirect("/login?error=Usuario o contraseña incorrectos.");
  }

  const rateLimit = await assertAuthRateLimit("login", [ip, parsed.data.username]);

  if (!rateLimit.allowed) {
    redirect(`/login?error=${encodeURIComponent(getRateLimitErrorMessage(rateLimit.retryAfterMs))}`);
  }

  try {
    await signIn("credentials", {
      username: parsed.data.username,
      password: parsed.data.password,
      redirectTo: "/home",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const failure = await registerAuthFailure("login", [ip, parsed.data.username]);
      const message = failure.blockedUntil
        ? getRateLimitErrorMessage(failure.blockedUntil.getTime() - Date.now())
        : "Usuario o contraseña incorrectos.";

      redirect(`/login?error=${encodeURIComponent(message)}`);
    }

    throw error;
  }

  await clearAuthRateLimit("login", [ip, parsed.data.username]);
}

export async function registerAction(formData: FormData) {
  const ip = await getRequestIp();
  const rateLimit = await assertAuthRateLimit("register", [ip]);

  if (!rateLimit.allowed) {
    redirect(`/register?error=${encodeURIComponent(getRateLimitErrorMessage(rateLimit.retryAfterMs))}`);
  }

  const parsed = registerSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirect(`/register?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Datos inválidos.")}`);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      username: {
        equals: parsed.data.username,
        mode: "insensitive",
      },
    },
  });

  if (existingUser) {
    await registerAuthFailure("register", [ip]);
    redirect("/register?error=Ya existe una cuenta con ese usuario.");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.username,
        username: parsed.data.username,
        teamName: parsed.data.username,
        email: null,
        passwordHash,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      await registerAuthFailure("register", [ip]);
      redirect("/register?error=Ya existe una cuenta con ese usuario.");
    }

    throw error;
  }

  await clearAuthRateLimit("register", [ip]);

  try {
    await signIn("credentials", {
      username: parsed.data.username,
      password: parsed.data.password,
      redirectTo: "/home",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=Usuario o contraseña incorrectos.");
    }

    throw error;
  }
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/login",
  });
}
