import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    id: string | null;
    loggedIn: boolean;
    username: string | null;
    error: Error | null;
    meta: object;
}

const initialState: AuthState = {
    id: null,
    loggedIn: false,
    username: null,
    error: null,
    meta: {}
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ id: string; username: string }>) => {
      state.loggedIn = true;
      state.username = action.payload.username;
      state.id = action.payload.id;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.username = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;