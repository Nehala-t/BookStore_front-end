import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-gray-900 text-white">

      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold"
            >
              Book<span className="text-orange-500">Store</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
              Discover your next favorite book and explore stories
              from authors around the world.
            </p>
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>

            <div className="mt-4 space-y-3">

              <Link
                href="/"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Home
              </Link>

              <Link
                href="/books"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Books
              </Link>

              {/* <Link
                href="/categories"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Categories
              </Link> */}

              <Link
                href="/about"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                About
              </Link>

            </div>
          </div>


          {/* Customer */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Customer
            </h3>

            <div className="mt-4 space-y-3">

              <Link
                href="/wishlist"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Wishlist
              </Link>

              <Link
                href="/cart"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Cart
              </Link>

              <Link
                href="/orderHistory"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Order History
              </Link>

              <Link
                href="/contact"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Contact Us
              </Link>

            </div>
          </div>


          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Account
            </h3>

            <div className="mt-4 space-y-3">

              <Link
                href="/login"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Sign Up
              </Link>

              <Link
                href="/privacy"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="block text-sm text-gray-400 transition hover:text-orange-500"
              >
                Terms & Conditions
              </Link>

            </div>
          </div>

        </div>


        {/* Bottom */}
        <div className="mt-10 border-t border-gray-800 pt-6">

          <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()} BookStore. All rights reserved.
            </p>

            <p>
              Made with ❤️ for book lovers.
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
}




