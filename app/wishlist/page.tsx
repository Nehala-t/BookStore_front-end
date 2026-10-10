"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";

import type {
  RootState,
  AppDispatch,
} from "../../redux/store";

import {
  viewWishList,
  clearWishList,
  removeWishList,
  addToCart,
} from "../../redux/slices/bookSlice";

const WishlistPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  // ======================================================
  // GET BOOKS + WISHLIST FROM REDUX
  // ======================================================

  const {
    wishlistBooks,
    wishlistLoading,
  } = useSelector(
    (state: RootState) => state.books
  );

  // ======================================================
  // STORE BOOKS THAT WERE ADDED TO CART
  // ======================================================

  const [cartBooks, setCartBooks] = useState<
    string[]
  >([]);

  // ======================================================
  // FETCH WISHLIST FROM DATABASE
  // ======================================================

  useEffect(() => {
    dispatch(viewWishList());
  }, [dispatch]);

  // ======================================================
  // REMOVE SINGLE BOOK
  // ======================================================

  const handleRemove = async (bookId: string) => {
    try {
      await dispatch(
        removeWishList(bookId)
      );
    } catch (error) {
      console.error(
        "Failed to remove wishlist item:",
        error
      );
    }
  };

  // ======================================================
  // CLEAR ALL
  // ======================================================

  const handleClearWishlist = async () => {
    try {
      await dispatch(clearWishList());
    } catch (error) {
      console.error(
        "Failed to clear wishlist:",
        error
      );
    }
  };

  // ======================================================
  // ADD TO CART
  // ======================================================

const handleAddToCart = async (bookId: string) => {
  try {
    const result = await dispatch(
      addToCart(bookId)
    );

    if (addToCart.fulfilled.match(result)) {
      setCartBooks((prev) =>
        prev.includes(bookId)
          ? prev
          : [...prev, bookId]
      );
    }
  } catch (error) {
    console.error(
      "Failed to add book to cart:",
      error
    );
  }
};

  // ======================================================
  // LOADING
  // ======================================================

  if (wishlistLoading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-gray-200" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="h-52 animate-pulse rounded-xl bg-gray-200" />

                  <div className="mt-4 h-5 animate-pulse rounded bg-gray-200" />

                  <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-200" />

                  <div className="mt-4 h-6 w-20 animate-pulse rounded bg-gray-200" />
                </div>
              )
            )}
          </div>
        </div>
      </main>
    );
  }

  // ======================================================
  // MAIN
  // ======================================================

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Your Collection
            </p>

            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              My Wishlist
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Books you've saved for later.
            </p>
          </div>

          {/* CLEAR ALL */}

          {wishlistBooks.length > 0 && (
            <button
              type="button"
              onClick={handleClearWishlist}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              Clear All Wishlist
            </button>
          )}
        </div>

        {/* ==================================================
            EMPTY WISHLIST
        ================================================== */}

        {wishlistBooks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-24 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-4xl">
              ♡
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              Save books you love and come back to them later.
            </p>

            <Link
              href="/books"
              className="mt-8 inline-flex rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Explore Books
            </Link>

          </div>
        ) : (

          /* ==================================================
             WISHLIST GRID
          ================================================== */

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {wishlistBooks.map(
              (book) => {

                const hasDiscount =
                  book.discountPrice !== undefined &&
                  book.discountPrice > 0 &&
                  book.discountPrice < book.price;

                const isInCart =
                  cartBooks.includes(
                    book._id
                  );

                return (
                  <article
                    key={book._id}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    {/* ==================================================
                        IMAGE
                    ================================================== */}

                    <div className="relative h-60 overflow-hidden bg-gray-100">

                      {book.images &&
                      book.images.length > 0 ? (
                        <img
                          src={book.images[0]}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-5xl">
                            📖
                          </span>
                        </div>
                      )}

                      {/* HEART */}

                      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-md">

                        <span className="text-2xl leading-none text-red-500">
                          ♥
                        </span>

                      </div>

                      {/* CATEGORY */}

                      <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                        {book.category}
                      </div>

                    </div>

                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    <div className="flex flex-1 flex-col justify-between p-5">

                      <div>

                        <h2 className="line-clamp-2 text-lg font-bold text-gray-900">
                          {book.title}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          by{" "}
                          <span className="font-semibold text-gray-700">
                            {book.author}
                          </span>
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {book.publisher}
                        </p>

                        {/* PRICE */}

                        <div className="mt-4 flex items-baseline gap-2">

                          {hasDiscount ? (
                            <>
                              <span className="text-xl font-black text-gray-900">
                                ₹
                                {book.discountPrice}
                              </span>

                              <span className="text-sm text-gray-400 line-through">
                                ₹
                                {book.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-black text-gray-900">
                              ₹
                              {book.price}
                            </span>
                          )}

                        </div>

                      </div>

                      {/* ==================================================
                          ACTIONS
                      ================================================== */}

                      <div className="mt-5 flex flex-col gap-2.5">

                        {/* VIEW DETAILS */}

                        <Link
                          href={`/books/${book._id}`}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                        >
                          View Details
                        </Link>

                        {/* ==================================================
                            CART BUTTON
                        ================================================== */}

                       {isInCart ? (
  <button
    type="button"
    onClick={async () => {
      const result = await dispatch(
        removeWishList(book._id)
      );

      if (removeWishList.fulfilled.match(result)) {
        window.location.href = "/cart";
      }
    }}
    className="w-full rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
  >
    Go to Cart
  </button>
) : (
  <button
    type="button"
    onClick={() =>
      handleAddToCart(book._id)
    }
    className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
  >
    Move to Cart
  </button>
)}

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(
                              book._id
                            )
                          }
                          className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Remove from Wishlist
                        </button>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>
    </main>
  );
};

export default WishlistPage;