import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService.ts';
import type { Movie } from '../../types/movie.ts';
import SearchBar from '../SearchBar/SearchBar.tsx';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';

function App() {
    const [query, setQuery] = useState<string | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['movies', query],
        queryFn: () => fetchMovies(query!),
        enabled: query !== null
    });

    const handleSubmit = (query: string) => {
        setSelectedMovie(null);
        
        setQuery(query);
    }

    useEffect(() => {
        if (data?.length === 0) {
            toast.error('No movies found for your request.');
        }
    }, [data]);

        return (
            <>
                <SearchBar onSubmit={handleSubmit} />

                {isError && <ErrorMessage />}

                {isSuccess && <MovieGrid movies={data} onSelect={setSelectedMovie} />}

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