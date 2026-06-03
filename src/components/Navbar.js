import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/authSlice";

function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    function handleLogout() {
        dispatch(logout());
        navigate("/");
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">Movies App</Link>
            <div className="navbar-links">
                {token ? (
                    <>
                        <Link to="/favorites">Favorites</Link>
                        <Link to="/add-movie">Add Movie</Link>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
