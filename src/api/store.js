import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { metaBullApi } from './game-app';
import { walletSlice } from '@/reducers/walletSlice';

export const store = configureStore({
    reducer: {
        [metaBullApi.reducerPath]: metaBullApi.reducer,
        wallet: walletSlice.reducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(metaBullApi.middleware),
});

setupListeners(store.dispatch);
