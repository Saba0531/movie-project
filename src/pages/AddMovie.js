import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addMovieToList } from "../slices/moviesSlice";

const GENRES = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller", "Western"];

function AddMovie() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [year, setYear] = useState("");
    const [genre, setGenre] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post(
                "https://warrior.ge/api/movies",
                { title, description, year: parseInt(year), genre },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            dispatch(addMovieToList(res.data.data || res.data));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="form-page">
            <h1>Add Movie</h1>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
                </div>
                <div className="form-group">
                    <label>Year</label>
                    <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Genre</label>
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
                        <option value="">Select a genre...</option>
                        {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Adding..." : "Add Movie"}
                </button>
            </form>
        </div>
    );
}

export default AddMovie;
