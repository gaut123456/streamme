import { component$, useResource$, Resource, useSignal, $ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import './index.css';
import type { ApiResponse, Movie } from '~/interfaces/featured/movie';

export default component$(() => {
  const page = useSignal(1);
  const nav = useNavigate();
  const moviesResource = useResource$<ApiResponse>(async ({ track }) => {
    track(() => page.value);
    const response = await fetch(`${import.meta.env.PUBLIC_API_ENDPOINT}/movies?order=popular&limit=20&page=${page.value}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    return response.json();
  });

  const goToPage = $((newPage: number, totalPages: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      page.value = newPage;
    }
  });

  return (
    <Resource
      value={moviesResource}
      onPending={() => <div class="loading-spinner" />}
      onRejected={(error) => <div class="error-message">Error: {error.message}</div>}
      onResolved={(data) => (
        <div class="movie-list-container">
          <h1 class="movie-list-title">Popular Movies</h1>
          <p class="movie-list-count">Total movies: {data.result["total movies"]}</p>
          <div class="movie-grid">
            {data.result.items.map((movie: Movie) => (
              <div key={movie.tmdb} class="movie-card-container" onClick$={(event) => { event.preventDefault(); nav(`/watch/${movie.tmdb}`); }}>
                <img src={movie.poster} alt={movie.title} class="movie-poster-container" width="180" height="300" />
                <div class="movie-details-container">
                  <h3 class="movie-title-container">{movie.title} ({movie.year})</h3>
                  <p class="movie-quality-container">Quality: {movie.quality}</p>
                  <p class="movie-version-container">Version: {movie.version}</p>
                </div>
              </div>
            ))}
          </div>
          <div class="pagination-controls">
            <button
              type='button'
              class="pagination-button"
              onClick$={() => goToPage(page.value - 1, data.result.totalPages)}
              disabled={page.value === 1}
            >
              &lt;
            </button>
            <span class="pagination-current">{page.value}</span>
            <button
              type='button'
              class="pagination-button"
              onClick$={() => goToPage(page.value + 1, data.result.totalPages)}
              disabled={page.value === data.result.totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    />
  );
});