"use client";

import { useRef, useState } from "react";

import { SubmitButton } from "@/components/layout/submit-button";

type AvatarUploadFormProps = {
  action: (formData: FormData) => void;
};

const INITIAL_MAX_DIMENSION = 384;
const MIN_DIMENSION = 128;
const TARGET_MAX_BYTES = 220 * 1024;
const MIN_QUALITY = 0.42;

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

async function renderAvatarBlob(image: HTMLImageElement, maxDimension: number, quality: number) {
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
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

  return canvasToBlob(canvas, quality);
}

async function compressAvatar(file: File) {
  if (file.type === "image/svg+xml") {
    throw new Error("Formato no permitido.");
  }

  const image = await loadImage(file);

  let maxDimension = INITIAL_MAX_DIMENSION;
  let quality = 0.82;
  let blob = await renderAvatarBlob(image, maxDimension, quality);

  while (blob.size > TARGET_MAX_BYTES && (quality > MIN_QUALITY || maxDimension > MIN_DIMENSION)) {
    if (quality > MIN_QUALITY) {
      quality = Math.max(MIN_QUALITY, quality - 0.08);
    } else {
      maxDimension = Math.max(MIN_DIMENSION, Math.round(maxDimension * 0.82));
      quality = 0.76;
    }

    blob = await renderAvatarBlob(image, maxDimension, quality);
  }

  return new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "avatar"}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export function AvatarUploadForm({ action }: AvatarUploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasOptimizedFile, setHasOptimizedFile] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setStatusMessage(null);
      setHasOptimizedFile(false);
      return;
    }

    try {
      setIsProcessing(true);
      setHasOptimizedFile(false);
      setStatusMessage("Optimizando foto...");
      const compressedFile = await compressAvatar(file);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(compressedFile);

      if (inputRef.current) {
        inputRef.current.files = dataTransfer.files;
      }

      setStatusMessage("Foto lista para subir.");
      setHasOptimizedFile(true);
    } catch {
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setHasOptimizedFile(false);
      setStatusMessage("No se pudo optimizar esta foto. Prueba con JPG, PNG o WEBP.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <form
      action={action}
      className="space-y-3"
      onSubmit={(event) => {
        if (isProcessing || !hasOptimizedFile) {
          event.preventDefault();
          setStatusMessage("Espera a que la foto termine de optimizarse.");
        }
      }}
    >
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
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700"
        />
        {statusMessage ? <p className="text-xs text-slate-500">{statusMessage}</p> : null}
      </div>
      <SubmitButton size="sm" pendingLabel="Subiendo..." disabled={isProcessing || !hasOptimizedFile}>
        Guardar foto
      </SubmitButton>
    </form>
  );
}
