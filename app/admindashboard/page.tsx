"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  Search,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import type {
  RootState,
  AppDispatch,
} from "../../redux/store";

import {
  fetchDashboardData,
  fetchAdminBooks,
  deleteAdminBook,
} from "../../redux/slices/adminSlice";

import {
  fetchUsers,
  updateUserStatus,
} from "../../redux/slices/usersSlice";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
const [selectedBookTitle, setSelectedBookTitle] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  // ==========================================
  // ACTIVE VIEW
  // ==========================================

  const [activeView, setActiveView] = useState<
  "dashboard" | "users" | "books" | "order"
>("dashboard");

  // ==========================================
  // GET DATA FROM REDUX
  // ==========================================

  const {
    // Dashboard
    metrics,
    transactions,
    status: dashboardStatus,
    error: dashboardError,

    // Books
    books,
    bookStats,
    booksStatus,
    booksError,
  } = useSelector((state: RootState) => state.admin);

  // ==========================================
  // USERS DATA
  // ==========================================

  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state: RootState) => state.users);

  // ==========================================
  // FETCH DATA ON MOUNT
  // ==========================================

 useEffect(() => {
  dispatch(fetchDashboardData());
}, [dispatch]);

useEffect(() => {
  const timer = setTimeout(() => {
    dispatch(fetchUsers(searchTerm));
    dispatch(fetchAdminBooks(searchTerm));
  }, 300);

  return () => clearTimeout(timer);
}, [dispatch, searchTerm]);



// ==========================================
// USER STATUS CHANGE
// ==========================================

const handleStatusChange = (
  userId: string,
  newStatus: "Active" | "Blocked"
) => {
  dispatch(
    updateUserStatus({
      userId,
      status: newStatus,
    })
  );
};

// ==========================================
// DELETE BOOK
// ==========================================

const handleDeleteBook = (
  bookId: string,
  bookTitle: string
) => {
  setSelectedBookId(bookId);
  setSelectedBookTitle(bookTitle);
  setShowDeleteModal(true);
};

const handleConfirmDelete = () => {
  if (!selectedBookId) return;

  dispatch(deleteAdminBook(selectedBookId));

  setShowDeleteModal(false);
  setSelectedBookId(null);
  setSelectedBookTitle("");
};

const handleCancelDelete = () => {
  setShowDeleteModal(false);
  setSelectedBookId(null);
  setSelectedBookTitle("");
};

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col justify-between">

        <div>

          {/* Logo */}

          <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100">

            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <span className="font-bold text-lg tracking-tight">
              BookStore
            </span>

          </div>

          {/* Navigation */}

          <nav className="p-4 space-y-1">

            {/* Dashboard */}

            <button
              onClick={() => setActiveView("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeView === "dashboard"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            {/* Users */}

            <button
              onClick={() => setActiveView("users")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeView === "users"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users className="w-4 h-4" />
              Users
            </button>

            {/* Books */}

            <button
              onClick={() => setActiveView("books")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                activeView === "books"
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Books
            </button>

            {/* order */}

           <button
  onClick={() => setActiveView("order")}
  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
    activeView === "order"
      ? "bg-indigo-50 text-indigo-600"
      : "text-slate-600 hover:bg-slate-100"
  }`}
>
  <ShoppingBag className="w-4 h-4" />
  Orders
</button>

          </nav>

        </div>

        {/* Settings */}

        <div className="p-4 border-t border-slate-100">

          {/* <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </a> */}

        </div>

      </aside>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

          {/* Search */}

          {/* Search */}
<div className="flex items-center gap-4 w-96">
  <div className="relative w-full">
    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />

    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search books, users..."
      className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
    />
  </div>
</div>

          {/* Admin Profile */}

          <div className="flex items-center gap-4">


            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">

              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center text-sm">
                AD
              </div>

              <div className="hidden sm:block text-left">

                <p className="text-sm font-medium leading-none">
                  Admin
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Administrator
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
          {/* VIEW 1: DASHBOARD */}
          {/* ================================================= */}

          {activeView === "dashboard" && (
            <>
              <div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Dashboard Overview
                </h1>

                <p className="text-sm text-slate-500">
                  Welcome back, here is what’s happening with your bookstore today.
                </p>

              </div>

              {/* Dashboard Error */}

              {dashboardStatus === "failed" && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {dashboardError || "Failed to load dashboard data"}
                </div>
              )}

              {/* METRIC CARDS */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Revenue */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-medium text-slate-500">
                      Total Revenue
                    </span>

                    <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">

                      <ArrowUpRight className="w-3 h-3 mr-0.5" />

                      Revenue

                    </span>

                  </div>

                  <p className="text-3xl font-bold mt-4">
                    ₹
                    {metrics?.totalRevenue?.toLocaleString("en-IN") ||
                      "0"}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Total revenue from paid orders
                  </p>

                </div>

                {/* Active Users */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-medium text-slate-500">
                      Active Users
                    </span>

                    <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Active
                    </span>

                  </div>

                  <p className="text-3xl font-bold mt-4">
                    {metrics?.activeUsers?.toLocaleString() || "0"}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Accepted users and sellers
                  </p>

                </div>

                {/* Orders */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-medium text-slate-500">
                      Total Orders
                    </span>

                    <span className="flex items-center text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      Orders
                    </span>

                  </div>

                  <p className="text-3xl font-bold mt-4">
                    {metrics?.totalOrders?.toLocaleString() || "0"}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Orders placed in BookStore
                  </p>

                </div>

                {/* Books */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <div className="flex items-center justify-between">

                    <span className="text-sm font-medium text-slate-500">
                      Total Books
                    </span>

                    <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Available
                    </span>

                  </div>

                  <p className="text-3xl font-bold mt-4">
                    {metrics?.totalBooks?.toLocaleString() || "0"}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Available books in store
                  </p>

                </div>

              </div>

              {/* RECENT ORDERS */}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">

                  <h2 className="font-semibold text-slate-900">
                    Recent Orders
                  </h2>

                  <button
                    onClick={() => setActiveView("order")}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    View All
                  </button>

                </div>

                <div className="overflow-x-auto">

                  <table className="w-full text-left border-collapse">

                    <thead>

                      <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider bg-slate-50/50">

                        <th className="py-3 px-6 font-medium">
                          Customer
                        </th>

                        <th className="py-3 px-6 font-medium">
                          Status
                        </th>

                        <th className="py-3 px-6 font-medium">
                          Date
                        </th>

                        <th className="py-3 px-6 font-medium text-right">
                          Amount
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">

                      {dashboardStatus === "loading" && (
                        <tr>

                          <td
                            colSpan={4}
                            className="py-8 text-center text-slate-500"
                          >
                            Loading recent orders...
                          </td>

                        </tr>
                      )}

                      {dashboardStatus !== "loading" &&
                        transactions.length === 0 && (
                          <tr>

                            <td
                              colSpan={4}
                              className="py-8 text-center text-slate-500"
                            >
                              No recent orders found.
                            </td>

                          </tr>
                        )}

                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>

                          <td className="py-4 px-6">

                            <div className="flex items-center gap-3">

                              <div className="w-8 h-8 rounded-full bg-slate-100 font-bold flex items-center justify-center text-xs text-slate-600">
                                {transaction.initials}
                              </div>

                              <div>

                                <p className="font-medium text-slate-900">
                                  {transaction.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {transaction.email}
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="py-4 px-6">

                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : transaction.status === "Failed"
                                  ? "bg-rose-50 text-rose-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {transaction.status}
                            </span>

                          </td>

                          <td className="py-4 px-6 text-slate-500">

                            {new Date(
                              transaction.date
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}

                          </td>

                          <td className="py-4 px-6 text-right font-semibold text-slate-900">
                            {transaction.amount}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

              </div>
            </>
          )}

          {/* ================================================= */}
          {/* VIEW 2: USERS */}
          {/* ================================================= */}

          {activeView === "users" && (
            <div className="space-y-6">

              <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-900">
                  Users
                </h1>

               <p className="mt-1 text-sm text-gray-500">
  Manage all registered users and account status
</p>

              </div>

              {usersLoading ? (
                <div className="flex min-h-[200px] items-center justify-center bg-white rounded-xl border border-slate-200">

                  <p className="text-gray-500 text-sm">
                    Loading users...
                  </p>

                </div>
              ) : usersError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">

                  <p className="text-red-500 text-sm">
                    {usersError}
                  </p>

                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

                  <table className="w-full text-left">

                    <thead className="bg-gray-50 border-b">

                      <tr>

                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          User
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Email
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Role
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Status
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Joined Date
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                          Actions
                        </th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">

                      {users.map((user) => {

                        const name =
                          `${user.firstName || ""} ${
                            user.lastName || ""
                          }`.trim();

                        const avatar =
                          `${user.firstName?.[0] || ""}${
                            user.lastName?.[0] || ""
                          }`.toUpperCase() || "U";

                        const isEligibleForAction =
                          user.role === "user" ||
                          user.role === "seller";

                        return (
                          <tr
                            key={user._id}
                            className="hover:bg-gray-50/50 transition-colors"
                          >

                            <td className="px-6 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                                  {avatar}
                                </div>

                                <div>

                                  <p className="font-medium text-gray-900">
                                    {name}
                                  </p>

                                </div>

                              </div>

                            </td>

                            <td className="px-6 py-4 text-gray-600">
                              {user.email}
                            </td>

                            <td className="px-6 py-4">

                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                                {user.role}
                              </span>

                            </td>

                            <td className="px-6 py-4">

                              <span
  className={`rounded-full px-3 py-1 text-xs font-medium ${
    user.status === "Blocked"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700"
  }`}
>
  {user.status || "Active"}
</span>

                            </td>

                            <td className="px-6 py-4 text-gray-600">

                              {user.createdAt
                                ? new Date(
                                    user.createdAt
                                  ).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "2-digit",
                                      year: "numeric",
                                    }
                                  )
                                : "-"}

                            </td>

                            <td className="px-6 py-4 text-right">

                              {isEligibleForAction ? (
                                <div className="flex items-center justify-end gap-2">

  {user.status === "Blocked" ? (
    <button
      onClick={() =>
        handleStatusChange(
          user._id,
          "Active"
        )
      }
      className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
    >
      Activate
    </button>
  ) : (
    <button
      onClick={() =>
        handleStatusChange(
          user._id,
          "Blocked"
        )
      }
      className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
    >
      Block
    </button>
  )}

</div>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  N/A
                                </span>
                              )}

                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                  {users.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                      No users found.
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* ================================================= */}
          {/* VIEW 3: BOOKS */}
          {/* ================================================= */}

          {activeView === "books" && (
            <div className="space-y-6">

              {/* HEADER */}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Book Inventory & Details
                  </h1>

                  <p className="text-sm text-slate-500">
                    Manage store books, prices, stock levels, and metadata.
                  </p>

                </div>

              </div>

              {/* ERROR */}

              {booksStatus === "failed" && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {booksError || "Failed to load books"}
                </div>
              )}

              {/* BOOK STATS */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                {/* TOTAL CATALOG */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <span className="text-sm font-medium text-slate-500">
                    Total Catalog
                  </span>

                  <p className="text-3xl font-bold mt-2">
                    {booksStatus === "loading"
                      ? "..."
                      : bookStats.totalCatalog.toLocaleString()}
                  </p>

                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-2">
                    Active listings
                  </span>

                </div>

                {/* LOW STOCK */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <span className="text-sm font-medium text-slate-500">
                    Low Stock Items
                  </span>

                  <p className="text-3xl font-bold mt-2 text-amber-600">
                    {booksStatus === "loading"
                      ? "..."
                      : bookStats.lowStockItems.toLocaleString()}
                  </p>

                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-2">
                    Requires restock
                  </span>

                </div>

                {/* OUT OF STOCK */}

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

                  <span className="text-sm font-medium text-slate-500">
                    Out of Stock
                  </span>

                  <p className="text-3xl font-bold mt-2 text-rose-600">
                    {booksStatus === "loading"
                      ? "..."
                      : bookStats.outOfStock.toLocaleString()}
                  </p>

                  <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full inline-block mt-2">
                    Action needed
                  </span>

                </div>

              </div>

              {/* BOOKS TABLE */}

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* TABLE HEADER */}

                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">

                  <h2 className="font-semibold text-slate-900">
                    All Books
                  </h2>

                  <span className="text-xs text-slate-400">

                    {booksStatus === "loading"
                      ? "Loading..."
                      : `${books.length} books`}

                  </span>

                </div>

                {/* TABLE */}

                <div className="overflow-x-auto">

                  <table className="w-full text-left border-collapse">

                    <thead>

                      <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider bg-slate-50/50">

                        <th className="py-3 px-6 font-medium">
                          Book Title & Author
                        </th>

                        <th className="py-3 px-6 font-medium">
                          Category
                        </th>

                        <th className="py-3 px-6 font-medium">
                          Stock
                        </th>

                        <th className="py-3 px-6 font-medium">
                          Price
                        </th>

                        <th className="py-3 px-6 font-medium text-right">
  Actions
</th>

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100 text-sm">

                      {/* LOADING */}

                      {booksStatus === "loading" && (
                        <tr>

                          <td
                            colSpan={5}
                            className="py-10 text-center text-slate-500"
                          >
                            Loading books...
                          </td>

                        </tr>
                      )}

                      {/* NO BOOKS */}

                      {booksStatus !== "loading" &&
                        books.length === 0 && (
                          <tr>

                            <td
                              colSpan={4}
                              className="py-10 text-center text-slate-500"
                            >
                              No books found.
                            </td>

                          </tr>
                        )}

                      {/* BOOK DATA */}

                      {booksStatus !== "loading" &&
                        books.map((book) => (
                          <tr
                            key={book._id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >

                            {/* TITLE + AUTHOR */}

                            <td className="py-4 px-6">

                              <div className="font-medium text-slate-900">
                                {book.title}
                              </div>

                              <div className="text-xs text-slate-500">
                                By {book.author || "Unknown Author"}
                              </div>

                            </td>

                            {/* CATEGORY */}

                            <td className="py-4 px-6 text-slate-600">

                              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600">
                                {book.category || "Uncategorized"}
                              </span>

                            </td>

                            {/* STOCK */}

                            <td className="py-4 px-6">

                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  Number(book.stock) > 10
                                    ? "bg-emerald-50 text-emerald-700"
                                    : Number(book.stock) > 0
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-rose-50 text-rose-700"
                                }`}
                              >
                                {Number(book.stock) > 0
                                  ? `${book.stock} in stock`
                                  : "Out of stock"}
                              </span>

                            </td>

                            {/* PRICE */}

                            <td className="py-4 px-6 font-semibold text-slate-900">

                              ₹
                              {Number(
                                book.price || 0
                              ).toLocaleString("en-IN")}

                            </td>

                            {/* ACTIONS */}

<td className="py-4 px-6 text-right">

  <button
  onClick={() =>
    handleDeleteBook(book._id, book.title)
  }
  title="Delete book"
  className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
>
  <Trash2 className="w-4 h-4" />
</button>

</td>

                          </tr>
                        ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>
          )}

          {/* ================================================= */}
{/* DELETE CONFIRMATION MODAL */}
{/* ================================================= */}

{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

      {/* Modal Content */}

      <div className="p-6">

        {/* Icon */}

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <Trash2 className="h-6 w-6 text-rose-600" />
        </div>

        {/* Title */}

        <h2 className="mt-4 text-center text-lg font-semibold text-slate-900">
          Delete Book?
        </h2>

        {/* Message */}

        <p className="mt-2 text-center text-sm text-slate-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">
            "{selectedBookTitle}"
          </span>
          ?
        </p>

        <p className="mt-2 text-center text-xs text-slate-400">
          This book will no longer be available in the bookstore.
        </p>

        {/* Buttons */}

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={handleCancelDelete}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>

        </div>

      </div>

    </div>

  </div>
)}



{/* ================= VIEW 4: ALL ORDERS ================= */}
{activeView === "order" && (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        All Orders
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        View all customer orders and payment details.
      </p>
    </div>

    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h2 className="font-semibold text-slate-900">
          Order Details
        </h2>
        <span className="text-sm text-slate-500">
          {transactions.length} orders
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {dashboardStatus === "loading" ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  Loading orders...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {transaction.name}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {transaction.email}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        transaction.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : transaction.status === "Failed"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {transaction.date
                      ? new Date(transaction.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-900">
                    {transaction.amount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

        </main>

      </div>

    </div>
  );
}
