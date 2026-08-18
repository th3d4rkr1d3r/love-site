import "server-only";

import { prisma } from "@/lib/prisma";

export async function getCouple() {
  try {
    return await prisma.couple.findFirst({
      where: { slug: "gabriel-stefani" },
    });
  } catch {
    return null;
  }
}
