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

export async function getPublicMemories(coupleId: string) {
  const memories = await prisma.memory.findMany({
    where: { coupleId },
    orderBy: [{ date: "asc" }, { sortOrder: "asc" }],
    include: { place: true },
  });

  return memories.map((memory) => ({
    id: memory.id,
    title: memory.title,
    description: memory.description,
    date: memory.date.toISOString(),
    photoUrl: memory.photoUrl,
    category: memory.category,
    placeName:
      memory.place && !memory.place.isPrivate ? memory.place.name : null,
  }));
}

export async function getPublicPhotos(coupleId: string) {
  const photos = await prisma.photo.findMany({
    where: { coupleId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    include: { place: true },
  });

  return photos.map((photo) => ({
    id: photo.id,
    url: photo.url,
    caption: photo.caption,
    alt: photo.alt,
    date: photo.date?.toISOString() ?? null,
    width: photo.width,
    height: photo.height,
    mediaType: photo.mediaType,
    placeName: photo.place && !photo.place.isPrivate ? photo.place.name : null,
  }));
}

export async function getSongs(coupleId: string) {
  return prisma.song.findMany({
    where: { coupleId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getLetter(coupleId: string) {
  return prisma.letter.findFirst({
    where: { coupleId },
    orderBy: { updatedAt: "desc" },
  });
}
