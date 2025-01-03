import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import {thunk} from "redux-thunk";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  preloadedState: {
    cart: {
      cartItems: [], // 초기 상태 설정
    },
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
