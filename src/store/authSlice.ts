import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  username: string;
  password: string;
  isAuthenticated: boolean;
  user: {
    id: string;
    username: string;
  } | null;
}

const initialState: AuthState = {
  username: '',
  password: '',
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    login: (state, action: PayloadAction<{ id: string; username: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.password = '';
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.username = '';
      state.password = '';
    },
  },
});

export const { setUsername, setPassword, login, logout } = authSlice.actions;
export default authSlice.reducer;