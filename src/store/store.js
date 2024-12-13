import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  preloadedState: {
    cart: {
      items: [], // 초기 상태 설정
    },
  },
});

export default store;
