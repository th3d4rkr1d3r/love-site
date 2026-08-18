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

const LETTER_CONTENT = `Meu amor,

Eu queria aproveitar esse espaço para te agradecer.

Obrigado por ter entrado na minha vida e por tudo que você trouxe para os meus dias desde que nos conhecemos. Em tão pouco tempo, vivemos tantas coisas, criamos tantas memórias e compartilhamos momentos que já se tornaram muito importantes para mim.

Obrigado por cada conversa, cada risada, cada abraço, cada beijo, cada carinho e até pelas nossas brincadeiras e nossas besteiras. Obrigado por me ouvir, por cuidar de mim e por me permitir fazer parte da sua vida também.

Eu sou muito grato por ter te conhecido e por tudo que estamos construindo juntos. Espero que a gente continue vivendo muitos momentos assim, conhecendo lugares novos, realizando nossos planos, comemorando nossas conquistas e estando um ao lado do outro também nos dias difíceis.

Eu desejo que nunca falte amor, respeito, cumplicidade e felicidade entre nós. Que a gente continue escolhendo um ao outro todos os dias e que, quando olharmos para trás, possamos perceber o quanto de história construímos juntos.

Você se tornou alguém muito especial para mim, muito mais rápido do que eu poderia imaginar.

Obrigado por tudo, meu amor.

Que a nossa história continue sendo cheia de momentos que valham a pena guardar para sempre.

Eu te amo. ❤️

Com todo meu amor,
Gabriel`;

async function main() {
  const couple = await prisma.couple.upsert({
    where: { slug: "gabriel-stefani" },
    update: {
      nameA: "Gabriel",
      nameB: "Stefani",
      relationshipStart: atSaoPaulo("2026-07-20"),
      theme: "dark-vinho-dourado",
      accentColor: "#6B1420",
      goldColor: "#C9A24B",
      isPublic: true,
      enabledSections,
      quizResultMessages,
      wrappedHighlights,
    },
    create: {
      nameA: "Gabriel",
      nameB: "Stefani",
      relationshipStart: atSaoPaulo("2026-07-20"),
      theme: "dark-vinho-dourado",
      accentColor: "#6B1420",
      goldColor: "#C9A24B",
      isPublic: true,
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
        title: "💬 Onde tudo começou",
        description: null,
        date: atSaoPaulo("2026-07-20"),
        category: "inicio",
        sortOrder: 0,
      },
      {
        coupleId: couple.id,
        title: "❤️ Primeiro encontro + primeiro beijo",
        description: null,
        date: atSaoPaulo("2026-07-31"),
        category: "encontro",
        sortOrder: 1,
      },
      {
        coupleId: couple.id,
        title: "❤️ Segundo encontro",
        description: null,
        date: atSaoPaulo("2026-08-02"),
        category: "encontro",
        sortOrder: 2,
      },
      {
        coupleId: couple.id,
        title: "🔥 Primeira noite juntos",
        description: null,
        date: atSaoPaulo("2026-08-08"),
        category: "intimidade",
        sortOrder: 3,
      },
      {
        coupleId: couple.id,
        title: "👨‍👩‍👧 Conheci sua família",
        description: null,
        date: atSaoPaulo("2026-08-14"),
        category: "familia",
        sortOrder: 4,
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
        content: LETTER_CONTENT,
      },
    });
  } else {
    await prisma.letter.create({
      data: {
        coupleId: couple.id,
        title: "Uma carta para você",
        content: LETTER_CONTENT,
      },
    });
  }

  await prisma.photo.deleteMany({ where: { coupleId: couple.id } });
  await prisma.photo.createMany({
    data: [
      {
        coupleId: couple.id,
        url: "/uploads/01-noite.jpg",
        alt: "Gabriel e Stefani",
        sortOrder: 0,
        mediaType: "image",
      },
      {
        coupleId: couple.id,
        url: "/uploads/02-flipper.jpg",
        alt: "Gabriel e Stefani no Flipper",
        date: new Date("2026-08-07T20:57:00-03:00"),
        sortOrder: 1,
        mediaType: "image",
      },
      {
        coupleId: couple.id,
        url: "/uploads/03-praca.jpg",
        alt: "Gabriel e Stefani",
        sortOrder: 2,
        mediaType: "image",
      },
    ],
  });

  const songData = {
    title: "Pra Sempre Com Você",
    artist: "Jorge & Mateus",
    url: "/uploads/pra-sempre-com-voce.mp3",
    provider: "file",
    coverUrl: "/uploads/pra-sempre-com-voce-cover.png",
    note: null as string | null,
    sortOrder: 0,
  };

  const existingSong = await prisma.song.findFirst({
    where: { coupleId: couple.id },
  });

  if (existingSong) {
    await prisma.song.update({
      where: { id: existingSong.id },
      data: songData,
    });
  } else {
    await prisma.song.create({
      data: { coupleId: couple.id, ...songData },
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

  console.log("Seed concluído: Gabriel & Stefani, 5 memórias, 3 fotos, Itajaí (label público).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
