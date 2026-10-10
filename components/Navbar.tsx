"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import api from "../lib/api";

import type { AppDispatch, RootState } from "../redux/store";
import { logout, setUser } from "../redux/slices/authSlice";

export default function Navbar() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    // ==========================================
    // REDUX AUTH USER
    // ==========================================

    const { user } = useSelector(
        (state: RootState) => state.auth
    );

    // ==========================================
    // PREVENT HYDRATION MISMATCH
    // ==========================================

    const [mounted, setMounted] = useState(false);

    // ==========================================
    // MOBILE MENU
    // ==========================================

    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false);

    // ==========================================
    // LOGIN STATE
    // ==========================================

    const isLoggedIn = mounted && !!user;

    const role = user?.role || "";

    // ==========================================
    // RESTORE LOGIN USER
    // ==========================================

    useEffect(() => {
        setMounted(true);

        const loggedInUser =
            localStorage.getItem("loggedInUser");

        console.log(
            "Navbar loggedInUser:",
            loggedInUser
        );

        if (loggedInUser) {
            try {
                const storedUser =
                    JSON.parse(loggedInUser);

                console.log(
                    "Navbar restored user:",
                    storedUser
                );

                dispatch(setUser(storedUser));
            } catch (error) {
                console.error(
                    "Invalid loggedInUser:",
                    error
                );

                localStorage.removeItem(
                    "loggedInUser"
                );

                localStorage.removeItem(
                    "accessToken"
                );

                dispatch(logout());
            }
        }
    }, [dispatch]);

    // ==========================================
    // DEBUG LOGIN STATE
    // ==========================================

    useEffect(() => {
        console.log("Navbar Redux user:", user);
        console.log("Navbar isLoggedIn:", isLoggedIn);
        console.log("Navbar role:", role);
    }, [user, isLoggedIn, role]);

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error(
                "Backend logout error:",
                error
            );
        } finally {
            localStorage.removeItem(
                "loggedInUser"
            );

            localStorage.removeItem(
                "accessToken"
            );

            dispatch(logout());

            setIsMobileMenuOpen(false);

            toast.info(
                "Logged out successfully!"
            );

            router.push("/login");
        }
    };

    // ==========================================
    // CLOSE MOBILE MENU
    // ==========================================

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6">

                {/* ======================================
                    MAIN NAVBAR
                ====================================== */}

                <div className="flex h-16 items-center justify-between">

                    {/* ====================================
                        LOGO
                    ==================================== */}

                    <Link
                        href="/"
                        onClick={closeMobileMenu}
                        className="text-2xl font-bold text-gray-900"
                    >
                        Book
                        <span className="text-orange-600">
                            Store
                        </span>
                    </Link>

                    {/* ====================================
                        DESKTOP NAVIGATION
                    ==================================== */}

                    <div className="hidden items-center gap-8 md:flex">

                        {/* HOME */}

                        <Link
                            href="/"
                            className="text-sm font-medium text-gray-700 transition hover:text-orange-600"
                        >
                            Home
                        </Link>

                        {/* USER - BOOKS */}

                        {mounted &&
                            role === "user" && (
                                <Link
                                    href="/books"
                                    className="text-sm font-medium text-gray-700 transition hover:text-orange-600"
                                >
                                    Books
                                </Link>
                            )}

                        {/* SELLER */}

                        {mounted &&
                            role === "seller" && (
                                <Link
                                    href="/sellerdashboard"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-orange-600"
                                >
                                    Seller Dashboard
                                </Link>
                            )}

                        {/* ADMIN */}

                        {mounted &&
                            role === "admin" && (
                                <Link
                                    href="/admindashboard"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-orange-600"
                                >
                                    Admin Dashboard
                                </Link>
                            )}

                        {/* ABOUT */}

                        <Link
                            href="/about"
                            className="text-sm font-medium text-gray-700 transition hover:text-orange-600"
                        >
                            About
                        </Link>
                    </div>

                    {/* ====================================
                        DESKTOP RIGHT SIDE
                    ==================================== */}

                    <div className="hidden items-center gap-2 md:flex">

                        {/* USER - WISHLIST */}

                        {mounted &&
                            role === "user" && (
                                <Link
                                    href="/wishlist"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-orange-600"
                                >
                                    ♡ Wishlist
                                </Link>
                            )}

                        {/* USER - CART */}

                        {mounted &&
                            role === "user" && (
                                <Link
                                    href="/cart"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-orange-600"
                                >
                                    🛒 Cart
                                </Link>
                            )}

                        {/* USER - ORDERS */}

                        {mounted &&
                            role === "user" && (
                                <Link
                                    href="/orderHistory"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-orange-600"
                                >
                                    📦 Orders
                                </Link>
                            )}

                        {/* ==================================
                            LOGIN / LOGOUT
                        ================================== */}

                        {isLoggedIn ? (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-orange-600"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                {/* LOGIN */}

                                <Link
                                    href="/login"
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-orange-600"
                                >
                                    Login
                                </Link>

                                {/* SIGN UP */}

                                <Link
                                    href="/signup"
                                    className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ====================================
                        MOBILE HAMBURGER
                    ==================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileMenuOpen(
                                (prev) => !prev
                            )
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 md:hidden"
                        aria-label="Toggle mobile menu"
                        aria-expanded={
                            isMobileMenuOpen
                        }
                    >
                        {isMobileMenuOpen ? (
                            <span className="text-2xl leading-none">
                                ×
                            </span>
                        ) : (
                            <span className="text-xl leading-none">
                                ☰
                            </span>
                        )}
                    </button>
                </div>

                {/* ======================================
                    MOBILE MENU
                ====================================== */}

                {isMobileMenuOpen && (
                    <div className="border-t border-gray-200 bg-white py-4 md:hidden">
                        <div className="flex flex-col gap-1">

                            {/* HOME */}

                            <Link
                                href="/"
                                onClick={closeMobileMenu}
                                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                            >
                                Home
                            </Link>

                            {/* USER - BOOKS */}

                            {mounted &&
                                role === "user" && (
                                    <Link
                                        href="/books"
                                        onClick={closeMobileMenu}
                                        className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                                    >
                                        Books
                                    </Link>
                                )}

                            {/* SELLER */}

                            {mounted &&
                                role === "seller" && (
                                    <Link
                                        href="/sellerdashboard"
                                        onClick={closeMobileMenu}
                                        className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                                    >
                                        Seller Dashboard
                                    </Link>
                                )}

                            {/* ADMIN */}

                            {mounted &&
                                role === "admin" && (
                                    <Link
                                        href="/admindashboard"
                                        onClick={closeMobileMenu}
                                        className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}

                            {/* ABOUT */}

                            <Link
                                href="/about"
                                onClick={closeMobileMenu}
                                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                            >
                                About
                            </Link>

                            {/* ==================================
                                USER ONLY LINKS
                            ================================== */}

                            {mounted &&
                                role === "user" && (
                                    <>
                                        {/* WISHLIST */}

                                        <Link
                                            href="/wishlist"
                                            onClick={closeMobileMenu}
                                            className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                                        >
                                            ♡ Wishlist
                                        </Link>

                                        {/* CART */}

                                        <Link
                                            href="/cart"
                                            onClick={closeMobileMenu}
                                            className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                                        >
                                            🛒 Cart
                                        </Link>

                                        {/* ORDERS */}

                                        <Link
                                            href="/orderHistory"
                                            onClick={closeMobileMenu}
                                            className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                                        >
                                            📦 Order History
                                        </Link>
                                    </>
                                )}

                            {/* DIVIDER */}

                            <div className="my-2 border-t border-gray-100" />

                            {/* ==================================
                                LOGIN / LOGOUT
                            ================================== */}

                            {isLoggedIn ? (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-orange-600"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    {/* LOGIN */}

                                    <Link
                                        href="/login"
                                        onClick={closeMobileMenu}
                                        className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                                    >
                                        Login
                                    </Link>

                                    {/* SIGN UP */}

                                    <Link
                                        href="/signup"
                                        onClick={closeMobileMenu}
                                        className="rounded-lg bg-orange-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-orange-700"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}