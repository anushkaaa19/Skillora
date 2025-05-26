import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import courseReducer from './slices/courseSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    courses: courseReducer,
    profile: profileReducer,
  },
});
