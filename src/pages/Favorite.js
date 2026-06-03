import { useEffect,} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { setFavorites, setLoading, setError } from "../slices/favoritesSlice";

function Favorite() {
    const dispatch = useDispatch();
    const { favorites, loading, error } = useSelector((state) => state.favorites);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        async function fetchFavorites() {
            dispatch(setLoading(true));
            dispatch(setError(null));
            try {
                const res = await axios.get("https://warrior.ge/api/favorites", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                dispatch(setFavorites(res.data.data || res.data));
            } catch (err) {
                dispatch(setError(err.response?.data?.message || "Failed to load favorites."));
            } finally {
                dispatch(setLoading(false));
            }
        }

        fetchFavorites();
    }, [dispatch, token]);

    const seen = new Set();
    const unique = favorites.filter((item) => {
        const movie = item.movie || item;
        if (seen.has(movie.id)) return false;
        seen.add(movie.id);
        return true;
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-text">{error}</p>;
    if (favorites.length === 0) return <p>You have no favorites yet.</p>;

    return (
        <div>
            <h1>My Favorites</h1>
            <div className="movie-list">
                {unique.map((item) => {
                    const movie = item.movie || item;
                    return (
                        <Link to={`/movies/${movie.id}`} key={movie.id} className="movie-card">
                            <div className="movie-card-header">
                                <h2>{movie.title}</h2>
                                <span className="movie-year">{movie.year}</span>
                            </div>
                            {movie.genre && <span className="movie-genre">{movie.genre}</span>}
                            {movie.description && <p>{movie.description}</p>}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Favorite;
