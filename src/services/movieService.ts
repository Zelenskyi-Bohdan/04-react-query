import axios from 'axios';
import type { Movie } from '../types/movie.ts';

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (
  request: string
): Promise<Movie[]> => {
  const response = await axios.get<MovieResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query: request,
        include_adult: false,
        language: 'en-US',
        page: 1,
        },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  }
    }
  );

  return response.data.results;
};