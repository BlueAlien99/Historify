import { configureStore } from '@reduxjs/toolkit';
import { stateReducer } from './stateSlice';

export const store = configureStore({
    reducer: {
        state: stateReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['state.history'],
                ignoredActions: ['state/fetchHistoryDetails/fulfilled'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
