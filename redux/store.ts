"use client";

import { configureStore } from "@reduxjs/toolkit";

import authReducer, {
  setUser,
} from "./slices/authSlice";

import bookReducer from "./slices/bookSlice";
import adminReducer from "./slices/adminSlice"
import usersReduser from "./slices/usersSlice"
// import cartReducer from "./slices/cartSlice";
// import wishlistReducer from "./slices/wishlistSlice";
// import orderReducer from "./slices/orderSlice";
import sellerReducer from "./slices/sellerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    admin: adminReducer,
    users: usersReduser,
    seller: sellerReducer,
  },
});

// =========================
// Restore logged-in user
// =========================

if (typeof window !== "undefined") {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (loggedInUser) {
    try {
      const user = JSON.parse(loggedInUser);

      store.dispatch(setUser(user));
    } catch (error) {
      console.error(
        "Failed to restore logged-in user:",
        error
      );

      localStorage.removeItem("loggedInUser");
    }
  }
}

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;