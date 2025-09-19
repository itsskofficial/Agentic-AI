import { auth } from "@clerk/nextjs/server";
import { RateLimiterPrisma } from "rate-limiter-flexible";
import prisma from "./db";

const freePoints = 5;
const proPoints = 100;
const generationCost = 1;
const duration = 30 * 24 * 60 * 60; // 30 days

export async function getUsageTracker() {
  const { has } = await auth();
  const hasProAccess = await has({ plan: "pro" });

  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: hasProAccess ? proPoints : freePoints,
    duration,
  });

  return usageTracker;
}

export async function consumeCredits() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, generationCost);
  return result;
}

export async function getUsageStatus() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
}