import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import toast from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService.ts';
import type { Movie } from '../../types/movie.ts';
import SearchBar from '../SearchBar/SearchBar.tsx';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';
import css from './App.module.css';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

function App() {
    const [query, setQuery] = useState<string>("");
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [page, setPage] = useState(1);

    const { data, isError, isLoading, isSuccess } = useQuery({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies(query!, page),
        enabled: query !== "",
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
                        <ReactPaginate
                          pageCount={data.total_pages}
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={1}
                          onPageChange={({ selected }) => setPage(selected + 1)}
                          forcePage={page  - 1}
                          containerClassName={css.pagination}
                          activeClassName={css.active}
                          nextLabel="→"
                          previousLabel="←"
                        />
                    }
                </>
                }

                {!isSuccess && isLoading && <Loader />}

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