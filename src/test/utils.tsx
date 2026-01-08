import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
  configureStore,
  PreloadedState,
  EnhancedStore,
} from '@reduxjs/toolkit';
import authReducer from '../store/authSlice';
import accountsReducer from '../store/accountsSlice';
import customersReducer from '../store/customersSlice';
import invoicesReducer from '../store/invoicesSlice';
import usersReducer from '../store/usersSlice';
import { RootState } from '../store/store';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: EnhancedStore<RootState>;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        accounts: accountsReducer,
        customers: customersReducer,
        invoices: invoicesReducer,
        users: usersReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
