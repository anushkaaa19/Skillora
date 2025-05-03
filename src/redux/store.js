import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import courseReducer from './slices/courseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    courses: courseReducer,
  },
});

// TypeScript type exports would be removed in plain JavaScript
// In JS, you would typically not have these type exports
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;