import { useState } from 'react';
import toast from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService.ts';
import type { Movie } from '../../types/movie.ts';
import SearchBar from '../SearchBar/SearchBar.tsx';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';

function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleSubmit = async (query: string) => {
        setIsLoading(true);
        setIsError(false);
        setSelectedMovie(null);


        try {
            const moviesData = await fetchMovies(query);

            if (moviesData.length === 0) {
                toast.error('No movies found for your request.');
            }
            setMovies(moviesData);
        } catch {
            setIsError(true);
            setMovies([]);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <SearchBar onSubmit={handleSubmit} />
            {isError ?
                <ErrorMessage /> :
                <MovieGrid movies={movies} onSelect={setSelectedMovie} />
            }
            {isLoading && <Loader />}
            {selectedMovie && (
                <MovieModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </>
    );
}

export default App;
