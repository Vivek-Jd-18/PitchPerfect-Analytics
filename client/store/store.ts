import { configureStore } from '@reduxToolkit'; // Assuming they are using @reduxjs/toolkit in package.json, using standard import
import { configureStore as rtkConfigureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import rosterFilterReducer from './slices/rosterFilterSlice';

export const store = rtkConfigureStore({
  reducer: {
    auth: authReducer,
    rosterFilter: rosterFilterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
