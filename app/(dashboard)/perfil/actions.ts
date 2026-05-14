"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

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

  if (avatar.size > MAX_AVATAR_SIZE) {
    redirect("/perfil?error=La foto no puede superar los 2 MB.");
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
