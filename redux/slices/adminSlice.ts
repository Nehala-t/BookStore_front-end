import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import api from "../../lib/api";

// ==========================================
// TRANSACTION
// ==========================================

export interface Transaction {
  id: string;
  name: string;
  email: string;

  status:
    | "Completed"
    | "Pending"
    | "Failed";

  date: string;
  amount: string;
  initials: string;

  book: string;
  paymentMethod: "COD" | "ONLINE";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed";
}

// ==========================================
// DASHBOARD METRICS
// ==========================================

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  totalBooks: number;
}

// ==========================================
// DASHBOARD RESPONSE
// ==========================================

interface DashboardResponse {
  metrics: DashboardMetrics;
  transactions: Transaction[];
}

// ==========================================
// ADMIN ORDER
// ==========================================

export interface AdminOrder {
  _id: string;

  userId?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  products: {
    _id?: string;

    bookId?: {
      _id: string;
      title?: string;
      author?: string;
      image?: string;
      images?: string[];
    };

    quantity: number;
    price: number;
    orderStatus?: string;
  }[];

  totalAmount: number;

  paymentMethod:
    | "COD"
    | "ONLINE";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed";

  orderStatus:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";

  shippingAddress?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  createdAt: string;
}

// ==========================================
// ADMIN BOOK
// ==========================================

export interface AdminBook {
  _id: string;

  title: string;

  description?: string;

  price: number;

  discountPrice?: number;

  images?: string[];

  image?: string;

  category: string;

  author: string;

  sellerId?: string;

  isbn?: string;

  publisher?: string;

  publicationDate?: string;

  pages?: number;

  language?: string;

  stock: number;

  status?: string;

  isDeleted?: boolean;

  createdAt?: string;

  updatedAt?: string;
}

// ==========================================
// BOOK STATS
// ==========================================

export interface BookStats {
  totalCatalog: number;

  lowStockItems: number;

  outOfStock: number;
}

// ==========================================
// ADMIN BOOKS RESPONSE
// ==========================================

interface AdminBooksResponse {
  books: AdminBook[];

  stats: BookStats;
}

// ==========================================
// ADMIN STATE
// ==========================================

interface AdminState {
  metrics: DashboardMetrics | null;

  transactions: Transaction[];

  // Books
  books: AdminBook[];

  bookStats: BookStats;

  // Orders
  orders: AdminOrder[];

  ordersStatus:
    | "idle"
    | "loading"
    | "succeeded"
    | "failed";

  ordersError: string | null;

  // Dashboard status
  status:
    | "idle"
    | "loading"
    | "succeeded"
    | "failed";

  // Books status
  booksStatus:
    | "idle"
    | "loading"
    | "succeeded"
    | "failed";

  error: string | null;

  booksError: string | null;
}

// ==========================================
// INITIAL STATE
// ==========================================

const initialState: AdminState = {
  metrics: null,

  transactions: [],

  // Books
  books: [],

  bookStats: {
    totalCatalog: 0,

    lowStockItems: 0,

    outOfStock: 0,
  },

  // Orders
  orders: [],

  ordersStatus: "idle",

  ordersError: null,

  // Dashboard
  status: "idle",

  // Books
  booksStatus: "idle",

  error: null,

  booksError: null,
};

// ==========================================
// FETCH DASHBOARD DATA
// ==========================================

export const fetchDashboardData =
  createAsyncThunk<
    DashboardResponse,
    void,
    { rejectValue: string }
  >(
    "admin/fetchDashboardData",

    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get(
          "/admin/dashboard"
        );

        return response.data.data;
      } catch (error: any) {
        console.error(
          "Dashboard API Error:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch dashboard data"
        );
      }
    }
  );

// ==========================================
// FETCH ADMIN BOOKS
// ==========================================

export const fetchAdminBooks =
  createAsyncThunk<
    AdminBooksResponse,
    string,
    { rejectValue: string }
  >(
    "admin/fetchAdminBooks",

    async (search = "", { rejectWithValue }) => {
      try {
        const response = await api.get(
          `/admin/books?search=${encodeURIComponent(
            search
          )}`
        );

        return response.data.data;
      } catch (error: any) {
        console.error(
          "Admin Books API Error:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch books"
        );
      }
    }
  );

// ==========================================
// FETCH ADMIN ORDERS
// ==========================================

export const fetchAdminOrders =
  createAsyncThunk<
    AdminOrder[],
    void,
    { rejectValue: string }
  >(
    "admin/fetchAdminOrders",

    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get(
          "/checkout/adminOrders"
        );

        return response.data.data;
      } catch (error: any) {
        console.error(
          "Admin Orders API Error:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch orders"
        );
      }
    }
  );

// ==========================================
// DELETE ADMIN BOOK
// ==========================================

export const deleteAdminBook =
  createAsyncThunk<
    string,
    string,
    { rejectValue: string }
  >(
    "admin/deleteAdminBook",

    async (bookId, { rejectWithValue }) => {
      try {
        const response = await api.delete(
          `/admin/deleteBook/${bookId}`
        );

        return (
          response.data.data?.bookId ||
          bookId
        );
      } catch (error: any) {
        console.error(
          "Delete Book API Error:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to delete book"
        );
      }
    }
  );

// ==========================================
// ADMIN SLICE
// ==========================================

export const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    clearAdminData: (state) => {
      state.metrics = null;

      state.transactions = [];

      // Clear books
      state.books = [];

      state.bookStats = {
        totalCatalog: 0,

        lowStockItems: 0,

        outOfStock: 0,
      };

      // Clear orders
      state.orders = [];

      state.ordersStatus = "idle";

      state.ordersError = null;

      state.status = "idle";

      state.booksStatus = "idle";

      state.error = null;

      state.booksError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================================
      // DASHBOARD LOADING
      // ======================================

      .addCase(
        fetchDashboardData.pending,
        (state) => {
          state.status = "loading";

          state.error = null;
        }
      )

      // ======================================
      // DASHBOARD SUCCESS
      // ======================================

      .addCase(
        fetchDashboardData.fulfilled,
        (
          state,
          action: PayloadAction<DashboardResponse>
        ) => {
          state.status = "succeeded";

          state.metrics =
            action.payload.metrics;

          state.transactions =
            action.payload.transactions;

          state.error = null;
        }
      )

      // ======================================
      // DASHBOARD ERROR
      // ======================================

      .addCase(
        fetchDashboardData.rejected,
        (state, action) => {
          state.status = "failed";

          state.error =
            action.payload ||
            "Failed to fetch dashboard data";
        }
      )

      // ======================================
      // BOOKS LOADING
      // ======================================

      .addCase(
        fetchAdminBooks.pending,
        (state) => {
          state.booksStatus = "loading";

          state.booksError = null;
        }
      )

      // ======================================
      // BOOKS SUCCESS
      // ======================================

      .addCase(
        fetchAdminBooks.fulfilled,
        (
          state,
          action: PayloadAction<AdminBooksResponse>
        ) => {
          state.booksStatus = "succeeded";

          state.books =
            action.payload.books;

          state.bookStats =
            action.payload.stats;

          state.booksError = null;
        }
      )

      // ======================================
      // BOOKS ERROR
      // ======================================

      .addCase(
        fetchAdminBooks.rejected,
        (state, action) => {
          state.booksStatus = "failed";

          state.booksError =
            action.payload ||
            "Failed to fetch books";
        }
      )

      // ======================================
      // ORDERS LOADING
      // ======================================

      .addCase(
        fetchAdminOrders.pending,
        (state) => {
          state.ordersStatus = "loading";

          state.ordersError = null;
        }
      )

      // ======================================
      // ORDERS SUCCESS
      // ======================================

      .addCase(
        fetchAdminOrders.fulfilled,
        (
          state,
          action: PayloadAction<AdminOrder[]>
        ) => {
          state.ordersStatus = "succeeded";

          state.orders =
            action.payload;

          state.ordersError = null;
        }
      )

      // ======================================
      // ORDERS ERROR
      // ======================================

      .addCase(
        fetchAdminOrders.rejected,
        (state, action) => {
          state.ordersStatus = "failed";

          state.ordersError =
            action.payload ||
            "Failed to fetch orders";
        }
      )

      // ======================================
      // DELETE BOOK SUCCESS
      // ======================================

      .addCase(
        deleteAdminBook.fulfilled,
        (state, action) => {
          state.books =
            state.books.filter(
              (book) =>
                book._id !== action.payload
            );

          state.bookStats.totalCatalog =
            Math.max(
              0,
              state.bookStats.totalCatalog - 1
            );
        }
      );
  },
});

export const {
  clearAdminData,
} = adminSlice.actions;

export default adminSlice.reducer;