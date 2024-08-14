export interface ApiResponseWatchs {
  omdb: {
    rating: string;
    plot: string;
  };
  result: {
    items: {
      poster: string;
      title: string;
      year: string;
      quality: string;
      version: string;
      link: string;
    }[];
  };
}