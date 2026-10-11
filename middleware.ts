import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/about",
  
  
];

const adminRoutes = [
  "/admindashboard",
];

const sellerRoutes = [
  "/sellerdashboard",
  "/addbook",
  "/sellerprofile",
  "/sellerorders",
  "/sellerbooks",
  "/sellersingleorder",
  "/updatebook",
];

const userRoutes = [
  "/books",
  "/checkout",
  "/customerprofile",
  "/viewbooks",
  "/vieworders",
  "/cart",
  "/wishlist",
];

const sharedRoutes = [
  "/viewonebook",
  "/editprofile",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;
console.log("MIDDLEWARE:", {
    pathname,
    hasToken: !!token,
    role,
  });
  // =====================================
  // Logged-in user cannot access Login/Register
  // =====================================

  if (
    token &&
    (pathname === "/login" || pathname === "/signup")
  ) {
    if (role === "seller") {
      return NextResponse.redirect(
        new URL("/sellerbooks", request.url)
      );
    }

    if (role === "user") {
      return NextResponse.redirect(
        new URL("/books", request.url)
      );
    }

    if (role === "admin") {
      return NextResponse.redirect(
        new URL("/admindashboard", request.url)
      );
    }
  }

  // =====================================
  // Check Public Routes
  // =====================================

  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  // =====================================
  // Not logged in
  // Cannot access protected pages
  // =====================================

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // =====================================
  // Shared routes
  // Accessible to all logged-in users
  // =====================================

  const isSharedRoute = sharedRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  if (!isSharedRoute && token) {

    // =====================================
    // Admin routes
    // =====================================

    if (
      adminRoutes.some(
        (route) =>
          pathname === route ||
          pathname.startsWith(`${route}/`)
      ) &&
      role !== "admin"
    ) {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }

    // =====================================
    // Seller routes
    // =====================================

    if (
      sellerRoutes.some(
        (route) =>
          pathname === route ||
          pathname.startsWith(`${route}/`)
      ) &&
      role !== "seller"
    ) {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }

    // =====================================
    // User routes
    // =====================================

    if (
      userRoutes.some(
        (route) =>
          pathname === route ||
          pathname.startsWith(`${route}/`)
      ) &&
      role !== "user"
    ) {
      return NextResponse.redirect(
        new URL("/unauthorized", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|assets|api).*)",
  ],
};
