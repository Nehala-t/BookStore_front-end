import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import api from "../../lib/api";

// =====================================================
// TYPES
// =====================================================

export interface SellerBook {
  _id: string;
  title: string;
  description?: string;
  price: number;
  discountPrice?: number;
  category?: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  publicationDate?: string;
  pages?: number;
  language?: string;
  stock: number;
  status?: string;
  isDeleted?: boolean;
  images?: string[];
}

// =====================================================
// SELLER ORDER TYPES
// =====================================================

export interface SellerOrderItem {
  _id?: string;

  bookId:
    | string
    | {
        _id: string;
        title?: string;
        images?: string[];
        sellerId?: string;
        category?: string;
        author?: string;
      };

  quantity: number;
  price: number;
  orderStatus?: string;
}

export interface SellerOrder {
  _id: string;

  userId?:
    | string
    | {
        _id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
      };

  products: SellerOrderItem[];

  orderStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

// =====================================================
// ORDER STATUS TYPE
// =====================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

// =====================================================
// SELLER STATE
// =====================================================

interface SellerState {
  books: SellerBook[];
  orders: SellerOrder[];

  booksLoading: boolean;
  ordersLoading: boolean;

  booksError: string | null;
  ordersError: string | null;

  successMessage: string | null;
}

const initialState: SellerState = {
  books: [],
  orders: [],

  booksLoading: false,
  ordersLoading: false,

  booksError: null,
  ordersError: null,

  successMessage: null,
};

// =====================================================
// GET SELLER BOOKS
// =====================================================

export const fetchSellerBooks = createAsyncThunk<
  SellerBook[],
  { search?: string } | void,
  { rejectValue: string }
>(
  "seller/fetchSellerBooks",

  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/inventory/getSellerInventory",
        {
          params: {
            search: params?.search || "",
          },
        }
      );

      const data = response.data?.data ?? [];

      return data.map((item: any) => {
        if (
          item.bookId &&
          typeof item.bookId === "object"
        ) {
          return {
            ...item.bookId,

            stock:
              item.stock ??
              item.bookId.stock ??
              0,
          };
        }

        return item;
      });
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch seller books"
      );
    }
  }
);

// =====================================================
// GET SELLER ORDERS
// =====================================================

export const fetchSellerOrders = createAsyncThunk<
  SellerOrder[],
  void,
  { rejectValue: string }
>(
  "seller/fetchSellerOrders",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/order/sellerOrders"
      );

      return response.data?.data ?? [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch seller orders"
      );
    }
  }
);

// =====================================================
// UPDATE SELLER ORDER STATUS
// =====================================================

export const updateSellerOrderStatus =
  createAsyncThunk<
    SellerOrder,
    {
      orderId: string;
      bookId: string;
      orderStatus: OrderStatus;
    },
    { rejectValue: string }
  >(
    "seller/updateSellerOrderStatus",

    async (
      {
        orderId,
        bookId,
        orderStatus,
      },
      { rejectWithValue }
    ) => {
      try {
        const response = await api.patch(
          `/order/updateOrderStatus/${orderId}`,
          {
            bookId,
            orderStatus,
          }
        );

        return response.data.data;
      } catch (error: any) {
        console.error(
          "UPDATE ORDER STATUS ERROR:",
          error.response?.data
        );

        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update order status"
        );
      }
    }
  );

// =====================================================
// ADD SELLER BOOK
// =====================================================

export const addSellerBook = createAsyncThunk<
  SellerBook,
  FormData,
  { rejectValue: string }
>(
  "seller/addSellerBook",

  async (
    formData,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/book/addBook",
        formData
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to add book"
      );
    }
  }
);

// =====================================================
// EDIT SELLER BOOK
// =====================================================

export const editSellerBook = createAsyncThunk<
  SellerBook,
  {
    id: string;
    formData: FormData;
  },
  { rejectValue: string }
>(
  "seller/editSellerBook",

  async (
    {
      id,
      formData,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `/book/editBook/${id}`,
        formData
      );

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update book"
      );
    }
  }
);

// =====================================================
// DELETE SELLER BOOK
// =====================================================

export const deleteSellerBook = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "seller/deleteSellerBook",

  async (
    id,
    { rejectWithValue }
  ) => {
    try {
      await api.delete(
        `/book/deleteBook/${id}`
      );

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete book"
      );
    }
  }
);

// =====================================================
// SELLER SLICE
// =====================================================

const sellerSlice = createSlice({
  name: "seller",

  initialState,

  reducers: {
    clearSellerMessages: (state) => {
      state.successMessage = null;
      state.booksError = null;
      state.ordersError = null;
    },
  },

  extraReducers: (builder) => {
    // =================================================
    // FETCH SELLER BOOKS
    // =================================================

    builder
      .addCase(
        fetchSellerBooks.pending,
        (state) => {
          state.booksLoading = true;
          state.booksError = null;
        }
      )

      .addCase(
        fetchSellerBooks.fulfilled,
        (state, action) => {
          state.booksLoading = false;
          state.books = action.payload;
        }
      )

      .addCase(
        fetchSellerBooks.rejected,
        (state, action) => {
          state.booksLoading = false;

          state.booksError =
            action.payload ||
            "Failed to fetch books";
        }
      );

    // =================================================
    // FETCH SELLER ORDERS
    // =================================================

    builder
      .addCase(
        fetchSellerOrders.pending,
        (state) => {
          state.ordersLoading = true;
          state.ordersError = null;
        }
      )

      .addCase(
        fetchSellerOrders.fulfilled,
        (state, action) => {
          state.ordersLoading = false;
          state.orders = action.payload;
        }
      )

      .addCase(
        fetchSellerOrders.rejected,
        (state, action) => {
          state.ordersLoading = false;

          state.ordersError =
            action.payload ||
            "Failed to fetch orders";
        }
      );

    // =================================================
    // UPDATE SELLER ORDER STATUS
    // =================================================

    builder
      .addCase(
        updateSellerOrderStatus.pending,
        (state) => {
          state.ordersError = null;
          state.successMessage = null;
        }
      )

      .addCase(
        updateSellerOrderStatus.fulfilled,
        (state, action) => {
          const updatedOrder =
            action.payload;

          const orderIndex =
            state.orders.findIndex(
              (order) =>
                order._id ===
                updatedOrder._id
            );

          if (orderIndex !== -1) {
            state.orders[orderIndex] =
              updatedOrder;
          }

          state.successMessage =
            "Order status updated successfully";
        }
      )

      .addCase(
        updateSellerOrderStatus.rejected,
        (state, action) => {
          state.ordersError =
            action.payload ||
            "Failed to update order status";
        }
      );

    // =================================================
    // ADD SELLER BOOK
    // =================================================

    builder
      .addCase(
        addSellerBook.pending,
        (state) => {
          state.booksLoading = true;
          state.booksError = null;
          state.successMessage = null;
        }
      )

      .addCase(
        addSellerBook.fulfilled,
        (state, action) => {
          state.booksLoading = false;

          state.books.unshift(
            action.payload
          );

          state.successMessage =
            "Book added successfully";
        }
      )

      .addCase(
        addSellerBook.rejected,
        (state, action) => {
          state.booksLoading = false;

          state.booksError =
            action.payload ||
            "Failed to add book";
        }
      );

    // =================================================
    // EDIT SELLER BOOK
    // =================================================

    builder
      .addCase(
        editSellerBook.pending,
        (state) => {
          state.booksLoading = true;
          state.booksError = null;
          state.successMessage = null;
        }
      )

      .addCase(
        editSellerBook.fulfilled,
        (state, action) => {
          state.booksLoading = false;

          const index =
            state.books.findIndex(
              (book) =>
                book._id ===
                action.payload._id
            );

          if (index !== -1) {
            state.books[index] =
              action.payload;
          }

          state.successMessage =
            "Book updated successfully";
        }
      )

      .addCase(
        editSellerBook.rejected,
        (state, action) => {
          state.booksLoading = false;

          state.booksError =
            action.payload ||
            "Failed to update book";
        }
      );

    // =================================================
    // DELETE SELLER BOOK
    // =================================================

    builder
      .addCase(
        deleteSellerBook.pending,
        (state) => {
          state.booksLoading = true;
          state.booksError = null;
          state.successMessage = null;
        }
      )

      .addCase(
        deleteSellerBook.fulfilled,
        (state, action) => {
          state.booksLoading = false;

          state.books =
            state.books.filter(
              (book) =>
                book._id !==
                action.payload
            );

          state.successMessage =
            "Book deleted successfully";
        }
      )

      .addCase(
        deleteSellerBook.rejected,
        (state, action) => {
          state.booksLoading = false;

          state.booksError =
            action.payload ||
            "Failed to delete book";
        }
      );
  },
});

// =====================================================
// EXPORTS
// =====================================================

export const {
  clearSellerMessages,
} = sellerSlice.actions;

export default sellerSlice.reducer;
