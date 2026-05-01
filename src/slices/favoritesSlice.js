import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    favorites: [],
    loading: false,
    error: null,
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        setFavorites(state, action) {
            state.favorites = action.payload;
        },
        addFavoriteToList(state, action) {
            state.favorites.push(action.payload);
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
    },
});

export const { setFavorites, addFavoriteToList, setLoading, setError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
