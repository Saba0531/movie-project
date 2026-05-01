import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { setAllMovies, setLoading, setError } from "../slices/moviesSlice";

const PER_PAGE = 10;

function MainPage() {
    const dispatch = useDispatch();
    const { allMovies, loading, error } = useSelector((state) => state.movies);

    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);

    async function fetchAllMovies() {
            dispatch(setLoading(true));
            dispatch(setError(null));
            try {
                const first = await axios.get("https://warrior.ge/api/movies", { params: { page: 1 } });
                const lastPage = first.data.last_page;
                const movies = [...first.data.data];

                const requests = [];
                for (let i = 2; i <= lastPage; i++) {
                    requests.push(axios.get("https://warrior.ge/api/movies", { params: { page: i } }));
                }

                const responses = await Promise.all(requests);
                responses.forEach((res) => {
                    movies.push(...res.data.data);
                });

                dispatch(setAllMovies(movies));
            } catch (err) {
                dispatch(setError("Failed to load movies."));
            } finally {
                dispatch(setLoading(false));
            }
        }

    useEffect(() => {
        fetchAllMovies();
    }, [dispatch]);

    const genres = [...new Set(allMovies.map((m) => m.genre).filter(Boolean))].sort();

    let filtered = allMovies.filter((m) => {
        const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
        const matchGenre = genre === "" || m.genre === genre;
        return matchSearch && matchGenre;
    });

    if (sort === "newest") filtered = [...filtered].sort((a, b) => b.year - a.year);
    if (sort === "oldest") filtered = [...filtered].sort((a, b) => a.year - b.year);
    if (sort === "title_asc") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "title_desc") filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div>
            <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="search-input"
            />

            <div className="filter-row">
                <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }} className="filter-select">
                    <option value="">All genres</option>
                    {genres.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>

                <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="filter-select">
                    <option value="">Sort by...</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title_asc">Title A-Z</option>
                    <option value="title_desc">Title Z-A</option>
                </select>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="movie-list">
                {paginated.map((movie) => (
                    <Link to={`/movies/${movie.id}`} key={movie.id} className="movie-card">
                        <div className="movie-card-header">
                            <h2>{movie.title}</h2>
                            <span className="movie-year">{movie.year}</span>
                        </div>
                        {movie.genre && <span className="movie-genre">{movie.genre}</span>}
                        {movie.description && <p>{movie.description}</p>}
                    </Link>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button className="page-btn" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
                    <span className="page-info">Page {page} of {totalPages}</span>
                    <button className="page-btn" onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
                </div>
            )}
        </div>
    );
}

export default MainPage;
