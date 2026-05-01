import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { setToken, setError, setLoading } from "../slices/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, loading, error } = useSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (token) navigate("/");
    }, [token, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const res = await axios.post("https://warrior.ge/api/login", { email, password });
            dispatch(setToken(res.data.token));
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div className="form-page">
            <h1>Login</h1>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
}

export default Login;
