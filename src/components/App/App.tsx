import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService.ts';
import type { Movie } from '../../types/movie.ts';
import SearchBar from '../SearchBar/SearchBar.tsx';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Pagination from '../Pagination/Pagination.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';

function App() {
    const [query, setQuery] = useState<string | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, isSuccess } = useQuery({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies(query!, page),
        enabled: query !== null,
        placeholderData: keepPreviousData,
    });

    const handleSubmit = (query: string) => {
        setSelectedMovie(null);
        
        setQuery(query);
    }

    useEffect(() => {
        if (data?.results.length === 0) {
            toast.error('No movies found for your request.');
        }
    }, [data]);

        return (
            <>
                <SearchBar onSubmit={handleSubmit} />

                {isError && <ErrorMessage />}

                {isSuccess &&
                    <>
                        <MovieGrid movies={data.results} onSelect={setSelectedMovie}/>
                        
                    {data.total_pages > 1 &&
                        <Pagination
                          currentPage={page}
                          onPageChange={setPage}
                          totalPages={data.total_pages}
                    />}
                </>
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