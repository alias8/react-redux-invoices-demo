import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IInvoice } from '../../server/serverData.js';

interface InvoicesState {
  invoices: IInvoice[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoicesState = {
  invoices: [],
  loading: false,
  error: null,
};

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setInvoices: (state, action: PayloadAction<IInvoice[]>) => {
      state.invoices = action.payload;
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

export const { setInvoices, setLoading, setError } = invoicesSlice.actions;
export default invoicesSlice.reducer;
