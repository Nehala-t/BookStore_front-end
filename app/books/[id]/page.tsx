"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  User,
  Bookmark,
  Share2,
  CheckCircle,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import type {
  AppDispatch,
  RootState,
} from "../../../redux/store";

import {
  viewSingleBook,
} from "../../../redux/slices/bookSlice";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 16: params is a Promise
  const { id } = use(params);

  const dispatch = useDispatch<AppDispatch>();

  const {
    selectedBook: book,
    singleBookLoading,
    error,
  } = useSelector(
    (state: RootState) => state.books
  );

  // ==========================================
  // SELECTED IMAGE
  // ==========================================

  const [selectedImage, setSelectedImage] =
    useState(0);

  // ==========================================
  // FETCH SINGLE BOOK
  // ==========================================

  useEffect(() => {
    dispatch(viewSingleBook(id));

    // Reset selected image when opening another book
    setSelectedImage(0);
  }, [dispatch, id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (singleBookLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="text-slate-600">
            Loading book details...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">

        <p className="font-medium text-red-600">
          {error}
        </p>

        <Link
          href="/books"
          className="text-indigo-600 hover:underline"
        >
          Back to Books
        </Link>

      </div>
    );
  }

  // ==========================================
  // BOOK NOT FOUND
  // ==========================================

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">

        <p className="text-slate-600">
          Book not found.
        </p>

        <Link
          href="/books"
          className="text-indigo-600 hover:underline"
        >
          Back to Books
        </Link>

      </div>
    );
  }

  // ==========================================
  // IMAGES
  // ==========================================

  const images =
    book.images &&
    book.images.length > 0
      ? book.images
      : ["/placeholder-book.png"];

  // Make sure selected image is valid
  const currentImage =
    images[selectedImage] ||
    images[0];

  // ==========================================
  // NEXT IMAGE
  // ==========================================

  const handleNextImage = () => {
    setSelectedImage((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1
    );
  };

  // ==========================================
  // PREVIOUS IMAGE
  // ==========================================

  const handlePreviousImage = () => {
    setSelectedImage((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );
  };

  // ==========================================
  // AVAILABILITY
  // ==========================================

  const isAvailable =
    book.stock > 0 &&
    book.status === "available";

  // ==========================================
  // DISCOUNT
  // ==========================================

  const hasDiscount =
    book.discountPrice !== undefined &&
    book.discountPrice > 0 &&
    book.discountPrice < book.price;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">

        {/* Back Button */}

        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />

          Back to Library
        </Link>


        {/* Header Actions */}

        <div className="flex items-center gap-3">

          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            title="Bookmark"
          >
            <Bookmark className="h-5 w-5" />
          </button>


          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            title="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>

        </div>

      </header>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="mx-auto max-w-6xl space-y-8 p-6 lg:p-10">


        {/* ======================================
            BOOK OVERVIEW
        ====================================== */}

        <div className="flex flex-col items-start gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row lg:p-8">


          {/* ====================================
              BOOK IMAGES
          ==================================== */}

          <div className="w-full flex-shrink-0 md:w-72">

            {/* ================================
                MAIN IMAGE
            ================================= */}

            <div className="relative h-96 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 shadow-md">

              <img
                src={currentImage}
                alt={book.title}
                className="h-full w-full object-cover transition-all duration-300"
              />


              {/* IMAGE COUNTER */}

              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {selectedImage + 1} /{" "}
                  {images.length}
                </div>
              )}


              {/* PREVIOUS BUTTON */}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousImage}
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}


              {/* NEXT BUTTON */}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}

            </div>


            {/* =================================
                THUMBNAILS
            ================================== */}

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">

                {images.map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      className={`relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        selectedImage === index
                          ? "border-indigo-600 ring-2 ring-indigo-100"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >

                      <img
                        src={image}
                        alt={`${book.title} ${
                          index + 1
                        }`}
                        className="h-full w-full object-cover"
                      />

                    </button>
                  )
                )}

              </div>
            )}

          </div>


          {/* ====================================
              BOOK INFORMATION
          ==================================== */}

          <div className="flex-1 space-y-4">


            {/* CATEGORY + STATUS */}

            <div className="flex flex-wrap items-center justify-between gap-2">

              {/* Category */}

              <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                {book.category}
              </span>


              {/* Availability */}

              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >

                <CheckCircle className="h-3 w-3" />

                {isAvailable
                  ? "Available"
                  : "Out of Stock"}

              </span>

            </div>


            {/* TITLE + AUTHOR */}

            <div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {book.title}
              </h1>

              <p className="mt-1 text-lg text-slate-500">
                by {book.author}
              </p>

            </div>


            {/* AUTHOR */}

            <div className="flex items-center gap-2 border-t border-slate-100 pt-2 text-sm">

              <User className="h-4 w-4 text-slate-400" />

              <span className="font-medium">
                {book.author}
              </span>

            </div>


            {/* =================================
                PRICE
            ================================== */}

            <div className="border-y border-slate-100 py-4">

              {hasDiscount ? (

                <div className="flex items-center gap-3">

                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{book.discountPrice}
                  </span>

                  <span className="text-lg text-slate-400 line-through">
                    ₹{book.price}
                  </span>

                  <span className="text-sm font-medium text-green-600">
                    Save ₹
                    {book.price -
                      (book.discountPrice ??
                        0)}
                  </span>

                </div>

              ) : (

                <span className="text-2xl font-bold text-indigo-600">
                  ₹{book.price}
                </span>

              )}

            </div>


            {/* =================================
                BOOK STATS
            ================================== */}

            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 py-4 sm:grid-cols-4">


              {/* Published */}

              <div className="space-y-1">

                <span className="flex items-center gap-1 text-xs text-slate-400">

                  <Calendar className="h-3.5 w-3.5" />

                  Published

                </span>

                <p className="text-sm font-semibold text-slate-900">

                  {book.publicationDate
                    ? new Date(
                        book.publicationDate
                      ).toLocaleDateString()
                    : "N/A"}

                </p>

              </div>


              {/* Pages */}

              <div className="space-y-1">

                <span className="flex items-center gap-1 text-xs text-slate-400">

                  <BookOpen className="h-3.5 w-3.5" />

                  Pages

                </span>

                <p className="text-sm font-semibold text-slate-900">
                  {book.pages ?? "N/A"}
                </p>

              </div>


              {/* Language */}

              <div className="space-y-1">

                <span className="flex items-center gap-1 text-xs text-slate-400">

                  <Clock className="h-3.5 w-3.5" />

                  Language

                </span>

                <p className="text-sm font-semibold text-slate-900">
                  {book.language ??
                    "English"}
                </p>

              </div>


              {/* Stock */}

              <div className="space-y-1">

                <span className="flex items-center gap-1 text-xs text-slate-400">

                  <Layers className="h-3.5 w-3.5" />

                  Stock

                </span>

                <p className="text-sm font-semibold text-slate-900">
                  {book.stock}
                </p>

              </div>

            </div>


            {/* =================================
                ISBN + PUBLISHER
            ================================== */}

            <div className="space-y-2 text-sm">

              <p>

                <span className="font-semibold">
                  ISBN:
                </span>{" "}

                {book.isbn}

              </p>

              <p>

                <span className="font-semibold">
                  Publisher:
                </span>{" "}

                {book.publisher ?? "N/A"}

              </p>

            </div>


            {/* =================================
                ACTION BUTTONS
            ================================== */}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">

              {/* ADD TO CART */}

              <button
                type="button"
                disabled={!isAvailable}
                className={`flex-1 rounded-xl px-6 py-3 text-center font-medium shadow-sm transition-colors ${
                  isAvailable
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "cursor-not-allowed bg-slate-200 text-slate-500"
                }`}
              >
                {isAvailable
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>


              {/* READ SAMPLE */}

              <button
                type="button"
                className="rounded-xl bg-slate-100 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                Read Sample
              </button>

            </div>

          </div>

        </div>


        {/* ======================================
            DESCRIPTION + INFORMATION
        ====================================== */}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">


          {/* DESCRIPTION */}

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 lg:p-8">

            <h2 className="text-xl font-bold text-slate-900">
              About this book
            </h2>

            <p className="text-sm leading-relaxed text-slate-600 lg:text-base">
              {book.description}
            </p>

          </div>


          {/* BOOK INFORMATION */}

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">

            <h2 className="text-xl font-bold text-slate-900">
              Book Information
            </h2>

            <div className="space-y-3 text-sm text-slate-600">

              <p>
                <span className="font-semibold text-slate-900">
                  Category:
                </span>{" "}
                {book.category}
              </p>

              <p>
                <span className="font-semibold text-slate-900">
                  Author:
                </span>{" "}
                {book.author}
              </p>

              <p>
                <span className="font-semibold text-slate-900">
                  ISBN:
                </span>{" "}
                {book.isbn}
              </p>

              <p>
                <span className="font-semibold text-slate-900">
                  Publisher:
                </span>{" "}
                {book.publisher ??
                  "N/A"}
              </p>

              <p>
                <span className="font-semibold text-slate-900">
                  Language:
                </span>{" "}
                {book.language ??
                  "English"}
              </p>

              <p>
                <span className="font-semibold text-slate-900">
                  Pages:
                </span>{" "}
                {book.pages ?? "N/A"}
              </p>

              <p>
                <span className="font-semibold text-slate-900">
                  Available Stock:
                </span>{" "}
                {book.stock}
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}