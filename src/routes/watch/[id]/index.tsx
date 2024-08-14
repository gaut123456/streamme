import { Resource, component$, useResource$ } from "@builder.io/qwik";
import { useLocation, type DocumentHead } from "@builder.io/qwik-city";
import "./index.css";

export default component$(() => {
  const loc = useLocation();
  const id = loc.params.id;

  const movieResource = useResource$<ApiResponseWatchs>(async () => {
    // Fetch movie details from your API
    const response = await fetch(`${import.meta.env.PUBLIC_API_ENDPOINT}/movies/check?id=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    const data = await response.json();

    // Fetch additional details (rating and description) from OMDB API using movie title
    const omdbResponse = await fetch(`${import.meta.env.PUBLIC_OMDB_API_ENDPOINT}/?apikey=${import.meta.env.PUBLIC_OMDB_API_KEY}&t=${data.result.items[0].title}&type=movie`);
    if (!omdbResponse.ok) {
      throw new Error('Failed to fetch movie details from OMDB');
    }
    const omdbData = await omdbResponse.json();

    // Combine both data sets
    return {
      ...data,
      omdb: {
        rating: omdbData.imdbRating,
        plot: omdbData.Plot,
      },
    };
  });

  return (
    <div class="streamme-container">
      <header class="streamme-header">
        <h1 class="streamme-logo">StreamMe</h1>
      </header>
      <Resource
        value={movieResource}
        onPending={() => <div class="loading-spinner" />}
        onRejected={(error) => (
          <div class="error-message">
            <p>Oops! {error.message}</p>
            <button type="button" class="retry-button">Retry</button>
          </div>
        )}
        onResolved={(data) => (
          <div class="movie-details">
            <div class="movie-poster">
              <div class="image-wrapper">
              <img src={data.result.items[0].poster} alt={data.result.items[0].title} width="780" height="1170" />
              </div>
              <div class="movie-overlay">
                <h2>{data.result.items[0].title}</h2>
                <p class="movie-year">{data.result.items[0].year}</p>
                <p class="movie-quality">{data.result.items[0].quality}</p>
              </div>
            </div>
            <div class="movie-info">
              <h2>{data.result.items[0].title}</h2>
              <p><strong>Year:</strong> {data.result.items[0].year}</p>
              <p><strong>Quality:</strong> {data.result.items[0].quality}</p>
              <p><strong>Version:</strong> {data.result.items[0].version}</p>
              <p><strong>Rating:</strong> {data.omdb.rating} / 10</p>
              <p><strong>Description:</strong> {data.omdb.plot}</p>
              <button type="button" class="play-button" onClick$={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>Play Now</button>
            </div>
            <div class="video-player">
              <iframe
                src={data.result.items[0].link}
                width="100%"
                height="500"
                allowFullscreen
                allow="autoplay; encrypted-media"
                title={`Stream ${data.result.items[0].title}`}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'StreamMe - Modern Streaming Experience',
  meta: [
    {
      name: "description",
      content: "Enjoy high-quality streaming with StreamMe's sleek and modern interface.",
    },
  ],
};
