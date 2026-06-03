import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetail from "./pages/MovieDetail";
import AddMovie from "./pages/AddMovie";
import Favorite from "./pages/Favorite";

function App() {
    const token = useSelector((state) => state.auth.token);

    return (
        <BrowserRouter>
            <div className="container">
                <Navbar />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/movies/:id" element={<MovieDetail />} />
                    <Route path="/add-movie" element={token ? <AddMovie /> : <Navigate to="/login" />} />
                    <Route path="/favorites" element={token ? <Favorite /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
