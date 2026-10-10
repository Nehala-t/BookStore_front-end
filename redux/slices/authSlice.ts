import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import axios from "axios";

import api from "../../lib/api";

// =========================
// Types
// =========================

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "seller";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  _id?: string;

  firstName?: string;

  lastName?: string;

  email?: string;

  role?:
    | "user"
    | "seller"
    | "admin";

  status?:
    | "Active"
    | "Blocked";

  accessToken?: string;
}

interface SignupResponse {
  success: boolean;

  message: string;

  data?: AuthUser;
}

interface LoginResponse {
  success: boolean;

  message: string;

  data?: AuthUser;
}

interface AuthState {
  user: AuthUser | null;

  loading: boolean;

  error: string | null;

  successMessage: string | null;
}

// =========================
// Initial State
// =========================

const initialState: AuthState = {
  user: null,

  loading: false,

  error: null,

  successMessage: null,
};

// =========================
// Signup API
// =========================

export const signupUser =
  createAsyncThunk<
    SignupResponse,
    SignupData,
    { rejectValue: string }
  >(
    "auth/signupUser",

    async (
      signupData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.post(
            "/auth/register",
            signupData
          );

        return response.data as SignupResponse;

      } catch (error: any) {
        console.error(
          "SIGNUP API ERROR:",
          error
        );

        console.error(
          "SIGNUP API RESPONSE:",
          error.response?.data
        );

        return rejectWithValue(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    }
  );

// =========================
// Login API
// =========================

export const loginUser =
  createAsyncThunk<
    LoginResponse,
    LoginData,
    { rejectValue: string }
  >(
    "auth/loginUser",

    async (
      loginData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.post(
            "/auth/login",
            loginData
          );

        return response.data as LoginResponse;

      } catch (error: unknown) {
        if (
          axios.isAxiosError(error)
        ) {
          console.error(
            "LOGIN API ERROR:",
            error
          );

          console.error(
            "LOGIN API RESPONSE:",
            error.response?.data
          );

          return rejectWithValue(
            error.response?.data?.message ||
              "Login failed. Please try again."
          );
        }

        console.error(
          "UNKNOWN LOGIN ERROR:",
          error
        );

        return rejectWithValue(
          "Login failed. Please try again."
        );
      }
    }
  );

// =========================
// Auth Slice
// =========================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // =========================
    // Set User
    // =========================

    setUser: (
      state,
      action: PayloadAction<AuthUser>
    ) => {
      state.user = action.payload;
    },

    // =========================
    // Clear Auth Error
    // =========================

    clearAuthError: (
      state
    ) => {
      state.error = null;
    },

    // =========================
    // Clear Success Message
    // =========================

    clearSuccessMessage: (
      state
    ) => {
      state.successMessage = null;
    },

    // =========================
    // Reset Auth State
    // =========================

    resetAuthState: (
      state
    ) => {
      state.loading = false;

      state.error = null;

      state.successMessage = null;
    },

    // =========================
    // Logout
    // =========================

    logout: (
      state
    ) => {
      state.user = null;

      state.error = null;

      state.successMessage = null;

      state.loading = false;
    },
  },

  extraReducers: (
    builder
  ) => {

    // =====================================================
    // SIGNUP
    // =====================================================

    builder.addCase(
      signupUser.pending,
      (state) => {
        state.loading = true;

        state.error = null;

        state.successMessage = null;
      }
    );

    builder.addCase(
      signupUser.fulfilled,
      (
        state,
        action: PayloadAction<SignupResponse>
      ) => {
        state.loading = false;

        state.error = null;

        state.successMessage =
          action.payload.message ||
          "Registration successful";

        // Store the newly registered user
        state.user =
          action.payload.data || null;
      }
    );

    builder.addCase(
      signupUser.rejected,
      (
        state,
        action
      ) => {
        state.loading = false;

        state.successMessage = null;

        state.error =
          action.payload ||
          "Registration failed. Please try again.";
      }
    );

    // =====================================================
    // LOGIN
    // =====================================================

    builder.addCase(
      loginUser.pending,
      (state) => {
        state.loading = true;

        state.error = null;

        state.successMessage = null;
      }
    );

    builder.addCase(
      loginUser.fulfilled,
      (
        state,
        action: PayloadAction<LoginResponse>
      ) => {
        state.loading = false;

        state.error = null;

        state.user =
          action.payload.data || null;

        state.successMessage =
          action.payload.message ||
          "Login successful";
      }
    );

    builder.addCase(
      loginUser.rejected,
      (
        state,
        action
      ) => {
        state.loading = false;

        state.user = null;

        state.successMessage = null;

        state.error =
          action.payload ||
          "Login failed. Please try again.";
      }
    );
  },
});

// =========================
// Export Actions
// =========================

export const {
  setUser,
  clearAuthError,
  clearSuccessMessage,
  resetAuthState,
  logout,
} = authSlice.actions;

// =========================
// Export Reducer
// =========================

export default authSlice.reducer;