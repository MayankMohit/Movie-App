import MovieCard from "../components/MovieCard";
import { useState, useEffect, useRef } from "react";
import "../css/Home.css";
import { searchMovies, getPopularMovies } from "../services/api";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const bottomRef = useRef(null); // For smooth scrolling after load more

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies(page);
        setMovies(popularMovies);
      } catch (err) {
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;
    setLoading(true);
    setError(null);
    setPage(1);
    try {
      const searchResults = await searchMovies(searchQuery, 1);
      if (searchResults.length === 0) {
        setError("No movies found...");
      }
      setMovies(searchResults);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    if (loading) return; // Prevent multiple clicks

    setLoading(true);
    const nextP = page + 1;
    setPage(nextP); // Increase page number

    try {
      let moreMovies;
      if (searchQuery.length > 0) {
        moreMovies = await searchMovies(searchQuery, nextP);
      } else {
        moreMovies = await getPopularMovies(nextP);
      }

      if (moreMovies.length > 0) {
        const existingIds = new Set(movies.map((movie) => movie.id));
        const newMovies = moreMovies.filter(
          (movie) => !existingIds.has(movie.id)
        );
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
      } else {
        setError("No more movies to load");
      }
    } catch (err) {
      console.log(err);
      setError("Failed to load more movies...");
    } finally {
      setLoading(false);
    }
  };

  // Smooth scroll when movies list changes and it's not the first load
  useEffect(() => {
    if (page > 1 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [movies]);

  return (
    <div className="home" style={{ marginTop: "40px" }}>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for Movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          <span className="text">Search</span>
          <i className="fa fa-search"></i>
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading && page === 1 ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))}
          </div>

          <button
            type="button" // prevents form submit jump
            onClick={loadMoreMovies}
            className={`load-more-button ${loading ? "no-display" : ""}`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>

          <div ref={bottomRef}></div>
        </>
      )}
    </div>
  );
}

export default Home;
