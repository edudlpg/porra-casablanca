"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { formDataToObject, registerSchema } from "@/lib/validations";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: "/home",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?error=Usuario o contraseña incorrectos.");
    }

    throw error;
  }
}

export async function registerAction(formData: FormData) {
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
    redirect("/register?error=Ya existe una cuenta con ese usuario.");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.username,
      username: parsed.data.username,
      email: null,
      passwordHash,
    },
  });

  try {
    await signIn("credentials", {
      username: parsed.data.username,
      password: parsed.data.password,
      redirectTo: "/home",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?success=Cuenta creada. Inicia sesión.");
    }

    throw error;
  }
}

export async function logoutAction() {
  await signOut({
    redirectTo: "/login",
  });
}
