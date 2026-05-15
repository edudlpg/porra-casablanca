"use client";

import { useRef, useState } from "react";

import { SubmitButton } from "@/components/layout/submit-button";

type AvatarUploadFormProps = {
  action: (formData: FormData) => void;
};

const MAX_DIMENSION = 512;
const TARGET_MAX_BYTES = 350 * 1024;
const MIN_QUALITY = 0.55;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo cargar la imagen."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo comprimir la imagen."));
          return;
        }

        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

async function compressAvatar(file: File) {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("No se pudo procesar la imagen.");
  }

  context.drawImage(image, 0, 0, width, height);

  let quality = 0.86;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > TARGET_MAX_BYTES && quality > MIN_QUALITY) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, quality);
  }

  return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "avatar"}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export function AvatarUploadForm({ action }: AvatarUploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setStatusMessage(null);
      return;
    }

    try {
      setStatusMessage("Optimizando foto...");
      const compressedFile = await compressAvatar(file);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(compressedFile);

      if (inputRef.current) {
        inputRef.current.files = dataTransfer.files;
      }

      setStatusMessage("Foto lista para subir.");
    } catch {
      setStatusMessage("No se pudo optimizar la foto. Se intentará subir la original.");
    }
  }

  return (
    <form action={action} className="space-y-3">
      <div className="space-y-2">
        <label
          htmlFor="avatar"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
        >
          Foto de perfil
        </label>
        <input
          ref={inputRef}
          id="avatar"
          name="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700"
        />
        {statusMessage ? <p className="text-xs text-slate-500">{statusMessage}</p> : null}
      </div>
      <SubmitButton size="sm" pendingLabel="Subiendo...">
        Guardar foto
      </SubmitButton>
    </form>
  );
}
