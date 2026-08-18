import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { EnabledSections, QuizResultMessage, WrappedHighlights } from "../lib/types";

const prisma = new PrismaClient();

const enabledSections: EnabledSections = {
  historia: true,
  galeria: true,
  lugares: false,
  musica: true,
  carta: true,
  quiz: false,
  jogo: false,
  wrapped: false,
};

const quizResultMessages: QuizResultMessage[] = [
  { min: 0, max: 4, message: "Ainda estamos no começo… vai ter replay." },
  { min: 5, max: 7, message: "Tá indo bem, hein." },
  { min: 8, max: 9, message: "Quase lá — você presta atenção." },
  { min: 10, max: 10, message: "Você estava lá, né?" },
];

const wrappedHighlights: WrappedHighlights = {
  favoritePlaceName: null,
  favoritePhotoId: null,
};

/** Centro de Itajaí/SC — nunca as coordenadas da rua. */
const ITAJAI_CITY = {
  latitude: -26.9078,
  longitude: -48.6619,
};

function atSaoPaulo(isoDate: string) {
  return new Date(`${isoDate}T12:00:00-03:00`);
}

async function main() {
  const couple = await prisma.couple.upsert({
    where: { slug: "gabriel-stefani" },
    update: {
      nameA: "Gabriel",
      nameB: "Stefani",
      relationshipStart: atSaoPaulo("2026-07-31"),
      theme: "dark-vinho-dourado",
      accentColor: "#6B1420",
      goldColor: "#C9A24B",
      isPublic: false,
      enabledSections,
      quizResultMessages,
      wrappedHighlights,
    },
    create: {
      nameA: "Gabriel",
      nameB: "Stefani",
      relationshipStart: atSaoPaulo("2026-07-31"),
      theme: "dark-vinho-dourado",
      accentColor: "#6B1420",
      goldColor: "#C9A24B",
      isPublic: false,
      slug: "gabriel-stefani",
      enabledSections,
      quizResultMessages,
      wrappedHighlights,
    },
  });

  const firstPlace = await prisma.place.upsert({
    where: { id: "seed-place-itajai" },
    update: {
      coupleId: couple.id,
      name: "Itajaí, SC",
      description: "Onde tudo começou.",
      address: "Rua Camboriú, 894, Itajaí/SC",
      latitude: ITAJAI_CITY.latitude,
      longitude: ITAJAI_CITY.longitude,
      isPrivate: false,
      sortOrder: 0,
    },
    create: {
      id: "seed-place-itajai",
      coupleId: couple.id,
      name: "Itajaí, SC",
      description: "Onde tudo começou.",
      address: "Rua Camboriú, 894, Itajaí/SC",
      latitude: ITAJAI_CITY.latitude,
      longitude: ITAJAI_CITY.longitude,
      isPrivate: false,
      sortOrder: 0,
    },
  });

  await prisma.memory.deleteMany({ where: { coupleId: couple.id } });

  await prisma.memory.createMany({
    data: [
      {
        coupleId: couple.id,
        title: "❤️ Primeiro encontro",
        description:
          "Gabriel foi buscar Stefani. Depois ela disse que tinha sido incrível.",
        date: atSaoPaulo("2026-07-31"),
        category: "encontro",
        placeId: firstPlace.id,
        sortOrder: 0,
      },
      {
        coupleId: couple.id,
        title: "💋 Primeiro beijo",
        description: "Aconteceu ainda no primeiro encontro.",
        date: atSaoPaulo("2026-07-31"),
        category: "beijo",
        placeId: firstPlace.id,
        sortOrder: 1,
      },
      {
        coupleId: couple.id,
        title: "❤️ Segundo encontro",
        description:
          "Foi até a madrugada. Foi quando ela declarou estar muito apaixonada.",
        date: atSaoPaulo("2026-08-02"),
        category: "encontro",
        sortOrder: 2,
      },
      {
        coupleId: couple.id,
        title: "💐 Primeiro buquê",
        description: 'Ela chamou o buquê de "maravilhoso".',
        date: atSaoPaulo("2026-08-03"),
        category: "presente",
        sortOrder: 3,
      },
      {
        coupleId: couple.id,
        title: "🎁 The Blend",
        description:
          "Ela deu de presente o perfume The Blend, como um mês de namoro adiantado.",
        date: atSaoPaulo("2026-08-07"),
        category: "presente",
        sortOrder: 4,
      },
      {
        coupleId: couple.id,
        title: "🔥 Nossa primeira noite juntos",
        description: "Um marco importante na nossa intimidade.",
        date: atSaoPaulo("2026-08-08"),
        category: "intimidade",
        sortOrder: 5,
      },
      {
        coupleId: couple.id,
        title: "👨‍👩‍👧‍👦 Apresentação à família",
        description: "Stefani apresentou Gabriel à família dela.",
        date: atSaoPaulo("2026-08-16"),
        category: "familia",
        sortOrder: 6,
      },
      {
        coupleId: couple.id,
        title: "💌 A grande declaração",
        description: "O dia em que Gabriel se declarou de verdade para Stefani.",
        date: atSaoPaulo("2026-08-18"),
        category: "declaracao",
        sortOrder: 7,
      },
    ],
  });

  const existingLetter = await prisma.letter.findFirst({
    where: { coupleId: couple.id },
  });

  if (existingLetter) {
    await prisma.letter.update({
      where: { id: existingLetter.id },
      data: {
        title: "Uma carta para você",
        content:
          "O texto desta carta ainda vai ser escrito com calma. Até lá, isto é só um placeholder.",
      },
    });
  } else {
    await prisma.letter.create({
      data: {
        coupleId: couple.id,
        title: "Uma carta para você",
        content:
          "O texto desta carta ainda vai ser escrito com calma. Até lá, isto é só um placeholder.",
      },
    });
  }

  const existingSong = await prisma.song.findFirst({
    where: { coupleId: couple.id },
  });

  if (!existingSong) {
    await prisma.song.create({
      data: {
        coupleId: couple.id,
        title: "A definir",
        artist: "A definir",
        url: "",
        provider: "file",
        note: "A música específica ainda será escolhida com a Stefani.",
        sortOrder: 0,
      },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { passwordHash, coupleId: couple.id },
      create: { email: adminEmail, passwordHash, coupleId: couple.id },
    });
    console.log(`Admin seed: ${adminEmail}`);
  } else {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD ausentes — AdminUser não foi criado.");
  }

  console.log("Seed concluído: Gabriel & Stefani, 8 memórias, Itajaí (label público).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
