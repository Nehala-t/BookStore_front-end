import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "seller" | "admin";
  status?: "Active" | "Blocked";
  isDeleted?: boolean;
  createdAt?: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// ==============================
// FETCH USERS
// ==============================

export const fetchUsers = createAsyncThunk<
  User[],
  string,
  { rejectValue: string }
>(
  "users/fetchUsers",

  async (search = "", { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/admin/getAllUsers?search=${encodeURIComponent(search)}`
      );

      console.log(
        "FULL USERS RESPONSE:",
        response.data
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch users"
      );
    }
  }
);

// ==============================
// UPDATE USER STATUS
// ==============================

export const updateUserStatus = createAsyncThunk<
  User,
  {
    userId: string;
    status: "Active" | "Blocked";
  },
  { rejectValue: string }
>(
  "users/updateUserStatus",

  async (
    { userId, status },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/admin/updateUserStatus/${userId}`,
        {
          status,
        }
      );

      console.log(
        "UPDATE USER STATUS RESPONSE:",
        response.data
      );

      return response.data.data;
    } catch (error: any) {
      console.error(
        "UPDATE USER STATUS ERROR:",
        error.response?.data || error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update user status"
      );
    }
  }
);

// ==============================
// SLICE
// ==============================

const userSlice = createSlice({
  name: "users",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==============================
      // FETCH USERS
      // ==============================

      .addCase(
        fetchUsers.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchUsers.fulfilled,
        (state, action) => {
          state.loading = false;
          state.users = action.payload;
        }
      )

      .addCase(
        fetchUsers.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            "Failed to fetch users";
        }
      )

      // ==============================
      // UPDATE STATUS
      // ==============================

      .addCase(
        updateUserStatus.pending,
        (state) => {
          state.error = null;
        }
      )

      .addCase(
        updateUserStatus.fulfilled,
        (state, action) => {
          const updatedUser =
            action.payload;

          const index =
            state.users.findIndex(
              (user) =>
                user._id === updatedUser._id
            );

          if (index !== -1) {
            state.users[index] =
              updatedUser;
          }
        }
      )

      .addCase(
        updateUserStatus.rejected,
        (state, action) => {
          state.error =
            action.payload ||
            "Failed to update user status";
        }
      );
  },
});

export default userSlice.reducer;