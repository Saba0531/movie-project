import { createSlice } from "@reduxjs/toolkit";

const initialState = {
        allMovies: [],
        selectedMovie: null,
        comments: [],
        loading: false,
        error: null,
    }

const moviesSlice = createSlice({
    name: "movies",
    initialState,
    reducers: {
        setAllMovies(state, action) {
            state.allMovies = action.payload;
        },
        addMovieToList(state, action) {
            state.allMovies.unshift(action.payload);
        },
        setSelectedMovie(state, action) {
            state.selectedMovie = action.payload;
        },
        setComments(state, action) {
            state.comments = action.payload;
        },
        addCommentToList(state, action) {
            state.comments.push(action.payload);
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const {
    setAllMovies,
    addMovieToList,
    setSelectedMovie,
    setComments,
    addCommentToList,
    setLoading,
    setError,
} = moviesSlice.actions;

export default moviesSlice.reducer;
