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
  // const refe = useRef(null);

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
  const loadMoreMovies = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent loading more if it's already loading

    setLoading(true);
    const nextP = page + 1;
    setPage((prevPage) => nextP); // Increase the page number

    try {
      let moreMovies;
      if (searchQuery.length > 0) {
        moreMovies = await searchMovies(searchQuery, nextP); // Pass the new page number
      } else {
        moreMovies = await getPopularMovies(nextP);
      }
      if (moreMovies.length > 0) {
      const existingIds = new Set(movies.map(movie => movie.id));
      const newMovies = moreMovies.filter(movie => !existingIds.has(movie.id));
        setMovies((prevMovies) => [...prevMovies, ...newMovies]); // Append new movies to the state
        } else {
        setError("No more movies to load"); // Display error if no new movies found
      }
    } catch (err) {
      console.log(err)
      setError("Failed to load more movies...");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (refe.current) {
  //     refe.current.scrollIntoView();
  //   }
  // }, [page])

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
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}
      <button
        onClick={loadMoreMovies}
        className={`load-more-button ${loading ? "no-display" : ""}`}
      >
        {loading ? "Loading..." : "Load More"}
      </button>
      {/* <div ref={refe}></div> */}
    </div>
  );
}

export default Home;
