import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAccount } from '../../server/serverData.js';

interface AccountsState {
  accounts: IAccount[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  accounts: [],
  loading: false,
  error: null,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<IAccount[]>) => {
      state.accounts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAccounts, setLoading, setError } = accountsSlice.actions;
export default accountsSlice.reducer;
