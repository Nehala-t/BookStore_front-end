
import Link from "next/link";

const categories = [
  "Fiction",
  "Romance",
  "Mystery",
  "Science",
  "Biography",
  "Self Help",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}


    <section className="bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 lg:py-28">

        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">

          {/* Left Content */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">

            <p className="mb-4 text-xs sm:text-sm font-semibold uppercase tracking-widest text-orange-600">
              Welcome to BookStore
            </p>

            <h1 className="max-w-2xl text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 lg:text-6xl">
              Find your next
              <span className="text-orange-600"> favorite book.</span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              Explore a world of stories, knowledge, and imagination.
              Discover books from different categories and find something
              you will love to read.
            </p>

            {/* Search Bar (Responsive Stack on Mobile) */}
            <div className="mt-6 sm:mt-8 flex w-full max-w-xl flex-col sm:flex-row overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <input
                type="text"
                placeholder="Search books or authors..."
                className="min-w-0 flex-1 px-4 sm:px-5 py-3 sm:py-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                className="bg-orange-600 px-6 py-3 sm:py-4 text-sm font-semibold text-white transition hover:bg-orange-700 active:scale-[0.98]"
              >
                Search
              </button>
            </div>

            {/* Buttons (Stacked on Mobile, Row on Larger Screens) */}
            <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
              <Link
                href="/books"
                className="rounded-lg bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-orange-600 shadow-sm"
              >
                Browse Books
              </Link>
             
            </div>

          </div>

          {/* Right Illustration */}
          <div className="flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative flex h-[300px] sm:h-[380px] w-full max-w-lg items-center justify-center overflow-hidden rounded-3xl bg-orange-50">

              {/* Decorative circles */}
              <div className="absolute -right-20 -top-20 h-48 sm:h-56 w-48 sm:w-56 rounded-full bg-orange-200" />
              <div className="absolute -bottom-24 -left-20 h-56 sm:h-64 w-56 sm:w-64 rounded-full bg-orange-100" />

              {/* Books illustration */}
              <div className="relative z-10 flex items-end gap-1.5 sm:gap-2 scale-90 sm:scale-100">
                <div className="h-40 sm:h-48 w-16 sm:w-20 rounded-md bg-gray-900 shadow-lg" />
                <div className="h-52 sm:h-60 w-20 sm:w-24 rounded-md bg-orange-600 shadow-lg" />
                <div className="h-32 sm:h-40 w-16 sm:w-20 rounded-md bg-gray-700 shadow-lg" />
                <div className="h-44 sm:h-52 w-20 sm:w-24 rounded-md bg-white shadow-lg ring-1 ring-gray-200" />
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>


      {/* ================= CATEGORIES ================= */}
      <section className="border-y border-gray-200 bg-gray-50">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="mb-10 flex items-end justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                Browse Categories
              </h2>

              <p className="mt-2 text-gray-600">
                Find books based on your favorite topics.
              </p>
            </div>

            <Link
              href="/categories"
              className="hidden text-sm font-semibold text-orange-600 hover:text-orange-700 sm:block"
            >
              View all →
            </Link>

          </div>


          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

            {categories.map((category) => (
              <Link
                key={category}
                href={`/books?category=${category}`}
                className="group rounded-xl border border-gray-200 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
              >

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-xl transition group-hover:bg-orange-100">
                  📚
                </div>

                <p className="mt-4 text-sm font-semibold text-gray-800 group-hover:text-orange-600">
                  {category}
                </p>

              </Link>
            ))}

          </div>

        </div>

      </section>


      {/* ================= BOOKS SECTION ================= */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-16">

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


          {/* Backend books will appear here */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >

                {/* Image Placeholder */}
                <div className="flex h-64 items-center justify-center bg-gray-100">

                  <div className="text-center">

                    <div className="text-4xl">
                      📖
                    </div>

                    <p className="mt-2 text-sm text-gray-400">
                      Book image
                    </p>

                  </div>

                </div>


                {/* Content Placeholder */}
                <div className="p-5">

                  <div className="h-4 w-20 rounded bg-gray-100" />

                  <div className="mt-3 h-5 w-40 rounded bg-gray-100" />

                  <div className="mt-2 h-4 w-28 rounded bg-gray-100" />

                  <div className="mt-5 h-10 w-full rounded-lg bg-gray-100" />

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* ================= WHY BOOKSTORE ================= */}
      <section className="bg-gray-50">

        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
              Why BookStore?
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Everything you need for your reading journey
            </h2>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Feature 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                📚
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Large Collection
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Explore books across different genres, categories, and
                interests.
              </p>

            </div>


            {/* Feature 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                ❤️
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Save Your Favorites
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Add books to your wishlist and keep track of the books you
                want to read.
              </p>

            </div>


            {/* Feature 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                🛒
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Easy Shopping
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Add books to your cart and manage your orders easily from
                your account.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-6 py-16">

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

