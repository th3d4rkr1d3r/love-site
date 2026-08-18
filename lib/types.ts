export type EnabledSections = {
  historia: boolean;
  galeria: boolean;
  lugares: boolean;
  musica: boolean;
  carta: boolean;
  quiz: boolean;
  jogo: boolean;
  wrapped: boolean;
};

export type QuizResultMessage = {
  min: number;
  max: number;
  message: string;
};

export type WrappedHighlights = {
  favoritePlaceName: string | null;
  favoritePhotoId: string | null;
};

export type SongProvider = "file" | "spotify" | "youtube";

export type MediaType = "image" | "video";
