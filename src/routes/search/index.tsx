import { component$, $, useSignal, useStore } from "@builder.io/qwik";
import "./index.css";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(() => {
	const nav = useNavigate();
  const searchTerm = useSignal("");
  const movies = useStore<Movie[]>([]);
  const isLoading = useSignal(false);
  const error = useSignal("");

  const findMovies = $(async () => {
    if (!searchTerm.value.trim()) {
      error.value = "Please enter a search term";
      return;
    }

    isLoading.value = true;
    error.value = "";
    
    try {
	const response = await fetch(`${import.meta.env.PUBLIC_OMDB_API_ENDPOINT}/?apikey=${import.meta.env.PUBLIC_OMDB_API_KEY}&s=${encodeURIComponent(searchTerm.value)}&type=movie`);
      const data = await response.json();

      if (data.Response === "True") {
        movies.splice(0, movies.length, ...data.Search);
      } else {
        error.value = data.Error || "No movies found";
        movies.splice(0, movies.length);
      }
    } catch (err) {
      error.value = "An error occurred while fetching movies";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <>
      <div id="search">
        <input 
          type="text" 
          placeholder="Search for movies" 
          value={searchTerm.value}
          // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
          onInput$={(e) => searchTerm.value = (e.target as HTMLInputElement).value}
        />
        <button type="button" onClick$={findMovies}>
          Search
        </button>
      </div>

      {isLoading.value && <p>Loading...</p>}
      {error.value && <p class="error">{error.value}</p>}

      <div id="results">
        {movies.map((movie) => (
          <div key={movie.imdbID} class="movie-card" onClick$={(event) => { event.preventDefault(); nav(`/watch/${movie.imdbID}`); }}>
            <img src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150x200?text=No+Poster"} alt={`${movie.Title} poster`}width="300" height="450"
			/>
            <div class="movie-info">
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
});
