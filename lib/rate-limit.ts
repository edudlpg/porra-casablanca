import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";

type AuthAction = "login" | "register";

type RateLimitPolicy = {
  maxAttempts: number;
  windowMs: number;
  blockMs: number;
};

const RATE_LIMIT_POLICIES: Record<AuthAction, RateLimitPolicy> = {
  login: {
    maxAttempts: 5,
    windowMs: 10 * 60 * 1000,
    blockMs: 15 * 60 * 1000,
  },
  register: {
    maxAttempts: 3,
    windowMs: 30 * 60 * 1000,
    blockMs: 30 * 60 * 1000,
  },
};

function normalizeKeyPart(value: string) {
  return value.trim().toLowerCase().slice(0, 120);
}

export async function getRequestIp() {
  const requestHeaders = await headers();

  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip")?.trim() ||
    requestHeaders.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

async function getNormalizedBucket(action: AuthAction, key: string, now: Date) {
  const bucket = await prisma.authRateLimit.findUnique({
    where: {
      action_key: {
        action,
        key,
      },
    },
  });

  if (!bucket) {
    return prisma.authRateLimit.create({
      data: {
        action,
        key,
        attempts: 0,
        windowStart: now,
      },
    });
  }

  if (now.getTime() - bucket.windowStart.getTime() >= RATE_LIMIT_POLICIES[action].windowMs) {
    return prisma.authRateLimit.update({
      where: { id: bucket.id },
      data: {
        attempts: 0,
        windowStart: now,
        blockedUntil: null,
      },
    });
  }

  return bucket;
}

export async function assertAuthRateLimit(action: AuthAction, keyParts: string[]) {
  const now = new Date();
  const key = keyParts.map(normalizeKeyPart).join(":");
  const bucket = await getNormalizedBucket(action, key, now);

  if (bucket.blockedUntil && bucket.blockedUntil.getTime() > now.getTime()) {
    return {
      allowed: false,
      retryAfterMs: bucket.blockedUntil.getTime() - now.getTime(),
    };
  }

  return {
    allowed: true,
    retryAfterMs: 0,
  };
}

export async function registerAuthFailure(action: AuthAction, keyParts: string[]) {
  const now = new Date();
  const key = keyParts.map(normalizeKeyPart).join(":");
  const policy = RATE_LIMIT_POLICIES[action];
  const bucket = await getNormalizedBucket(action, key, now);
  const attempts = bucket.attempts + 1;
  const blockedUntil =
    attempts >= policy.maxAttempts ? new Date(now.getTime() + policy.blockMs) : null;

  await prisma.authRateLimit.update({
    where: { id: bucket.id },
    data: {
      attempts,
      blockedUntil,
    },
  });

  return {
    attempts,
    blockedUntil,
  };
}

export async function clearAuthRateLimit(action: AuthAction, keyParts: string[]) {
  const key = keyParts.map(normalizeKeyPart).join(":");

  await prisma.authRateLimit.deleteMany({
    where: {
      action,
      key,
    },
  });
}
