import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  email: string;
  password: string;
  isAuthenticated: boolean;
  user: {
    email: string;
  } | null;
}

const initialState: AuthState = {
  email: '',
  password: '',
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    login: (state) => {
      state.isAuthenticated = true;
      state.user = { email: state.email };
      state.password = '';
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.email = '';
      state.password = '';
    },
  },
});

export const { setEmail, setPassword, login, logout } = authSlice.actions;
export default authSlice.reducer;