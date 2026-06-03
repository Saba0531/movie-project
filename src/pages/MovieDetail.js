import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSelectedMovie, setComments, addCommentToList } from "../slices/moviesSlice";
import { addFavoriteToList } from "../slices/favoritesSlice";

function MovieDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { selectedMovie: movie, comments } = useSelector((state) => state.movies);
    const token = useSelector((state) => state.auth.token);

    const [content, setContent] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [favoriteMsg, setFavoriteMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [movieRes, commentsRes] = await Promise.all([
                    axios.get(`https://warrior.ge/api/movies/${id}`),
                    axios.get(`https://warrior.ge/api/movies/${id}/comments`),
                ]);
                dispatch(setSelectedMovie(movieRes.data.data || movieRes.data));
                dispatch(setComments(commentsRes.data.data || commentsRes.data));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id, dispatch]);

    async function handleAddFavorite() {
        try {
            const res = await axios.post(
                "https://warrior.ge/api/favorites",
                { movie_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch(addFavoriteToList(res.data.data || res.data));
            setFavoriteMsg("Added to favorites.");
        } catch (err) {
            setFavoriteMsg(err.response?.data?.message || "Failed to add to favorites.");
        }
    }

    async function handleCommentSubmit(e) {
        e.preventDefault();
        if (!content.trim()) return;
        setCommentError(null);
        try {
            const res = await axios.post(
                `https://warrior.ge/api/movies/${id}/comments`,
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch(addCommentToList(res.data.data || res.data));
            setContent("");
        } catch (err) {
            setCommentError(err.response?.data?.message || "Failed to post comment.");
        }
    }

    if (loading) return <p>Loading...</p>;
    if (!movie) return <p>Movie not found.</p>;

    return (
        <div className="movie-detail">
            <h1>{movie.title}</h1>
            {movie.year && <p className="movie-meta">Year: {movie.year}</p>}
            {movie.genre && <p className="movie-meta">Genre: {movie.genre}</p>}
            {movie.description && <p className="movie-description">{movie.description}</p>}

            {token && (
                <div style={{ marginBottom: "40px" }}>
                    <button onClick={handleAddFavorite} className="submit-btn">Add to Favorites</button>
                    {favoriteMsg && <p className="success-text">{favoriteMsg}</p>}
                </div>
            )}

            <div className="comments-section">
                <h2>Comments</h2>

                {token && (
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <textarea
                            placeholder="Write a comment..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={3}
                        />
                        {commentError && <p className="error-text">{commentError}</p>}
                        <button type="submit" className="submit-btn">Post Comment</button>
                    </form>
                )}

                {comments.length === 0 ? (
                    <p>No comments yet.</p>
                ) : (
                    <div className="comments-list">
                        {comments.map((comment, index) => (
                            <div key={comment.id || index} className="comment-card">
                                <p className="comment-author">{comment.user?.name}</p>
                                <p>{comment.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieDetail;
