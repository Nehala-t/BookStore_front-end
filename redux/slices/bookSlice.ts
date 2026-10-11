import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

import api from "../../lib/api";

import { toast } from "react-toastify";

// ======================================================
// BOOK TYPE
// ======================================================

export interface Book {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  image?: string;
  category: string;
  author: string;
  isbn: string;
  publisher?: string;
  publicationDate?: string;
  pages?: number;
  language?: string;
  stock: number;
  status: string;
  isDeleted: boolean;
}

// ======================================================
// PAGINATION TYPE
// ======================================================

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalBooks: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ======================================================
// ALL BOOKS RESPONSE
// ======================================================

interface BooksResponse {
  success: boolean;
  message: string;
  data: Book[];
  pagination: Pagination;
}

// ======================================================
// SINGLE BOOK RESPONSE
// ======================================================

interface SingleBookResponse {
  success: boolean;
  message: string;
  data: Book;
}

// ======================================================
// FETCH BOOK PARAMETERS
// ======================================================

interface FetchBooksParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

// ======================================================
// WISHLIST TYPE
// ======================================================

export interface WishlistResponse {
  success: boolean;
  message: string;
  action?: "added" | "removed";
  data: any;
}

// ======================================================
// CART TYPE
// ======================================================

export interface CartItem {
  _id?: string;
  bookId: Book;
  quantity: number;
}

// ======================================================
// CART RESPONSE
// ======================================================

export interface CartResponse {
  success: boolean;
  message: string;
  data: any;
}


export interface ShippingAddressListResponse {
  success: boolean;
  message: string;
  data: ShippingAddress[];
}

// ======================================================
// SHIPPING ADDRESS TYPE
// ======================================================

export interface ShippingAddress {
  _id: string;
  userId: string;

  firstName: string;
  lastName: string;
  phone: string;

  address: string;
  city: string;
  state: string;
  pincode: string;

  isDefault: boolean;
  isDeleted: boolean;

  createdAt?: string;
  updatedAt?: string;
}

// ======================================================
// SHIPPING ADDRESS RESPONSE
// ======================================================

export interface ShippingAddressResponse {
  success: boolean;
  message: string;
  data: ShippingAddress | ShippingAddress[];
}

// ======================================================
// CHECKOUT ITEM TYPE
// ======================================================

export interface CheckoutItem {
  _id?: string;

  bookId:
    | string
    | {
        _id: string;
        title: string;
        author?: string;
        images?: string[];
      };

  quantity: number;

  price: number;

  orderStatus:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled";

  isDeleted?: boolean;
}

// ======================================================
// CHECKOUT TYPE
// ======================================================

export interface Checkout {
  _id: string;

  userId?: string;

  products: CheckoutItem[];

  totalAmount: number;

  shippingAddress: string | ShippingAddress;

  paymentMethod: string;

  paymentStatus: string;

  orderStatus?: string;

  createdAt?: string;

  updatedAt?: string;
}

// ======================================================
// CHECKOUT RESPONSE
// ======================================================

export interface CheckoutResponse {
  success: boolean;
  message: string;
  data: Checkout | Checkout[];
}

// ======================================================
// BOOK STATE
// ======================================================

interface BookState {
  // Books
  books: Book[];

  selectedBook: Book | null;

  pagination: Pagination | null;

  loading: boolean;

  singleBookLoading: boolean;

  error: string | null;

  // Wishlist
  wishlist: string[];

  wishlistBooks: Book[];

  wishlistLoading: boolean;

  wishlistError: string | null;

  // Cart
  cart: CartItem[];

  cartLoading: boolean;

  cartError: string | null;

  // Shipping Address
  shippingAddresses: ShippingAddress[];

  selectedShippingAddress: ShippingAddress | null;

  shippingAddressLoading: boolean;

  shippingAddressError: string | null;

  // Checkout
  checkout: Checkout[];

  checkoutHistory: Checkout[];

  checkoutLoading: boolean;

  checkoutError: string | null;
}

// ======================================================
// INITIAL STATE
// ======================================================

const initialState: BookState = {
  // Books
  books: [],

  selectedBook: null,

  pagination: null,

  loading: false,

  singleBookLoading: false,

  error: null,

  // Wishlist
  wishlist: [],

  wishlistBooks: [],

  wishlistLoading: false,

  wishlistError: null,

  // Cart
  cart: [],

  cartLoading: false,

  cartError: null,

  // Shipping Address
  shippingAddresses: [],

  selectedShippingAddress: null,

  shippingAddressLoading: false,

  shippingAddressError: null,

  // Checkout
  checkout: [],

  checkoutHistory: [],

  checkoutLoading: false,

  checkoutError: null,
};

// ======================================================
// GET ALL BOOKS
// ======================================================


export const fetchBooks = createAsyncThunk<
  BooksResponse,
  FetchBooksParams | undefined,
  { rejectValue: string }
>(
  "books/fetchBooks",

  async (
    {
      page = 1,
      limit = 8,
      search = "",
      category = "",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        "/book/getAllBooks",
        {
          params: {
            page,
            limit,
            search,
            category,
          },
        }
      );

      return response.data as BooksResponse;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch books";

      toast.error(message);

      return rejectWithValue(message);
    }
  }
);

// ======================================================
// VIEW SINGLE BOOK
// ======================================================

export const viewSingleBook = createAsyncThunk<
  SingleBookResponse,
  string,
  { rejectValue: string }
>(
  "books/viewSingleBook",

  async (
    bookId,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/book/viewSingleBook/${bookId}`
      );

      return response.data as SingleBookResponse;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch book details";

      toast.error(message);

      return rejectWithValue(message);
    }
  }
);

// ======================================================
// ADD / TOGGLE WISHLIST
// ======================================================

export const addWishList = createAsyncThunk<
  WishlistResponse,
  string,
  { rejectValue: string }
>(
  "books/addWishList",

  async (
    bookId,
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        "/wishList/addWishList",
        {
          bookId,
        }
      );

      const data =
        response.data as WishlistResponse;

      if (data.action === "added") {
        toast.success(
          data.message ||
            "Book added to wishlist ❤️"
        );
      } else if (
        data.action === "removed"
      ) {
        toast.info(
          data.message ||
            "Book removed from wishlist"
        );
      } else {
        toast.success(
          data.message ||
            "Wishlist updated successfully"
        );
      }

      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to update wishlist";

      toast.error(message);

      return rejectWithValue(message);
    }
  }
);

// ======================================================
// VIEW WISHLIST
// ======================================================

export const viewWishList =
  createAsyncThunk<
    WishlistResponse,
    void,
    { rejectValue: string }
  >(
    "books/viewWishList",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.get(
            "/wishList/viewWishList"
          );

        return response.data as WishlistResponse;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to fetch wishlist";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// REMOVE WISHLIST
// ======================================================

export const removeWishList =
  createAsyncThunk<
    WishlistResponse,
    string,
    { rejectValue: string }
  >(
    "books/removeWishList",

    async (
      bookId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.delete(
            `/wishList/removeWishList/${bookId}`
          );

        const data =
          response.data as WishlistResponse;

        toast.success(
          data.message ||
            "Book removed from wishlist"
        );

        return data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to remove book from wishlist";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// CLEAR WISHLIST
// ======================================================

export const clearWishList =
  createAsyncThunk<
    WishlistResponse,
    void,
    { rejectValue: string }
  >(
    "books/clearWishList",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.delete(
            "/wishList/clearWishList"
          );

        const data =
          response.data as WishlistResponse;

        toast.success(
          data.message ||
            "Wishlist cleared successfully"
        );

        return data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to clear wishlist";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// ADD BOOK TO CART
// ======================================================

export const addToCart =
  createAsyncThunk<
    CartResponse,
    string,
    { rejectValue: string }
  >(
    "books/addToCart",

    async (
      bookId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.post(
            "/cart/addCart",
            {
              bookId,
            }
          );

        const data =
          response.data as CartResponse;

        toast.success(
          data.message ||
            "Book added to cart"
        );

        return data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to add book to cart";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// VIEW CART
// ======================================================

export const viewCart =
  createAsyncThunk<
    CartResponse,
    void,
    { rejectValue: string }
  >(
    "books/viewCart",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.get(
            "/cart/viewCart"
          );

        return response.data as CartResponse;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to fetch cart";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// UPDATE CART QUANTITY
// ======================================================

export const updateCartQuantity =
  createAsyncThunk<
    CartResponse,
    {
      bookId: string;
      quantity: number;
    },
    { rejectValue: string }
  >(
    "books/updateCartQuantity",

    async (
      { bookId, quantity },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.put(
            `/cart/update/${bookId}`,
            {
              quantity,
            }
          );

        const data =
          response.data as CartResponse;

        toast.success(
          data.message ||
            "Cart quantity updated successfully"
        );

        return data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to update quantity";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// REMOVE BOOK FROM CART
// ======================================================

export const removeFromCart =
  createAsyncThunk<
    CartResponse,
    string,
    { rejectValue: string }
  >(
    "books/removeFromCart",

    async (
      bookId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.delete(
            `/cart/remove/${bookId}`
          );

        const data =
          response.data as CartResponse;

        toast.success(
          data.message ||
            "Book removed from cart"
        );

        return data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to remove book from cart";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// CLEAR CART
// ======================================================

export const clearCart =
  createAsyncThunk<
    CartResponse,
    void,
    { rejectValue: string }
  >(
    "books/clearCart",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.delete(
            "/cart/clear"
          );

        const data =
          response.data as CartResponse;

        toast.success(
          data.message ||
            "Cart cleared successfully"
        );

        return data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to clear cart";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// ADD SHIPPING ADDRESS
// ======================================================

export const addShippingAddress =
  createAsyncThunk<
    ShippingAddressResponse,
    {
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      isDefault?: boolean;
    },
    { rejectValue: string }
  >(
    "books/addShippingAddress",

    async (
      addressData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.post(
            "/shippingAddress/addAddress",
            addressData
          );

        const data =
          response.data as ShippingAddressResponse;

        toast.success(
          data.message ||
            "Shipping address added successfully"
        );

        return data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to add shipping address";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// VIEW ALL SHIPPING ADDRESSES
// ======================================================

export const viewShippingAddresses = createAsyncThunk<
  ShippingAddressListResponse,
  void,
  { rejectValue: string }
>(
  "books/viewShippingAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        "/shippingAddress/viewAddresses"
      );

      return response.data as ShippingAddressListResponse;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch shipping addresses";

      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// ======================================================
// VIEW SINGLE SHIPPING ADDRESS
// ======================================================

export const viewShippingAddress =
  createAsyncThunk<
    ShippingAddressResponse,
    string,
    { rejectValue: string }
  >(
    "books/viewShippingAddress",

    async (
      addressId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.get(
            `/shippingAddress/viewAddress/${addressId}`
          );

        return response.data as ShippingAddressResponse;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to fetch shipping address";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// UPDATE SHIPPING ADDRESS
// ======================================================

export const updateShippingAddress =
  createAsyncThunk<
    ShippingAddressResponse,
    {
      addressId: string;
      data: {
        firstName?: string;
        lastName?: string;
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        pincode?: string;
        isDefault?: boolean;
      };
    },
    { rejectValue: string }
  >(
    "books/updateShippingAddress",

    async (
      { addressId, data: addressData },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.put(
            `/shippingAddress/updateAddress/${addressId}`,
            addressData
          );

        const result =
          response.data as ShippingAddressResponse;

        toast.success(
          result.message ||
            "Shipping address updated successfully"
        );

        return result;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to update shipping address";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// SET DEFAULT SHIPPING ADDRESS
// ======================================================

export const setDefaultShippingAddress =
  createAsyncThunk<
    ShippingAddressResponse,
    string,
    { rejectValue: string }
  >(
    "books/setDefaultShippingAddress",

    async (
      addressId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.put(
            `/shippingAddress/setDefault/${addressId}`
          );

        const data =
          response.data as ShippingAddressResponse;

        toast.success(
          data.message ||
            "Default address updated successfully"
        );

        return data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to set default address";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// DELETE SHIPPING ADDRESS
// ======================================================

export const deleteShippingAddress =
  createAsyncThunk<
    ShippingAddressResponse,
    string,
    { rejectValue: string }
  >(
    "books/deleteShippingAddress",

    async (
      addressId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.delete(
            `/shippingAddress/deleteAddress/${addressId}`
          );

        const data =
          response.data as ShippingAddressResponse;

        toast.success(
          data.message ||
            "Shipping address deleted successfully"
        );

        return data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to delete shipping address";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// CREATE CHECKOUT
// ======================================================

export const createCheckout =
  createAsyncThunk<
    CheckoutResponse,
    {
      shippingAddressId: string;
      paymentMethod: string;
    },
    { rejectValue: string }
  >(
    "books/createCheckout",

    async (
      {
        shippingAddressId,
        paymentMethod,
      },
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.post(
            "/checkout/createCheckout",
            {
              shippingAddressId,
              paymentMethod,
            }
          );

        const data =
          response.data as CheckoutResponse;

        toast.success(
          data.message ||
            "Checkout created successfully"
        );

        return data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to create checkout";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

  
 // ======================================================
 // CANCEL INDIVIDUAL BOOK ORDER
 // ======================================================

export const cancelOrderItem = createAsyncThunk<
  CheckoutResponse,
  {
    orderId: string;
    itemId: string;
  },
  { rejectValue: string }
>(
  "books/cancelOrderItem",
  async ({ orderId, itemId }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/order/cancelOrderItem/${orderId}/${itemId}`
      );

      const data = response.data as CheckoutResponse;

      toast.success(
        data.message || "Book order cancelled successfully"
      );

      return data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to cancel book order";

      toast.error(message);

      return rejectWithValue(message);
    }
  }
);

// ======================================================
// VIEW CHECKOUT / ORDER HISTORY
// ======================================================

export const viewCheckout =
  createAsyncThunk<
    Checkout[],
    void,
    { rejectValue: string }
  >(
    "books/viewCheckout",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await api.get(
            "/checkout/viewCheckout"
          );

        return response.data.data as Checkout[];
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          "Failed to fetch checkout";

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );

// ======================================================
// BOOK SLICE
// ======================================================

const bookSlice = createSlice({
  name: "books",

  initialState,

  reducers: {
    // ==================================================
    // CLEAR ALL BOOKS
    // ==================================================

    clearBooks: (state) => {
      state.books = [];

      state.pagination = null;

      state.error = null;
    },

    // ==================================================
    // CLEAR SINGLE BOOK
    // ==================================================

    clearSelectedBook: (state) => {
      state.selectedBook = null;

      state.error = null;
    },

    // ==================================================
    // CLEAR WISHLIST
    // ==================================================

    clearWishlist: (state) => {
      state.wishlist = [];

      state.wishlistBooks = [];

      state.wishlistError = null;
    },

    // ==================================================
    // CLEAR CHECKOUT
    // ==================================================

    clearCheckout: (state) => {
      state.checkout = [];

      state.checkoutHistory = [];

      state.checkoutError = null;
    },

    // ==================================================
    // CLEAR SHIPPING ADDRESS
    // ==================================================

    clearSelectedShippingAddress: (state) => {
      state.selectedShippingAddress = null;

      state.shippingAddressError = null;
    },
  },

  // ======================================================
  // EXTRA REDUCERS
  // ======================================================

  extraReducers: (builder) => {
    builder

      // ==================================================
      // FETCH BOOKS
      // ==================================================

      .addCase(
        fetchBooks.pending,

        (state) => {
          state.loading = true;

          state.error = null;
        }
      )

      .addCase(
        fetchBooks.fulfilled,

        (
          state,
          action: PayloadAction<BooksResponse>
        ) => {
          state.loading = false;

          state.books =
            action.payload.data;

          state.pagination =
            action.payload.pagination;
        }
      )

      .addCase(
        fetchBooks.rejected,

        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch books";
        }
      )

      // ==================================================
      // SINGLE BOOK
      // ==================================================

      .addCase(
        viewSingleBook.pending,

        (state) => {
          state.singleBookLoading =
            true;

          state.error = null;

          state.selectedBook = null;
        }
      )

      .addCase(
        viewSingleBook.fulfilled,

        (
          state,
          action: PayloadAction<SingleBookResponse>
        ) => {
          state.singleBookLoading =
            false;

          state.selectedBook =
            action.payload.data;
        }
      )

      .addCase(
        viewSingleBook.rejected,

        (state, action) => {
          state.singleBookLoading =
            false;

          state.error =
            action.payload ||
            "Failed to fetch book details";
        }
      )

      // ==================================================
      // ADD / TOGGLE WISHLIST
      // ==================================================

      .addCase(
        addWishList.pending,

        (state) => {
          state.wishlistLoading =
            true;

          state.wishlistError = null;
        }
      )

      .addCase(
        addWishList.fulfilled,

        (state, action) => {
          state.wishlistLoading =
            false;

          state.wishlistError = null;

          const bookId =
            action.meta.arg;

          // BOOK ADDED
          if (
            action.payload.action ===
            "added"
          ) {
            if (
              !state.wishlist.includes(
                bookId
              )
            ) {
              state.wishlist.push(
                bookId
              );
            }

            const existingBook =
              state.books.find(
                (book) =>
                  book._id === bookId
              );

            if (
              existingBook &&
              !state.wishlistBooks.some(
                (book) =>
                  book._id === bookId
              )
            ) {
              state.wishlistBooks.push(
                existingBook
              );
            }
          }

          // BOOK REMOVED
          if (
            action.payload.action ===
            "removed"
          ) {
            state.wishlist =
              state.wishlist.filter(
                (id) =>
                  id !== bookId
              );

            state.wishlistBooks =
              state.wishlistBooks.filter(
                (book) =>
                  book._id !== bookId
              );
          }
        }
      )

      .addCase(
        addWishList.rejected,

        (state, action) => {
          state.wishlistLoading =
            false;

          state.wishlistError =
            action.payload ||
            "Failed to update wishlist";
        }
      )

      // ==================================================
      // VIEW WISHLIST
      // ==================================================

      .addCase(
        viewWishList.pending,

        (state) => {
          state.wishlistLoading =
            true;

          state.wishlistError = null;
        }
      )

      .addCase(
        viewWishList.fulfilled,

        (
          state,
          action: PayloadAction<WishlistResponse>
        ) => {
          state.wishlistLoading =
            false;

          state.wishlistError = null;

          const wishlistData =
            action.payload.data;

          if (
            !wishlistData ||
            !Array.isArray(
              wishlistData
            ) ||
            wishlistData.length === 0
          ) {
            state.wishlist = [];

            state.wishlistBooks = [];

            return;
          }

          const wishlistDocument =
            wishlistData[0];

          const wishlistItems =
            wishlistDocument?.books ||
            [];

          const activeItems =
            wishlistItems.filter(
              (item: any) =>
                !item.isDeleted &&
                item.bookId
            );

          state.wishlistBooks =
            activeItems.map(
              (item: any) =>
                item.bookId
            );

          state.wishlist =
            state.wishlistBooks.map(
              (book) =>
                book._id
            );
        }
      )

      .addCase(
        viewWishList.rejected,

        (state, action) => {
          state.wishlistLoading =
            false;

          state.wishlistError =
            action.payload ||
            "Failed to fetch wishlist";
        }
      )

      // ==================================================
      // REMOVE WISHLIST
      // ==================================================

      .addCase(
        removeWishList.pending,

        (state) => {
          state.wishlistLoading =
            true;

          state.wishlistError = null;
        }
      )

      .addCase(
        removeWishList.fulfilled,

        (state, action) => {
          state.wishlistLoading =
            false;

          state.wishlistError = null;

          const bookId =
            action.meta.arg;

          state.wishlist =
            state.wishlist.filter(
              (id) =>
                id !== bookId
            );

          state.wishlistBooks =
            state.wishlistBooks.filter(
              (book) =>
                book._id !== bookId
            );
        }
      )

      .addCase(
        removeWishList.rejected,

        (state, action) => {
          state.wishlistLoading =
            false;

          state.wishlistError =
            action.payload ||
            "Failed to remove book from wishlist";
        }
      )

      // ==================================================
      // CLEAR WISHLIST
      // ==================================================

      .addCase(
        clearWishList.pending,

        (state) => {
          state.wishlistLoading =
            true;

          state.wishlistError = null;
        }
      )

      .addCase(
        clearWishList.fulfilled,

        (state) => {
          state.wishlistLoading =
            false;

          state.wishlistError = null;

          state.wishlist = [];

          state.wishlistBooks = [];
        }
      )

      .addCase(
        clearWishList.rejected,

        (state, action) => {
          state.wishlistLoading =
            false;

          state.wishlistError =
            action.payload ||
            "Failed to clear wishlist";
        }
      )

      // ==================================================
      // ADD TO CART
      // ==================================================

      .addCase(
        addToCart.pending,

        (state) => {
          state.cartLoading = true;

          state.cartError = null;
        }
      )

      .addCase(
        addToCart.fulfilled,

        (
          state,
          action: PayloadAction<CartResponse>
        ) => {
          state.cartLoading = false;

          state.cartError = null;

          const cartItem =
            action.payload.data;

          if (
            cartItem &&
            cartItem.bookId
          ) {
            const bookId =
              typeof cartItem.bookId ===
              "string"
                ? cartItem.bookId
                : cartItem.bookId._id;

            const existingIndex =
              state.cart.findIndex(
                (item) =>
                  item.bookId?._id ===
                  bookId
              );

            if (
              existingIndex !== -1
            ) {
              state.cart[
                existingIndex
              ] = cartItem;
            } else {
              state.cart.push(
                cartItem
              );
            }
          }
        }
      )

      .addCase(
        addToCart.rejected,

        (state, action) => {
          state.cartLoading = false;

          state.cartError =
            action.payload ||
            "Failed to add book to cart";
        }
      )

      // ==================================================
      // VIEW CART
      // ==================================================

      .addCase(
        viewCart.pending,

        (state) => {
          state.cartLoading = true;

          state.cartError = null;
        }
      )

      .addCase(
        viewCart.fulfilled,

        (
          state,
          action: PayloadAction<CartResponse>
        ) => {
          state.cartLoading = false;

          state.cartError = null;

          if (
            Array.isArray(
              action.payload.data
            )
          ) {
            state.cart =
              action.payload.data;
          } else {
            state.cart = [];
          }
        }
      )

      .addCase(
        viewCart.rejected,

        (state, action) => {
          state.cartLoading = false;

          state.cartError =
            action.payload ||
            "Failed to fetch cart";
        }
      )

      // ==================================================
      // UPDATE CART QUANTITY
      // ==================================================

      .addCase(
        updateCartQuantity.pending,

        (state) => {
          state.cartLoading = true;

          state.cartError = null;
        }
      )

      .addCase(
        updateCartQuantity.fulfilled,

        (
          state,
          action: PayloadAction<CartResponse>
        ) => {
          state.cartLoading = false;

          state.cartError = null;

          const updatedItem =
            action.payload.data;

          if (
            updatedItem &&
            updatedItem.bookId
          ) {
            const bookId =
              typeof updatedItem.bookId ===
              "string"
                ? updatedItem.bookId
                : updatedItem.bookId._id;

            const index =
              state.cart.findIndex(
                (item) =>
                  item.bookId?._id ===
                  bookId
              );

            if (index !== -1) {
              state.cart[
                index
              ].quantity =
                updatedItem.quantity;
            }
          }
        }
      )

      .addCase(
        updateCartQuantity.rejected,

        (state, action) => {
          state.cartLoading = false;

          state.cartError =
            action.payload ||
            "Failed to update quantity";
        }
      )

      // ==================================================
      // REMOVE FROM CART
      // ==================================================

      .addCase(
        removeFromCart.pending,

        (state) => {
          state.cartLoading = true;

          state.cartError = null;
        }
      )

      .addCase(
        removeFromCart.fulfilled,

        (
          state,
          action
        ) => {
          state.cartLoading = false;

          state.cartError = null;

          const bookId =
            action.meta.arg;

          state.cart =
            state.cart.filter(
              (item) =>
                item.bookId?._id !==
                bookId
            );
        }
      )

      .addCase(
        removeFromCart.rejected,

        (state, action) => {
          state.cartLoading = false;

          state.cartError =
            action.payload ||
            "Failed to remove book from cart";
        }
      )

      // ==================================================
      // CLEAR CART
      // ==================================================

      .addCase(
        clearCart.pending,

        (state) => {
          state.cartLoading = true;

          state.cartError = null;
        }
      )

      .addCase(
        clearCart.fulfilled,

        (state) => {
          state.cartLoading = false;

          state.cartError = null;

          state.cart = [];
        }
      )

      .addCase(
        clearCart.rejected,

        (state, action) => {
          state.cartLoading = false;

          state.cartError =
            action.payload ||
            "Failed to clear cart";
        }
      )

      // ==================================================
      // ADD SHIPPING ADDRESS
      // ==================================================

      .addCase(
        addShippingAddress.pending,

        (state) => {
          state.shippingAddressLoading =
            true;

          state.shippingAddressError =
            null;
        }
      )

      .addCase(
        addShippingAddress.fulfilled,

        (
          state,
          action: PayloadAction<ShippingAddressResponse>
        ) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            null;

          const address =
            action.payload.data;

          if (
            address &&
            !Array.isArray(address)
          ) {
            if (address.isDefault) {
              state.shippingAddresses =
                state.shippingAddresses.map(
                  (item) => ({
                    ...item,
                    isDefault: false,
                  })
                );
            }

            state.shippingAddresses.push(
              address
            );

            state.selectedShippingAddress =
              address;
          }
        }
      )

      .addCase(
        addShippingAddress.rejected,

        (state, action) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            action.payload ||
            "Failed to add shipping address";
        }
      )

      // ==================================================
      // VIEW SHIPPING ADDRESSES
      // ==================================================

      .addCase(
        viewShippingAddresses.pending,

        (state) => {
          state.shippingAddressLoading =
            true;

          state.shippingAddressError =
            null;
        }
      )

     .addCase(
  viewShippingAddresses.fulfilled,
  (
    state,
    action: PayloadAction<ShippingAddressListResponse>
  ) => {
    state.shippingAddressLoading = false;
    state.shippingAddressError = null;

    const addresses = action.payload.data;

    state.shippingAddresses = addresses;

    const defaultAddress = addresses.find(
      (address) => address.isDefault
    );

    state.selectedShippingAddress =
      defaultAddress || addresses[0] || null;
  }
)

      .addCase(
        viewShippingAddresses.rejected,

        (state, action) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            action.payload ||
            "Failed to fetch shipping addresses";
        }
      )

      // ==================================================
      // VIEW SINGLE SHIPPING ADDRESS
      // ==================================================

      .addCase(
        viewShippingAddress.pending,

        (state) => {
          state.shippingAddressLoading =
            true;

          state.shippingAddressError =
            null;
        }
      )

      .addCase(
        viewShippingAddress.fulfilled,

        (
          state,
          action: PayloadAction<ShippingAddressResponse>
        ) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            null;

          const address =
            action.payload.data;

          if (
            address &&
            !Array.isArray(address)
          ) {
            state.selectedShippingAddress =
              address;
          }
        }
      )

      .addCase(
        viewShippingAddress.rejected,

        (state, action) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            action.payload ||
            "Failed to fetch shipping address";
        }
      )

      // ==================================================
      // UPDATE SHIPPING ADDRESS
      // ==================================================

      .addCase(
        updateShippingAddress.pending,

        (state) => {
          state.shippingAddressLoading =
            true;

          state.shippingAddressError =
            null;
        }
      )

      .addCase(
        updateShippingAddress.fulfilled,

        (
          state,
          action: PayloadAction<ShippingAddressResponse>
        ) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            null;

          const updatedAddress =
            action.payload.data;

          if (
            updatedAddress &&
            !Array.isArray(
              updatedAddress
            )
          ) {
            if (
              updatedAddress.isDefault
            ) {
              state.shippingAddresses =
                state.shippingAddresses.map(
                  (item) => ({
                    ...item,
                    isDefault: false,
                  })
                );
            }

            const index =
              state.shippingAddresses.findIndex(
                (item) =>
                  item._id ===
                  updatedAddress._id
              );

            if (index !== -1) {
              state.shippingAddresses[
                index
              ] = updatedAddress;
            }

            state.selectedShippingAddress =
              updatedAddress;
          }
        }
      )

      .addCase(
        updateShippingAddress.rejected,

        (state, action) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            action.payload ||
            "Failed to update shipping address";
        }
      )

      // ==================================================
      // SET DEFAULT SHIPPING ADDRESS
      // ==================================================

      .addCase(
        setDefaultShippingAddress.pending,

        (state) => {
          state.shippingAddressLoading =
            true;

          state.shippingAddressError =
            null;
        }
      )

      .addCase(
        setDefaultShippingAddress.fulfilled,

        (
          state,
          action: PayloadAction<ShippingAddressResponse>
        ) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            null;

          const defaultAddress =
            action.payload.data;

          if (
            defaultAddress &&
            !Array.isArray(
              defaultAddress
            )
          ) {
            state.shippingAddresses =
              state.shippingAddresses.map(
                (address) => ({
                  ...address,
                  isDefault:
                    address._id ===
                    defaultAddress._id,
                })
              );

            state.selectedShippingAddress =
              defaultAddress;
          }
        }
      )

      .addCase(
        setDefaultShippingAddress.rejected,

        (state, action) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            action.payload ||
            "Failed to set default address";
        }
      )

      // ==================================================
      // DELETE SHIPPING ADDRESS
      // ==================================================

      .addCase(
        deleteShippingAddress.pending,

        (state) => {
          state.shippingAddressLoading =
            true;

          state.shippingAddressError =
            null;
        }
      )

      .addCase(
        deleteShippingAddress.fulfilled,

        (
          state,
          action: PayloadAction<ShippingAddressResponse>
        ) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            null;

          const deletedAddress =
            action.payload.data;

          if (
            deletedAddress &&
            !Array.isArray(
              deletedAddress
            )
          ) {
            state.shippingAddresses =
              state.shippingAddresses.filter(
                (address) =>
                  address._id !==
                  deletedAddress._id
              );

            const defaultAddress =
              state.shippingAddresses.find(
                (address) =>
                  address.isDefault
              );

            state.selectedShippingAddress =
              defaultAddress ||
              state.shippingAddresses[0] ||
              null;
          }
        }
      )

      .addCase(
        deleteShippingAddress.rejected,

        (state, action) => {
          state.shippingAddressLoading =
            false;

          state.shippingAddressError =
            action.payload ||
            "Failed to delete shipping address";
        }
      )

      // ==================================================
      // CREATE CHECKOUT
      // ==================================================

      .addCase(
        createCheckout.pending,

        (state) => {
          state.checkoutLoading = true;

          state.checkoutError = null;
        }
      )

      .addCase(
        createCheckout.fulfilled,

        (
          state,
          action: PayloadAction<CheckoutResponse>
        ) => {
          state.checkoutLoading =
            false;

          state.checkoutError = null;

          const checkoutData =
            action.payload.data;

          if (
            checkoutData &&
            !Array.isArray(
              checkoutData
            )
          ) {
            state.checkout = [
              checkoutData,
            ];

            state.checkoutHistory.unshift(
              checkoutData
            );
          }

          if (
            Array.isArray(
              checkoutData
            )
          ) {
            state.checkout =
              checkoutData;

            state.checkoutHistory =
              checkoutData;
          }
        }
      )

      .addCase(
        createCheckout.rejected,

        (state, action) => {
          state.checkoutLoading =
            false;

          state.checkoutError =
            action.payload ||
            "Failed to create checkout";
        }
      )

      // ==================================================
      // VIEW CHECKOUT / ORDER HISTORY
      // ==================================================

      .addCase(
        viewCheckout.pending,

        (state) => {
          state.checkoutLoading = true;

          state.checkoutError = null;
        }
      )

      .addCase(
        viewCheckout.fulfilled,

        (
          state,
          action: PayloadAction<Checkout[]>
        ) => {
          state.checkoutLoading =
            false;

          state.checkoutError = null;

          state.checkout =
            action.payload;

          state.checkoutHistory =
            action.payload;
        }
      )

      .addCase(
        viewCheckout.rejected,

        (state, action) => {
          state.checkoutLoading =
            false;

          state.checkoutError =
            action.payload ||
            "Failed to fetch checkout";
        }
      );
  },
});

// ======================================================
// EXPORT ACTIONS
// ======================================================

export const {
  clearBooks,
  clearSelectedBook,
  clearWishlist,
  clearCheckout,
  clearSelectedShippingAddress,
} = bookSlice.actions;

// ======================================================
// EXPORT REDUCER
// ======================================================

export default bookSlice.reducer;