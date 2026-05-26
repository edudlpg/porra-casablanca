"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formDataToObject, profileTeamNameSchema } from "@/lib/validations";

const MAX_AVATAR_SIZE = 256 * 1024;
const ALLOWED_AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function saveProfileAvatarAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const avatar = formData.get("avatar");

  if (!(avatar instanceof File) || avatar.size === 0) {
    redirect("/perfil?error=Selecciona una imagen para subir.");
  }

  if (!avatar.type.startsWith("image/")) {
    redirect("/perfil?error=La foto debe ser una imagen válida.");
  }

  if (!ALLOWED_AVATAR_TYPES.has(avatar.type)) {
    redirect("/perfil?error=La foto debe ser JPG, PNG o WEBP.");
  }

  if (avatar.size > MAX_AVATAR_SIZE) {
    redirect("/perfil?error=La foto debe pesar menos de 256 KB tras optimizarse.");
  }

  const buffer = Buffer.from(await avatar.arrayBuffer());
  const avatarUrl = `data:${avatar.type};base64,${buffer.toString("base64")}`;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      avatarUrl,
    },
  });

  revalidatePath("/perfil");
  revalidatePath("/clasificacion");
  redirect("/perfil?success=Foto actualizada.");
}

export async function saveProfileTeamNameAction(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const parsed = profileTeamNameSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    redirect(`/perfil?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Datos inválidos.")}`);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      teamName: parsed.data.teamName,
    },
  });

  revalidatePath("/perfil");
  revalidatePath("/clasificacion");
  redirect("/perfil?success=Nombre de equipo actualizado.");
}
