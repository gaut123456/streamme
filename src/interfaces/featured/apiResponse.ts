interface ApiResponse {
    status: number;
    result: {
      page: number;
      totalPages: number;
      "movies per page": string;
      "total movies": string;
      items: Movie[];
    };
  }