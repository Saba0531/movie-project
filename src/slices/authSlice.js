import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    }

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setToken(state, action) {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        setError(state, action) {
            state.error = action.payload;
        },
        logout(state) {
            state.token = null;
            localStorage.removeItem("token");
        },
    },
});

export const { setLoading, setToken, setError, logout } = authSlice.actions;
export default authSlice.reducer;
