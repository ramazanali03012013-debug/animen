export interface AnimeSummary {
  id: number;
  slug: string;
  title: string;
  titleEnglish?: string;
  image: string;
  type?: string;
  episodes?: number;
  status?: string;
  score?: number;
  genres?: string[];
  year?: number;
}

export interface AnimeDetail extends AnimeSummary {
  synopsis?: string;
  duration?: string;
  rating?: string;
  aired?: string;
  studios?: string[];
  source?: string;
  trailer?: string;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  filler?: boolean;
  thumbnail?: string;
}

export interface MangaSummary {
  id: string;
  slug: string;
  title: string;
  image: string;
  status?: string;
  genres?: string[];
  year?: number;
  chapters?: number;
}

export interface MangaDetail extends MangaSummary {
  synopsis?: string;
  author?: string;
  demographic?: string;
}

export interface MangaChapter {
  id: string;
  number: string;
  title: string;
  pages?: number;
  publishedAt?: string;
}

export interface MangaPage {
  index: number;
  url: string;
}

export interface SourceDef {
  id: string;
  name: string;
}
