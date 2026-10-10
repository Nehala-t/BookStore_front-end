"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type {
  RootState,
  AppDispatch,
} from "../../redux/store";

import {
  fetchBooks,
  addWishList,
  viewWishList,
  addToCart,
} from "../../redux/slices/bookSlice";

// ======================================================
// BOOK TYPE
// ======================================================

interface Book {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  category: string;
  author: string;
  publisher: string;
  images: string[];
  stock: number;
  status: "available" | "unavailable";
}

// ======================================================
// BOOK IMAGE SLIDER
// ======================================================

function BookImageSlider({
  book,
}: {
  book: Book;
}) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!book.images || book.images.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === book.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [book.images]);

  if (!book.images || book.images.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-5xl">📖</span>

          <p className="mt-2 text-xs text-gray-400">
            No preview image
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <img
        src={book.images[currentImage]}
        alt={`${book.title} - image ${currentImage + 1}`}
        className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-105"
      />

      {book.images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {book.images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setCurrentImage(index);
              }}
              className={`h-2 w-2 rounded-full transition-all ${
                currentImage === index
                  ? "w-4 bg-white"
                  : "bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ======================================================
// BOOKS PAGE
// ======================================================

export default function Books() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const {
    books,
    loading: isLoading,
    error,
    pagination,
    wishlist,
  } = useSelector((state: RootState) => state.books);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [debouncedSearch, setDebouncedSearch] =
  useState("");

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search.trim());
  }, 400);

  return () => clearTimeout(timer);
}, [search]);

  // ======================================================
  // CART BOOKS
  // ======================================================

  const [cartBooks, setCartBooks] = useState<string[]>([]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 2;

  const totalPages = pagination?.totalPages || 1;

  // ======================================================
  // FETCH WISHLIST
  // ======================================================

  useEffect(() => {
    dispatch(viewWishList());
  }, [dispatch]);

  // ======================================================
  // WISHLIST TOGGLE
  // ======================================================

  const toggleWishlist = async (bookId: string) => {
    try {
      const result = await dispatch(addWishList(bookId)).unwrap();

      console.log("Wishlist result:", result);

      await dispatch(viewWishList()).unwrap();
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    }
  };

  // ======================================================
  // ADD TO CART
  // ======================================================

  const handleAddToCart = async (bookId: string) => {
    try {
      const result = await dispatch(addToCart(bookId));

      if (addToCart.fulfilled.match(result)) {
        setCartBooks((prev) =>
          prev.includes(bookId)
            ? prev
            : [...prev, bookId]
        );
      }
    } catch (error) {
      console.error("Failed to add book to cart:", error);
    }
  };

  // ======================================================
  // FETCH BOOKS
  // ======================================================

useEffect(() => {
  dispatch(
    fetchBooks({
      page: currentPage,
      limit: booksPerPage,
      search: debouncedSearch,
      category:
        selectedCategory === "All"
          ? ""
          : selectedCategory,
    })
  );
}, [
  dispatch,
  currentPage,
  debouncedSearch,
  selectedCategory,
]);

  // ======================================================
  // SEARCH CHANGE
  // ======================================================

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // ======================================================
  // CATEGORY CHANGE
  // ======================================================

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // ======================================================
  // GET UNIQUE CATEGORIES
  // ======================================================

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        books.map((book) => book.category)
      )
    );

    return ["All", ...uniqueCategories];
  }, [books]);

  

  // ======================================================
  // LOADING
  // ======================================================

  if (isLoading && books.length === 0) {

    return (
      <main className="min-h-screen bg-[#faf9f7]">
        <section className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-900 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="h-6 w-36 animate-pulse rounded-full bg-gray-800" />

            <div className="mt-6 h-14 w-3/4 max-w-xl animate-pulse rounded-2xl bg-gray-800" />

            <div className="mt-4 h-6 w-full max-w-2xl animate-pulse rounded-xl bg-gray-800" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="h-72 w-full animate-pulse rounded-2xl bg-gray-200" />

                <div className="space-y-4 pt-5">
                  <div className="h-3 w-20 animate-pulse rounded-full bg-gray-200" />

                  <div className="h-6 w-full animate-pulse rounded-xl bg-gray-200" />

                  <div className="h-4 w-28 animate-pulse rounded-lg bg-gray-200" />

                  <div className="flex items-center justify-between pt-2">
                    <div className="h-7 w-24 animate-pulse rounded-lg bg-gray-200" />

                    <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <div className="h-11 flex-1 animate-pulse rounded-xl bg-gray-200" />

                    <div className="h-11 flex-1 animate-pulse rounded-xl bg-gray-200" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-6">
        <div className="max-w-md rounded-3xl border border-red-100 bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl shadow-inner">
            ⚠️
          </div>

          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            Unable to load books
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              dispatch(
                fetchBooks({
                  page: currentPage,
                  limit: booksPerPage,
                  search,
                })
              )
            }
            className="mt-8 w-full rounded-2xl bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ======================================================
  // MAIN
  // ======================================================

  return (
    <main className="min-h-screen bg-[#faf9f7] selection:bg-orange-500 selection:text-white">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-900 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-orange-600/20 blur-[120px]" />

        <div className="pointer-events-none absolute -bottom-32 left-10 h-96 w-96 rounded-full bg-orange-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">
          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-400 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />

              Curated Literary Collection
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Stories waiting
              <br />

              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                to be discovered.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg">
              Explore our hand-picked catalog of timeless classics,
              gripping thrillers, and immersive tales designed for
              curious minds.
            </p>
          </div>

          {/* SEARCH */}

          <div className="mt-10 max-w-2xl">
            <div className="group relative">

              <svg
                className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                />
              </svg>

              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by title, author, or category..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-14 py-4 text-sm text-white shadow-2xl backdrop-blur-xl outline-none placeholder:text-gray-500 focus:border-orange-500 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/20"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTER */}

      <section className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6">

          <div className="scrollbar-none flex gap-2.5 overflow-x-auto py-4">

            {categories.map((category) => {
              const isActive =
                selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(category)
                  }
                  className={`whitespace-nowrap rounded-2xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-gray-900 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {category}
                </button>
              );
            })}

          </div>
        </div>
      </section>

      {/* BOOKS */}

      <section className="mx-auto max-w-7xl px-6 py-12 lg:py-16">

        {/* HEADER */}

        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
              Catalog View
            </p>

            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {selectedCategory === "All"
                ? "All Books"
                : selectedCategory}
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600">

            <span className="font-bold text-gray-900">
              {pagination?.totalBooks ??
                books.length}
            </span>

            {(pagination?.totalBooks ??
              books.length) === 1
              ? "book available"
              : "books available"}

          </div>
        </div>

        {/* NO RESULTS */}

        {books.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-24 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-4xl">
              📚
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              No matching books found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              We couldn't find any books matching your criteria.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setCurrentPage(1);
              }}
              className="mt-8 rounded-2xl bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <>

            {/* BOOK GRID */}

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {books.map((book) => {

                const hasDiscount =
                  book.discountPrice > 0 &&
                  book.discountPrice < book.price;

                const discountPercentage =
                  hasDiscount
                    ? Math.round(
                        ((book.price -
                          book.discountPrice) /
                          book.price) *
                          100
                      )
                    : 0;

                const isWishlisted =
                  wishlist.includes(book._id);

                const isInCart =
                  cartBooks.includes(book._id);

                return (
                  <article
                    key={book._id}
                    className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/30 hover:shadow-2xl"
                  >

                    {/* IMAGE */}

                    <div className="relative h-72 w-full overflow-hidden bg-gray-100">

                      <BookImageSlider
                        book={book}
                      />

                      {/* DISCOUNT */}

                      {hasDiscount && (
                        <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                          {discountPercentage}% OFF
                        </div>
                      )}

                      {/* WISHLIST */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleWishlist(book._id)
                        }
                        aria-label={
                          isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110"
                      >
                        <span
                          className={`text-3xl leading-none transition-all duration-300 ${
                            isWishlisted
                              ? "text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                        >
                          {isWishlisted
                            ? "♥"
                            : "♡"}
                        </span>
                      </button>
                    </div>

                    {/* CONTENT */}

                    <div className="flex flex-1 flex-col justify-between p-5">

                      <div>

                        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-600">
                          {book.category}
                        </p>

                        <h2 className="mt-1.5 line-clamp-2 min-h-[52px] text-base font-bold leading-snug text-gray-900 group-hover:text-orange-600">
                          {book.title}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                          by{" "}
                          <span className="font-semibold text-gray-800">
                            {book.author}
                          </span>
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {book.publisher}
                        </p>

                      </div>

                      <div className="mt-5 border-t border-gray-100 pt-4">

                        {/* PRICE + STOCK */}

                        <div className="flex items-center justify-between">

                          <div className="flex items-baseline gap-2">

                            {hasDiscount ? (
                              <>
                                <span className="text-xl font-black text-gray-900">
                                  ₹{book.discountPrice}
                                </span>

                                <span className="text-xs font-medium text-gray-400 line-through">
                                  ₹{book.price}
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-black text-gray-900">
                                ₹{book.price}
                              </span>
                            )}

                          </div>

                          {/* STOCK */}

                          <div>

                            {book.stock > 0 &&
                            book.status === "available" ? (

                              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">

                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                                {book.stock <= 5
                                  ? `Only ${book.stock} left`
                                  : "In stock"}

                              </div>

                            ) : (

                              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-500">

                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />

                                Out of stock

                              </div>

                            )}

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="mt-5 flex gap-2.5">

                          <Link
                            href={`/books/${book._id}`}
                            className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-center text-xs font-bold text-gray-700 shadow-sm transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                          >
                            View Details
                          </Link>

                          {/* ADD TO CART / GO TO CART */}

                          {isInCart ? (

                            <button
                              type="button"
                              onClick={() =>
                                router.push("/cart")
                              }
                              className="flex-1 rounded-xl bg-orange-600 px-3 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-orange-700"
                            >
                              Go to Cart
                            </button>

                          ) : (

                            <button
                              type="button"
                              disabled={
                                book.stock <= 0 ||
                                book.status !== "available"
                              }
                              onClick={() =>
                                handleAddToCart(
                                  book._id
                                )
                              }
                              className="flex-1 rounded-xl bg-gray-900 px-3 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                            >
                              Add to Cart
                            </button>

                          )}

                        </div>

                      </div>
                    </div>

                  </article>
                );
              })}

            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (

              <div className="mt-12 flex flex-wrap items-center justify-center gap-2">

                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev - 1
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {/* PAGE NUMBERS */}

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1
                ).map((page) => (

                  <button
                    key={page}
                    type="button"
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${
                      currentPage === page
                        ? "bg-gray-900 text-white shadow-md"
                        : "border border-gray-200 bg-white text-gray-700 hover:border-orange-500 hover:text-orange-600"
                    }`}
                  >
                    {page}
                  </button>

                ))}

                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev + 1
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>

              </div>

            )}

          </>

        )}

      </section>
    </main>
  );
}