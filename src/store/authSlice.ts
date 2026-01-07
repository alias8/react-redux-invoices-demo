import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    id: string | null;
    loggedIn: boolean;
    username: string | null;
    error: Error | null;
    meta: object;
}

const loadAuthFromStorage = (): AuthState => {
    try {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
            return JSON.parse(savedAuth);
        }
    } catch (error) {
        console.error('Failed to load auth from localStorage:', error);
    }
    return {
        id: null,
        loggedIn: false,
        username: null,
        error: null,
        meta: {}
    };
};

const initialState: AuthState = loadAuthFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ id: string; username: string }>) => {
      state.loggedIn = true;
      state.username = action.payload.username;
      state.id = action.payload.id;
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.loggedIn = false;
      state.username = null;
      state.id = null;
      localStorage.removeItem('auth');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;