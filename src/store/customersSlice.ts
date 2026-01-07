import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICustomer } from '../../server/serverData.js';

interface CustomersState {
  customers: ICustomer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<ICustomer[]>) => {
      state.customers = action.payload;
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

export const { setCustomers, setLoading, setError } = customersSlice.actions;
export default customersSlice.reducer;
