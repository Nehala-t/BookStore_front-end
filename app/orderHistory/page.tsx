"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import type {
  RootState,
  AppDispatch,
} from "../../redux/store";

import {
  viewCheckout,
  cancelOrderItem,
} from "../../redux/slices/bookSlice";

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    checkout,
    checkoutLoading,
    checkoutError,
  } = useSelector(
    (state: RootState) => state.books
  );

  // ======================================================
  // FETCH ORDER HISTORY
  // ======================================================

  useEffect(() => {
    dispatch(viewCheckout());
  }, [dispatch]);

  const handleCancelOrderItem = async (
    orderId: string,
    itemId?: string
  ) => {
    if (!itemId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this book?"
    );

    if (!confirmed) {
      return;
    }

    const result = await dispatch(
      cancelOrderItem({
        orderId,
        itemId,
      })
    );

    if (cancelOrderItem.fulfilled.match(result)) {
      dispatch(viewCheckout());
    }
  };

  // ======================================================
  // STATUS BADGE
  // ======================================================

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";

      case "confirmed":
      case "shipped":
        return "bg-sky-50 text-sky-700 border-sky-200/60";

      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";

      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/60";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200/60";
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (checkoutLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>

          <p className="text-sm font-medium text-gray-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (checkoutError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-red-100 shadow-xl rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
            !
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-gray-900 tracking-tight">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            {checkoutError}
          </p>

          <button
            type="button"
            onClick={() => dispatch(viewCheckout())}
            className="mt-6 w-full bg-gray-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-gray-800 transition shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // NO ORDERS
  // ======================================================

  if (!checkout || checkout.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-gray-100 shadow-xl rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-2xl shadow-xs">
            📦
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            No Orders Yet
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed">
            You haven't placed any book orders yet.
            Explore our collection and find your next
            great read.
          </p>

          <div className="pt-2">
            <Link
              href="/books"
              className="w-full inline-block bg-gray-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-gray-800 transition shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // ORDERS
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* PAGE HEADER */}

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Order History
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Track recent shipments, review item details,
            and manage past purchases.
          </p>
        </div>

        {/* ORDERS LIST */}

        <div className="space-y-6">
          {checkout.map((order) => {
            // DATE

            const formattedDate = order.createdAt
              ? new Date(
                  order.createdAt
                ).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Unknown date";

            // SHIPPING ADDRESS

            const shippingAddress =
              typeof order.shippingAddress === "object"
                ? order.shippingAddress
                : null;

            // ORDER STATUS

            const orderStatus =
              order.orderStatus ||
              order.products?.[0]?.orderStatus ||
              "pending";

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md"
              >

                {/* ORDER HEADER */}

                <div className="bg-gradient-to-r from-gray-50/80 to-white px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-semibold text-gray-500 uppercase tracking-wide">
                      Order ID:{" "}
                      <span className="text-gray-900">
                        {order._id}
                      </span>
                    </span>

                    <p className="text-xs text-gray-400">
                      Placed on {formattedDate}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3.5 py-1 text-xs font-bold rounded-full border uppercase tracking-wider shadow-2xs ${getStatusBadge(
                        orderStatus.toLowerCase()
                      )}`}
                    >
                      {orderStatus}
                    </span>

                    <span className="font-bold text-gray-900 text-base">
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* ORDER BODY */}

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* PRODUCTS */}

                  <div className="md:col-span-2 space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Items Ordered
                    </h4>

                    <div className="divide-y divide-gray-100">
                      {order.products?.map(
                        (item, index) => {
                          const book =
                            typeof item.bookId === "object" &&
                            item.bookId !== null
                              ? item.bookId
                              : null;

                          const bookTitle =
                            book?.title || "Book Item";

                          const bookAuthor = book?.author;

                          const bookImage =
                            book?.images?.[0] ||
                            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200&auto=format&fit=crop";

                          // INDIVIDUAL BOOK STATUS

                          const itemStatus = (
                            item.orderStatus ||
                            order.orderStatus ||
                            "pending"
                          ).toLowerCase();

                          return (
                            <div
                              key={item._id || index}
                              className="py-3.5 flex items-center justify-between gap-4 text-sm"
                            >

                              {/* BOOK INFORMATION */}

                              <div className="flex items-center space-x-3.5 overflow-hidden">
                                <img
                                  src={bookImage}
                                  alt={bookTitle}
                                  className="w-12 h-16 object-cover rounded-xl border border-gray-200/60 shadow-2xs shrink-0 bg-gray-100"
                                />

                                <div className="min-w-0">
                                  <h5 className="font-semibold text-gray-800 truncate">
                                    {bookTitle}
                                  </h5>

                                  {bookAuthor && (
                                    <p className="text-xs text-gray-400 truncate">
                                      by {bookAuthor}
                                    </p>
                                  )}

                                  <p className="text-xs font-medium text-indigo-600 mt-0.5">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>

                              {/* ITEM PRICE AND CANCEL BUTTON */}

                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className="font-semibold text-gray-900">
                                  ₹
                                  {(
                                    Number(item.price || 0) *
                                    Number(item.quantity || 1)
                                  ).toLocaleString("en-IN")}
                                </span>

                                {itemStatus === "cancelled" ? (
                                  <span className="text-xs font-semibold text-rose-600">
                                    Cancelled
                                  </span>
                                ) : ["pending", "confirmed"].includes(
                                    itemStatus
                                  ) ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCancelOrderItem(
                                        order._id,
                                        item._id
                                      )
                                    }
                                    disabled={!item._id}
                                    className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Cancel Book
                                  </button>
                                ) : null}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* SHIPPING DETAILS */}

                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-1.5 h-fit text-sm">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      Delivery Address
                    </h4>

                    {shippingAddress ? (
                      <>
                        <p className="font-bold text-gray-800">
                          {shippingAddress.firstName}{" "}
                          {shippingAddress.lastName}
                        </p>

                        <p className="text-xs text-gray-500 leading-relaxed">
                          {shippingAddress.address}
                        </p>

                        <p className="text-xs text-gray-500">
                          {shippingAddress.city},{" "}
                          {shippingAddress.state} -{" "}
                          {shippingAddress.pincode}
                        </p>

                        <p className="text-xs text-gray-500 pt-1 font-medium">
                          📞 {shippingAddress.phone}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        Shipping address unavailable
                      </p>
                    )}
                  </div>
                </div>

                {/* ORDER FOOTER */}

                <div className="bg-gray-50/40 px-6 py-3.5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  <div className="text-gray-500">
                    <span>
                      Payment Method:{" "}
                      <strong className="text-gray-700 uppercase">
                        {order.paymentMethod}
                      </strong>{" "}
                      • Status:{" "}
                      <span className="capitalize font-medium text-indigo-600">
                        {order.paymentStatus}
                      </span>
                    </span>
                  </div>

                  {/* TRACK SHIPMENT BUTTON */}

                  {/* <button
                    type="button"
                    onClick={() =>
                      alert(
                        `Tracking information requested for order ${order._id}`
                      )
                    }
                    className="font-semibold text-indigo-600 hover:text-indigo-800 transition flex items-center space-x-1"
                  >
                    <span>Track Shipment</span>
                    <span>→</span>
                  </button> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
