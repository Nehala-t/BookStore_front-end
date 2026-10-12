"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "@/redux/store";
import { fetchBooks } from "../redux/slices/bookSlice";

export default function Home() {
const dispatch = useDispatch<AppDispatch>();

const { books, loading, error } = useSelector(
(state: RootState) => state.books
);

useEffect(() => {
dispatch(fetchBooks({ page: 1, limit: 4 }));
}, [dispatch]);

const featuredBooks = books.slice(0, 4);

return ( <main className="min-h-screen bg-gray-50">
{/* HERO */} <section className="overflow-hidden bg-white"> <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:py-28"> <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"> <div className="flex flex-col items-center text-center lg:items-start lg:text-left"> <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-orange-600 sm:text-sm">
Welcome to BookStore </p>

```
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Find your next
            <span className="text-orange-600">
              {" "}favorite book.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-gray-600 sm:mt-6 sm:text-lg sm:leading-8">
            Explore a world of stories, knowledge, and imagination.
            Discover books from different categories and find something
            you will love to read.
          </p>

          <Link
            href="/books"
            className="mt-7 rounded-lg bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
          >
            Browse Books
          </Link>
        </div>

        <div className="mt-4 flex justify-center lg:mt-0 lg:justify-end">
          <div className="relative flex h-[300px] w-full max-w-lg items-center justify-center overflow-hidden rounded-3xl bg-orange-50 sm:h-[380px]">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-200" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-orange-100" />

            <div className="relative z-10 flex scale-90 items-end gap-2 sm:scale-100">
              <div className="h-40 w-16 rounded-md bg-gray-900 shadow-lg sm:h-48 sm:w-20" />
              <div className="h-52 w-20 rounded-md bg-orange-600 shadow-lg sm:h-60 sm:w-24" />
              <div className="h-32 w-16 rounded-md bg-gray-700 shadow-lg sm:h-40 sm:w-20" />
              <div className="h-44 w-20 rounded-md bg-white shadow-lg ring-1 ring-gray-200 sm:h-52 sm:w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* FEATURED BOOKS */}
  <section className="bg-white">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
            Our Collection
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Featured Books
          </h2>

          <p className="mt-2 text-gray-600">
            Discover books from our collection.
          </p>
        </div>

        <Link
          href="/books"
          className="text-sm font-semibold text-orange-600 hover:text-orange-700"
        >
          View all books →
        </Link>
      </div>

      {loading && books.length === 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="animate-pulse overflow-hidden rounded-2xl border border-gray-200"
            >
              <div className="h-64 bg-gray-100" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-5 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-10 rounded-lg bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-10 rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            Unable to load featured books.
          </p>
          <button
            onClick={() =>
              dispatch(fetchBooks({ page: 1, limit: 4 }))
            }
            className="mt-3 font-semibold text-orange-600 hover:text-orange-700"
          >
            Try again
          </button>
        </div>
      ) : featuredBooks.length === 0 ? (
        <div className="mt-10 rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-gray-600">
            No books are available at the moment.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBooks.map((book) => {
            const imageUrl =
              book.images?.[0] || book.image;

            const displayPrice =
              book.discountPrice != null &&
              book.discountPrice > 0 &&
              book.discountPrice < book.price
                ? book.discountPrice
                : book.price;

            return (
              <article
                key={book._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link
                  href={`/viewonebook/${book._id}`}
                  className="block"
                >
                  <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gray-100 p-4">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={book.title}
                        width={300}
                        height={350}
                        unoptimized
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-5xl">📖</span>
                        <p className="mt-2 text-sm text-gray-400">
                          No image available
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                      {book.category}
                    </p>

                    <h3 className="mt-2 line-clamp-2 min-h-12 font-bold text-gray-900 transition group-hover:text-orange-600">
                      {book.title}
                    </h3>

                    <p className="mt-2 truncate text-sm text-gray-500">
                      By {book.author}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{displayPrice}
                      </span>

                      {displayPrice < book.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{book.price}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 block w-full rounded-lg bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white transition group-hover:bg-orange-600">
                      View Details
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/books"
          className="inline-block rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:border-orange-600 hover:bg-orange-50 hover:text-orange-600"
        >
          Explore All Books →
        </Link>
      </div>
    </div>
  </section>

  {/* WHY BOOKSTORE */}
  <section className="bg-gray-50">
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
          Why BookStore?
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          Everything you need for your reading journey
        </h2>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: "📚",
            title: "Large Collection",
            description:
              "Explore books across different genres, categories, and interests.",
          },
          {
            icon: "❤️",
            title: "Save Your Favorites",
            description:
              "Add books to your wishlist and keep track of the books you want to read.",
          },
          {
            icon: "🛒",
            title: "Easy Shopping",
            description:
              "Add books to your cart and manage your orders easily from your account.",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-gray-200 bg-white p-7"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
              {feature.icon}
            </div>

            <h3 className="mt-5 text-lg font-bold text-gray-900">
              {feature.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* CTA */}
  <section className="bg-white">
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl bg-gray-900 px-8 py-14 text-center sm:px-16">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to find your next book?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-gray-400">
          Browse our collection and discover something worth reading.
        </p>

        <Link
          href="/books"
          className="mt-7 inline-block rounded-lg bg-orange-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          Explore Books
        </Link>
      </div>
    </div>
  </section>
</main>

);
}
