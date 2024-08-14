export interface Movie {
  title: string;
  tmdb: string;
  imdb: string | null;
  year: string;
  quality: string;
  version: string;
  poster: string;
  link: string;
}

export interface ApiResponse {
  result: {
    items: Movie[];
    "total movies": number;
    totalPages: number;
  };
}