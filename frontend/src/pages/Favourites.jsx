import "../css/Favourites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function Favourites() {
  const { favourites } = useMovieContext();
  if (Array.isArray(favourites) && favourites.length > 0) {
    return (
      <div className="favourites">
        <h2>Your Favourites</h2>
        <div className="movies-grid">
          {favourites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favourites-empty" style={{ marginTop: "30vh" }}>
      <h2>No Favourites yet?</h2>
      <p>Start adding to favourites!</p>
    </div>
  );
}

export default Favourites;
