import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  role: 'ADMIN' | 'FAN' | null;
  userId: string | null;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: !!(typeof window !== 'undefined' && localStorage.getItem('token')),
  role: null,
  userId: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; role: 'ADMIN' | 'FAN'; userId: string }>
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      state.userId = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
