const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const RESULTS_PER_PAGE = 10;

export const getPopularMovies = async (page = 1) => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&limit=${RESULTS_PER_PAGE}`
  );
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&limit=${RESULTS_PER_PAGE}`
  );
  const data = await response.json();
  return data.results;
};
