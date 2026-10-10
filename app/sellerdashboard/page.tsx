"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  ShoppingBag,
  Settings,
  Bell,
  Search,
  Store,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "../../redux/store";

import {
  fetchSellerBooks,
  fetchSellerOrders,
  deleteSellerBook,
  updateSellerOrderStatus,
} from "../../redux/slices/sellerSlice";

import type {
  SellerBook,
  OrderStatus,
} from "../../redux/slices/sellerSlice";

import AddBookForm from "@/components/AddBookForm";
import EditBookForm from "@/components/EditBookForm";

export default function SellerDashboard() {
  const [searchInventory, setSearchInventory] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  // =====================================================
  // REDUX STATE
  // =====================================================

  const {
    books,
    orders,
    booksLoading,
    ordersLoading,
    booksError,
    ordersError,
  } = useSelector(
    (state: RootState) => state.seller
  );

  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [activeView, setActiveView] = useState<
    | "overview"
    | "books"
    | "add-book"
    | "edit-book"
    | "orders"
  >("overview");

  const [selectedBook, setSelectedBook] =
    useState<SellerBook | null>(null);

  const [deleteBookId, setDeleteBookId] =
    useState<string | null>(null);

  const [deleteBookTitle, setDeleteBookTitle] =
    useState("");

  // =====================================================
  // ORDER STATUS STATE
  // =====================================================

  const [selectedStatuses, setSelectedStatuses] =
    useState<Record<string, OrderStatus>>({});

  // =====================================================
  // FETCH SELLER DATA
  // =====================================================

 useEffect(() => {
  dispatch(
    fetchSellerBooks({
      search: searchInventory,
    })
  );

  dispatch(fetchSellerOrders());
}, [dispatch, searchInventory]);

  // =====================================================
  // TOTAL ORDERS
  // =====================================================

  const totalOrders = orders.length;

  // =====================================================
  // ACTIVE LISTINGS
  // =====================================================

  const activeListings = books.filter(
    (book) =>
      book.status === "available" &&
      book.stock > 0 &&
      !book.isDeleted
  ).length;

  // =====================================================
  // BOOKS SOLD
  // =====================================================

  const booksSold = orders.reduce(
    (total, order) => {
      return (
        total +
        order.products.reduce(
          (itemTotal, item) => {
            if (
              item.orderStatus === "cancelled"
            ) {
              return itemTotal;
            }

            return (
              itemTotal +
              Number(item.quantity || 0)
            );
          },
          0
        )
      );
    },
    0
  );

  // =====================================================
  // TOTAL EARNINGS
  // =====================================================

  const totalEarnings = orders.reduce(
    (total, order) => {
      return (
        total +
        order.products.reduce(
          (itemTotal, item) => {
            if (
              item.orderStatus === "cancelled"
            ) {
              return itemTotal;
            }

            return (
              itemTotal +
              Number(item.price || 0) *
                Number(item.quantity || 0)
            );
          },
          0
        )
      );
    },
    0
  );

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const handleUpdateOrderStatus = async (
    orderId: string,
    bookId: string,
    orderStatus: OrderStatus
  ) => {
    try {
      await dispatch(
        updateSellerOrderStatus({
          orderId,
          bookId,
          orderStatus,
        })
      ).unwrap();

      toast.success(
        "Order status updated successfully"
      );

      dispatch(fetchSellerOrders());

    } catch (error: any) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      toast.error(
        typeof error === "string"
          ? error
          : error?.message ||
              "Failed to update order status"
      );
    }
  };

  // =====================================================
  // DELETE BOOK
  // =====================================================

  const handleDeleteConfirm = async () => {
    if (!deleteBookId) return;

    try {
      await dispatch(
        deleteSellerBook(deleteBookId)
      ).unwrap();

      toast.success(
        "Book deleted successfully"
      );

      setDeleteBookId(null);
      setDeleteBookTitle("");
    } catch (error: any) {
      console.error(
        "DELETE BOOK ERROR:",
        error
      );

      toast.error(
        typeof error === "string"
          ? error
          : "Failed to delete book"
      );
    }
  };

  // =====================================================
  // CLOSE DELETE MODAL
  // =====================================================

  const handleDeleteCancel = () => {
    setDeleteBookId(null);
    setDeleteBookTitle("");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between">

        <div>

          {/* LOGO */}

          <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100">

            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Store className="w-5 h-5" />
            </div>

            <span className="font-bold text-lg tracking-tight text-slate-900">
              Seller Portal
            </span>

          </div>

          {/* NAVIGATION */}

          <nav className="p-4 space-y-1">

            {/* OVERVIEW */}

            <button
              type="button"
              onClick={() =>
                setActiveView("overview")
              }
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeView === "overview"
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>

            {/* MY BOOKS */}

            <button
              type="button"
              onClick={() =>
                setActiveView("books")
              }
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeView === "books" ||
                activeView === "add-book"
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              My Books
            </button>

            {/* ADD BOOK */}

            <button
              type="button"
              onClick={() =>
                setActiveView("add-book")
              }
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeView === "add-book"
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Add Book
            </button>

            {/* ORDERS */}

            <button
              type="button"
              onClick={() =>
                setActiveView("orders")
              }
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeView === "orders"
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
            </button>

          </nav>

        </div>

        {/* SETTINGS */}

      

      </aside>

      {/* ================================================= */}
      {/* MAIN CONTAINER */}
      {/* ================================================= */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

          <div className="flex items-center gap-4 w-96">

            <div className="relative w-full">

              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />

             <input
  type="text"
  value={searchInventory}
  onChange={(e) => setSearchInventory(e.target.value)}
  placeholder="Search your inventory..."
  className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
/>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <button
              type="button"
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />

              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">

              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center text-sm">
                SP
              </div>

              <div className="hidden sm:block text-left">

                <p className="text-sm font-medium leading-none">
                  Seller Partner
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Vendor Account
                </p>

              </div>

            </div>

          </div>

        </header>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ================================================= */}
          {/* VIEW 1: OVERVIEW */}
          {/* ================================================= */}

          {activeView === "overview" && (

            <div className="space-y-6">

              {/* PAGE TITLE */}

              <div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Seller Dashboard Overview
                </h1>

                <p className="text-sm text-slate-500">
                  Monitor your book sales, earnings, and active listings.
                </p>

              </div>

              {/* ================================================= */}
              {/* METRIC CARDS */}
              {/* ================================================= */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* TOTAL EARNINGS */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <span className="text-sm font-medium text-slate-500">
                    Total Earnings
                  </span>

                  <p className="text-3xl font-bold mt-2 text-slate-900">
                    ₹{totalEarnings.toLocaleString("en-IN")}
                  </p>

                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center mt-2">
                    From completed & active orders
                  </span>

                </div>

                {/* ACTIVE LISTINGS */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <span className="text-sm font-medium text-slate-500">
                    Active Listings
                  </span>

                  <p className="text-3xl font-bold mt-2 text-slate-900">
                    {activeListings}
                  </p>

                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
                    Live in store
                  </span>

                </div>

                {/* TOTAL ORDERS */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <span className="text-sm font-medium text-slate-500">
                    Total Orders
                  </span>

                  <p className="text-3xl font-bold mt-2 text-slate-900">
                    {totalOrders}
                  </p>

                  <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-2">
                    Seller orders
                  </span>

                </div>

                {/* BOOKS SOLD */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <span className="text-sm font-medium text-slate-500">
                    Books Sold
                  </span>

                  <p className="text-3xl font-bold mt-2 text-slate-900">
                    {booksSold}
                  </p>

                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-2">
                    From your orders
                  </span>

                </div>

              </div>

              {/* ================================================= */}
              {/* RECENT ORDERS */}
              {/* ================================================= */}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">

                  <h2 className="font-semibold text-slate-900">
                    Recent Customer Orders
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveView("orders")
                    }
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    View All
                  </button>

                </div>

                {ordersLoading ? (

                  <div className="px-6 py-10 text-center text-sm text-slate-500">
                    Loading orders...
                  </div>

                ) : ordersError ? (

                  <div className="px-6 py-10 text-center text-sm text-rose-500">
                    {ordersError}
                  </div>

                ) : orders.length === 0 ? (

                  <div className="px-6 py-10 text-center text-sm text-slate-500">
                    No orders found.
                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full text-left text-sm">

                      <thead>

                        <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">

                          <th className="py-3 px-6 font-medium">
                            Order ID
                          </th>

                          <th className="py-3 px-6 font-medium">
                            Book Title
                          </th>

                          <th className="py-3 px-6 font-medium">
                            Status
                          </th>

                          <th className="py-3 px-6 font-medium text-right">
                            Amount
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100">

                        {orders
                          .slice(0, 5)
                          .map((order) => {

                            const firstItem =
                              order.products?.[0];

                            const book =
                              firstItem?.bookId;

                            const bookTitle =
                              typeof book === "string"
                                ? book
                                : book?.title ||
                                  "Book";

                            const amount =
                              order.products?.reduce(
                                (total, item) =>
                                  total +
                                  Number(item.price || 0) *
                                    Number(item.quantity || 0),
                                0
                              ) || 0;

                            const status =
                              firstItem?.orderStatus ||
                              order.orderStatus ||
                              "pending";

                            return (

                              <tr
                                key={order._id}
                                className="hover:bg-slate-50/50"
                              >

                                <td className="py-4 px-6 font-medium text-slate-900">
                                  #{order._id.slice(-6)}
                                </td>

                                <td className="py-4 px-6 text-slate-600">

                                  {bookTitle}

                                  {order.products &&
                                    order.products.length > 1 && (

                                      <span className="ml-2 text-xs text-slate-400">
                                        +{order.products.length - 1} more
                                      </span>

                                    )}

                                </td>

                                <td className="py-4 px-6">

                                  {status.toLowerCase() ===
                                  "delivered" ? (

                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-medium">

                                      <CheckCircle2 className="w-3 h-3" />

                                      Delivered

                                    </span>

                                  ) : (

                                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-medium">

                                      <Clock className="w-3 h-3" />

                                      {status}

                                    </span>

                                  )}

                                </td>

                                <td className="py-4 px-6 text-right font-semibold text-slate-900">
                                  ₹{amount.toLocaleString("en-IN")}
                                </td>

                              </tr>

                            );

                          })}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            </div>

          )}

          {/* ================================================= */}
          {/* VIEW 2: MY BOOKS */}
          {/* ================================================= */}

          {activeView === "books" && (

            <div className="space-y-6">

              {/* HEADER */}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    My Book Inventory
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    Manage the books you have listed on the store.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveView("add-book")
                  }
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add New Book
                </button>

              </div>

              {/* INVENTORY CARD */}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {booksLoading ? (

                  <div className="px-6 py-16 text-center">

                    <div className="flex justify-center mb-4">

                      <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />

                    </div>

                    <p className="text-sm text-slate-500">
                      Loading your books...
                    </p>

                  </div>

                ) : booksError ? (

                  <div className="px-6 py-16 text-center">

                    <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-4">

                      <BookOpen className="w-6 h-6 text-rose-500" />

                    </div>

                    <p className="text-sm font-medium text-rose-600">
                      {booksError}
                    </p>

                  </div>

                ) : books.length === 0 ? (

                  <div className="px-6 py-16 text-center">

                    <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">

                      <BookOpen className="w-7 h-7 text-slate-400" />

                    </div>

                    <p className="mt-4 text-sm font-semibold text-slate-700">
                      No books found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      You have not listed any books yet.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveView("add-book")
                      }
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Your First Book
                    </button>

                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full text-left text-sm">

                      <thead>

                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">

                          <th className="py-4 px-6 font-semibold">
                            Book
                          </th>

                          <th className="py-4 px-6 font-semibold">
                            Category
                          </th>

                          <th className="py-4 px-6 font-semibold">
                            Stock
                          </th>

                          <th className="py-4 px-6 font-semibold">
                            Price
                          </th>

                          <th className="py-4 px-6 font-semibold">
                            Status
                          </th>

                          <th className="py-4 px-6 font-semibold text-right">
                            Actions
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100">

                        {books.map((book) => {

                          const bookImage =
                            book.images?.length
                              ? book.images[0]
                              : null;

                          return (

                            <tr
                              key={book._id}
                              className="group hover:bg-slate-50/70 transition-colors"
                            >

                              {/* BOOK */}

                              <td className="py-4 px-6">

                                <div className="flex items-center gap-4">

                                  <div className="flex-shrink-0">

                                    {bookImage ? (

                                      <img
                                        src={bookImage}
                                        alt={book.title}
                                        className="w-16 h-20 object-cover rounded-lg border border-slate-200"
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                        }}
                                      />

                                    ) : (

                                      <div className="w-16 h-20 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">

                                        <BookOpen className="w-6 h-6 text-slate-400" />

                                      </div>

                                    )}

                                  </div>

                                  <div className="min-w-0">

                                    <p className="font-semibold text-slate-900 truncate max-w-[250px]">
                                      {book.title}
                                    </p>

                                    {book.author && (

                                      <p className="text-xs text-slate-500 mt-1 truncate max-w-[220px]">
                                        by {book.author}
                                      </p>

                                    )}

                                    {book.isbn && (

                                      <p className="text-[11px] text-slate-400 mt-1">
                                        ISBN: {book.isbn}
                                      </p>

                                    )}

                                  </div>

                                </div>

                              </td>

                              {/* CATEGORY */}

                              <td className="py-4 px-6">

                                <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                                  {book.category || "General"}
                                </span>

                              </td>

                              {/* STOCK */}

                              <td className="py-4 px-6">

                                <div className="flex flex-col gap-1">

                                  <span
                                    className={`inline-flex w-fit px-2.5 py-1 rounded-full text-xs font-semibold ${
                                      book.stock > 5
                                        ? "bg-emerald-50 text-emerald-700"
                                        : book.stock > 0
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-rose-50 text-rose-700"
                                    }`}
                                  >
                                    {book.stock > 0
                                      ? `${book.stock} in stock`
                                      : "Out of stock"}
                                  </span>

                                  {book.stock > 0 &&
                                    book.stock <= 5 && (

                                      <span className="text-[11px] text-amber-600">
                                        Low stock
                                      </span>

                                    )}

                                </div>

                              </td>

                              {/* PRICE */}

                              <td className="py-4 px-6">

                                <div className="flex flex-col">

                                  <span className="font-bold text-slate-900">

                                    ₹
                                    {Number(
                                      book.discountPrice ||
                                        book.price ||
                                        0
                                    ).toLocaleString("en-IN")}

                                  </span>

                                  {book.discountPrice &&
                                    Number(
                                      book.discountPrice
                                    ) <
                                      Number(
                                        book.price
                                      ) && (

                                      <span className="text-xs text-slate-400 line-through mt-0.5">

                                        ₹
                                        {Number(
                                          book.price
                                        ).toLocaleString(
                                          "en-IN"
                                        )}

                                      </span>

                                    )}

                                </div>

                              </td>

                              {/* STATUS */}

                              <td className="py-4 px-6">

                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    book.status ===
                                    "available"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >

                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      book.status ===
                                      "available"
                                        ? "bg-emerald-500"
                                        : "bg-slate-400"
                                    }`}
                                  />

                                  {book.status
                                    ? book.status
                                        .charAt(0)
                                        .toUpperCase() +
                                      book.status.slice(1)
                                    : "Unknown"}

                                </span>

                              </td>

                              {/* ACTIONS */}

                              <td className="py-4 px-6">

                                <div className="flex justify-end items-center gap-1">

                                  {/* EDIT */}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedBook(book);
                                      setActiveView(
                                        "edit-book"
                                      );
                                    }}
                                    className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                    title="Edit book"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>

                                  {/* DELETE */}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeleteBookId(
                                        book._id
                                      );
                                      setDeleteBookTitle(
                                        book.title
                                      );
                                    }}
                                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Delete book"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>

                                </div>

                              </td>

                            </tr>

                          );

                        })}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            </div>

          )}

          {/* ================================================= */}
          {/* VIEW 3: ADD BOOK */}
          {/* ================================================= */}

          {activeView === "add-book" && (

            <AddBookForm
              onSuccess={() =>
                setActiveView("books")
              }
            />

          )}

          {/* ================================================= */}
          {/* VIEW 4: EDIT BOOK */}
          {/* ================================================= */}

          {activeView === "edit-book" &&
            selectedBook && (

              <EditBookForm
                book={selectedBook}
                onSuccess={() => {
                  setSelectedBook(null);
                  setActiveView("books");
                }}
                onCancel={() => {
                  setSelectedBook(null);
                  setActiveView("books");
                }}
              />

            )}

          {/* ================================================= */}
          {/* VIEW 5: ORDERS */}
          {/* ================================================= */}

          {activeView === "orders" && (

            <div className="space-y-6">

              {/* HEADER */}

              <div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Customer Orders
                </h1>

                <p className="text-sm text-slate-500">
                  Track orders placed for your listed books.
                </p>

              </div>

              {/* ORDERS CARD */}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {ordersLoading ? (

                  <div className="px-6 py-12 text-center text-sm text-slate-500">
                    Loading orders...
                  </div>

                ) : ordersError ? (

                  <div className="px-6 py-12 text-center text-sm text-rose-500">
                    {ordersError}
                  </div>

                ) : orders.length === 0 ? (

                  <div className="px-6 py-12 text-center">

                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-700">
                      No orders found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Orders for your books will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto">

                    <table className="w-full text-left text-sm">

                      <thead>

                        <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">

                          <th className="py-3 px-6 font-medium">
                            Order ID
                          </th>

                          <th className="py-3 px-6 font-medium">
                            Book Title
                          </th>

                          <th className="py-3 px-6 font-medium">
                            Customer
                          </th>

                          <th className="py-3 px-6 font-medium">
                            Status
                          </th>

                          <th className="py-3 px-6 font-medium text-right">
                            Amount
                          </th>

                        </tr>

                      </thead>

                      <tbody className="divide-y divide-slate-100">

                        {orders.map((order) => {

                          const firstItem =
                            order.products?.[0];

                          const book =
                            firstItem?.bookId;

                          const bookTitle =
                            typeof book === "string"
                              ? book
                              : book?.title ||
                                "Book";

                          const customer =
                            typeof order.userId ===
                            "object"
                              ? `${order.userId?.firstName || ""} ${
                                  order.userId?.lastName || ""
                                }`.trim()
                              : "Customer";

                          const amount =
                            order.products?.reduce(
                              (total, item) =>
                                total +
                                Number(
                                  item.price || 0
                                ) *
                                  Number(
                                    item.quantity || 0
                                  ),
                              0
                            ) || 0;

                          const status =
                            firstItem?.orderStatus ||
                            order.orderStatus ||
                            "pending";

                          const bookId =
                            typeof book === "object"
                              ? book._id
                              : book;

                          const statusKey =
                            `${order._id}-${bookId}`;

                          const selectedStatus =
                            selectedStatuses[
                              statusKey
                            ] || status;

                          return (

                            <tr
                              key={order._id}
                              className="hover:bg-slate-50/50 transition-colors"
                            >

                              {/* ORDER ID */}

                              <td className="py-4 px-6 font-medium text-slate-900">
                                #{order._id.slice(-6)}
                              </td>

                              {/* BOOK TITLE */}

                              <td className="py-4 px-6 text-slate-600">

                                {bookTitle}

                                {order.products &&
                                  order.products.length >
                                    1 && (

                                    <span className="ml-2 text-xs text-slate-400">
                                      +
                                      {order.products.length -
                                        1}{" "}
                                      more
                                    </span>

                                  )}

                              </td>

                              {/* CUSTOMER */}

                              <td className="py-4 px-6 text-slate-600">
                                {customer ||
                                  "Customer"}
                              </td>

                              {/* STATUS */}

                              <td className="py-4 px-6">

                                <div className="flex items-center gap-2">

                                  <select
                                    value={
                                      selectedStatus
                                    }
                                    onChange={(e) =>
                                      setSelectedStatuses(
                                        (prev) => ({
                                          ...prev,
                                          [statusKey]:
                                            e.target
                                              .value as OrderStatus,
                                        })
                                      )
                                    }
                                    className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                  >

                                    <option value="pending">
                                      Pending
                                    </option>

                                    <option value="confirmed">
                                      Confirmed
                                    </option>

                                    <option value="shipped">
                                      Shipped
                                    </option>

                                    <option value="delivered">
                                      Delivered
                                    </option>

                                    <option value="cancelled">
                                      Cancelled
                                    </option>

                                  </select>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleUpdateOrderStatus(
                                        order._id,
                                        bookId,
                                        selectedStatus as OrderStatus
                                      )
                                    }
                                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors"
                                  >
                                    Update
                                  </button>

                                </div>

                              </td>

                              {/* AMOUNT */}

                              <td className="py-4 px-6 text-right font-semibold text-slate-900">

                                ₹
                                {amount.toLocaleString(
                                  "en-IN"
                                )}

                              </td>

                            </tr>

                          );

                        })}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            </div>

          )}

          {/* ================================================= */}
          {/* DELETE CONFIRMATION MODAL */}
          {/* ================================================= */}

          {deleteBookId && (

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

              {/* BACKDROP */}

              <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={handleDeleteCancel}
              />

              {/* MODAL */}

              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">

                {/* ICON */}

                <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">

                  <Trash2 className="w-6 h-6 text-rose-600" />

                </div>

                {/* TITLE */}

                <h2 className="mt-4 text-lg font-bold text-slate-900 text-center">
                  Delete Book?
                </h2>

                {/* MESSAGE */}

                <p className="mt-2 text-sm text-slate-500 text-center leading-6">

                  Are you sure you want to delete{" "}

                  <span className="font-semibold text-slate-700">
                    "{deleteBookTitle}"
                  </span>

                  ?

                  <br />

                  This book will be removed from your inventory.

                </p>

                {/* BUTTONS */}

                <div className="mt-6 flex items-center justify-end gap-3">

                  {/* CANCEL */}

                  <button
                    type="button"
                    onClick={handleDeleteCancel}
                    disabled={booksLoading}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={handleDeleteConfirm}
                    disabled={booksLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white text-sm font-medium transition-colors"
                  >

                    <Trash2 className="w-4 h-4" />

                    {booksLoading
                      ? "Deleting..."
                      : "Delete Book"}

                  </button>

                </div>

              </div>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}
