import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import accountsReducer from './accountsSlice';
import customersReducer from './customersSlice';
import usersReducer from './usersSlice';
import invoicesReducer from './invoicesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    customers: customersReducer,
    users: usersReducer,
    invoices: invoicesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;