import { z } from "zod";

const datetimeField = z
  .string()
  .trim()
  .min(1, "La fecha es obligatoria.")
  .transform((value) => new Date(value))
  .refine((value) => !Number.isNaN(value.getTime()), "La fecha no es válida.");

const scoreField = z.coerce
  .number()
  .int("Debe ser un número entero.")
  .min(0, "No puede ser negativo.")
  .max(20, "Parece un marcador poco realista.");

const usernameField = z
  .string()
  .trim()
  .min(2, "El usuario debe tener al menos 2 caracteres.")
  .max(30, "El usuario no puede superar los 30 caracteres.")
  .regex(/^[\p{L}\p{N}._-]+$/u, "El usuario solo puede contener letras, números, puntos, guiones y guiones bajos.");

const passwordField = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres.")
  .max(100, "La contraseña no puede superar los 100 caracteres.");

const nameField = z.string().trim().min(2, "El nombre es obligatorio.").max(80, "El nombre es demasiado largo.");

const teamNameField = z
  .string()
  .trim()
  .min(2, "El nombre de equipo debe tener al menos 2 caracteres.")
  .max(40, "El nombre de equipo no puede superar los 40 caracteres.")
  .regex(
    /^[\p{L}\p{N} ._-]+$/u,
    "El nombre de equipo solo puede contener letras, números, espacios, puntos, guiones y guiones bajos.",
  );

const shortTextField = z.string().trim().max(100, "El texto es demasiado largo.").optional().or(z.literal(""));

const secureUrlField = z
  .string()
  .trim()
  .url("La URL debe ser válida.")
  .max(500, "La URL es demasiado larga.")
  .refine((value) => value.startsWith("https://") || value.startsWith("http://"), {
    message: "La URL debe empezar por http:// o https://.",
  });

const broadcastField = z.enum(["DAZN", "RTVE"]).default("DAZN");

export const loginSchema = z.object({
  username: usernameField,
  password: passwordField,
});

export const registerSchema = loginSchema;

export const roundSchema = z
  .object({
    id: z.string().cuid().optional(),
    name: nameField.max(60, "El nombre de la jornada no puede superar los 60 caracteres."),
    unlockAt: datetimeField,
    startDate: datetimeField,
    endDate: datetimeField,
  })
  .refine((data) => data.startDate >= data.unlockAt, {
    message: "La apertura no puede ser posterior al inicio de la fase.",
    path: ["unlockAt"],
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "La fecha final debe ser posterior a la inicial.",
    path: ["endDate"],
  });

export const appConfigSchema = z.object({
  entryFee: z.coerce
    .number()
    .int("La participación debe ser un número entero.")
    .min(0, "La participación no puede ser negativa.")
    .max(100000, "La participación es demasiado alta."),
});

export const profileTeamNameSchema = z.object({
  teamName: teamNameField,
});

export const adminPasswordResetSchema = z.object({
  userId: z.string().cuid("El usuario es obligatorio."),
  password: passwordField,
});

export const adminUserDeleteSchema = z.object({
  userId: z.string().cuid("El usuario es obligatorio."),
});

export const teamSchema = z.object({
  id: z.string().cuid().optional(),
  name: nameField,
  flagUrl: secureUrlField.optional().or(z.literal("")),
});

export const matchSchema = z.object({
  id: z.string().cuid().optional(),
  roundId: z.string().cuid("La jornada es obligatoria."),
  homeTeamId: z.string().cuid("El equipo local es obligatorio."),
  awayTeamId: z.string().cuid("El equipo visitante es obligatorio."),
  venueName: shortTextField,
  venueCity: shortTextField,
  startsAt: datetimeField,
  broadcast: broadcastField,
  isLocked: z
    .union([z.literal("on"), z.literal("true"), z.literal("false"), z.undefined()])
    .transform((value) => value === "on" || value === "true"),
});

export const resultSchema = z.object({
  matchId: z.string().cuid("El partido es obligatorio."),
  homeScore: scoreField,
  awayScore: scoreField,
  winnerTeamId: z.string().cuid().optional().or(z.literal("")).transform((value) => value || null),
  broadcast: broadcastField,
  isLocked: z
    .union([z.literal("on"), z.literal("true"), z.literal("false"), z.undefined()])
    .transform((value) => value === "on" || value === "true"),
});

export const predictionSchema = z.object({
  matchId: z.string().cuid("El partido es obligatorio."),
  predictedHomeScore: scoreField,
  predictedAwayScore: scoreField,
});

export function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries());
}
