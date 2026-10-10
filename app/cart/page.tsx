"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import type {
  RootState,
  AppDispatch,
} from "../../redux/store";

import {
  viewCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../../redux/slices/bookSlice";

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // ==========================================
  // CART
  // ==========================================

  const cartItems = useSelector(
    (state: RootState) => state.books.cart
  );

  const cartLoading = useSelector(
    (state: RootState) => state.books.cartLoading
  );

  // ==========================================
  // FETCH CART
  // ==========================================

  useEffect(() => {
    dispatch(viewCart());
  }, [dispatch]);

  // ==========================================
  // CALCULATE SUBTOTAL
  // ==========================================

  const subtotal = cartItems.reduce((acc, item) => {
    const price = Number(
      item.bookId?.discountPrice ??
        item.bookId?.price ??
        0
    );

    const quantity = Number(
      item.quantity ?? 0
    );

    return acc + price * quantity;
  }, 0);

  // ==========================================
  // SHIPPING
  // ==========================================

  const shipping = subtotal > 0 ? 4.99 : 0;

  // ==========================================
  // TOTAL
  // ==========================================

  const total = subtotal + shipping;

  // ==========================================
  // LOADING
  // ==========================================

  if (
    cartLoading &&
    cartItems.length === 0
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="animate-pulse text-lg text-gray-500">
          Loading your cart...
        </p>
      </div>
    );
  }

  // ==========================================
  // IMAGE URL
  // ==========================================

  const getImageUrl = (images?: string[]) => {
    const selectedImage = images?.[0];

    if (!selectedImage) {
      return "/placeholder-book.png";
    }

    if (selectedImage.startsWith("http")) {
      return selectedImage;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000";

    return `${baseUrl}${
      selectedImage.startsWith("/")
        ? ""
        : "/"
    }${selectedImage}`;
  };

  // ==========================================
  // GO TO CHECKOUT
  // ==========================================

  const handleCheckout = () => {
    router.push("/checkout");
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-3xl font-bold text-gray-800">
          Shopping Cart
        </h1>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={() =>
              dispatch(clearCart())
            }
            disabled={cartLoading}
            className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cartLoading
              ? "Clearing..."
              : "Clear Cart"}
          </button>
        )}

      </div>

      {/* ======================================
          EMPTY CART
      ====================================== */}

      {cartItems.length === 0 ? (

        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-16 text-center">

          <p className="mb-4 text-xl text-gray-500">
            Your cart is currently empty.
          </p>

          <Link
            href="/books"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Explore Books
          </Link>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ==================================
              CART ITEMS
          ================================== */}

          <div className="space-y-4 lg:col-span-2">

            {cartItems.map((item) => {

              const book = item.bookId;

              if (!book) {
                return null;
              }

              const displayPrice = Number(
                book.discountPrice ??
                  book.price ??
                  0
              );

              return (
                <div
                  key={`${book._id}-${item._id}`}
                  className="flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row"
                >

                  {/* BOOK DETAILS */}

                  <div className="flex w-full items-center gap-4 sm:w-auto">

                    <img
                      src={getImageUrl(
                        book.images
                      )}
                      alt={book.title}
                      className="h-24 w-20 rounded object-cover"
                    />

                    <div>

                      <h2 className="line-clamp-1 text-lg font-semibold text-gray-800">
                        {book.title}
                      </h2>

                      <p className="mb-1 text-sm text-gray-600">
                        {book.author}
                      </p>

                      <span className="font-bold text-blue-600">
                        $
                        {displayPrice.toFixed(2)}
                      </span>

                    </div>

                  </div>

                  {/* QUANTITY + REMOVE */}

                  <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-col sm:items-end">

                    {/* QUANTITY */}

                    <div className="flex items-center overflow-hidden rounded border border-gray-300">

                      {/* MINUS */}

                      <button
                        type="button"
                        disabled={cartLoading}
                        onClick={() => {

                          if (
                            item.quantity > 1
                          ) {
                            dispatch(
                              updateCartQuantity({
                                bookId:
                                  book._id,
                                quantity:
                                  item.quantity -
                                  1,
                              })
                            );
                          } else {
                            dispatch(
                              removeFromCart(
                                book._id
                              )
                            );
                          }

                        }}
                        className="bg-gray-100 px-3 py-1 text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        -
                      </button>

                      {/* CURRENT QUANTITY */}

                      <span className="px-4 py-1 text-sm font-medium">
                        {item.quantity}
                      </span>

                      {/* PLUS */}

                      <button
                        type="button"
                        disabled={cartLoading}
                        onClick={() =>
                          dispatch(
                            updateCartQuantity({
                              bookId:
                                book._id,
                              quantity:
                                item.quantity +
                                1,
                            })
                          )
                        }
                        className="bg-gray-100 px-3 py-1 text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        +
                      </button>

                    </div>

                    {/* REMOVE */}

                    <button
                      type="button"
                      disabled={cartLoading}
                      onClick={() =>
                        dispatch(
                          removeFromCart(
                            book._id
                          )
                        )
                      }
                      className="text-sm text-red-600 transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

          {/* ==================================
              ORDER SUMMARY
          ================================== */}

          <div className="h-fit rounded-lg border border-gray-200 bg-gray-50 p-6">

            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Order Summary
            </h2>

            {/* PRICE DETAILS */}

            <div className="mb-4 space-y-3 border-b border-gray-200 pb-4 text-sm text-gray-600">

              <div className="flex justify-between">

                <span>
                  Subtotal
                </span>

                <span>
                  $
                  {Number(
                    subtotal
                  ).toFixed(2)}
                </span>

              </div>

              <div className="flex justify-between">

                <span>
                  Shipping Estimate
                </span>

                <span>
                  $
                  {Number(
                    shipping
                  ).toFixed(2)}
                </span>

              </div>

            </div>

            {/* TOTAL */}

            <div className="mb-6 flex justify-between text-base font-bold text-gray-900">

              <span>
                Order Total
              </span>

              <span>
                $
                {Number(
                  total
                ).toFixed(2)}
              </span>

            </div>

            {/* ==================================
                CHECKOUT BUTTON
            ================================== */}

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default CartPage;