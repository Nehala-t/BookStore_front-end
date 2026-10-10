"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  ToastContainer,
  toast,
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import {
  loginSchema,
  type LoginFormData,
} from "../../schemas/loginSchema";

import type {
  RootState,
  AppDispatch,
} from "../../redux/store";

import { loginUser } from "../../redux/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();

  const dispatch =
    useDispatch<AppDispatch>();

  const {
    loading: isSubmitting,
  } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  // =====================================================
  // LOGIN
  // =====================================================

  const onSubmit = async (
    formData: LoginFormData
  ) => {
    console.log(
      "Login data sent:",
      formData
    );

    try {
      const result = await dispatch(
        loginUser(formData)
      ).unwrap();

      console.log(
        "Login Response:",
        result
      );

      // Make sure user data exists
      if (!result.data) {
        toast.error(
          "Login failed. User information not found."
        );

        return;
      }

      // =================================================
      // SAVE USER ONLY AFTER SUCCESSFUL LOGIN
      // =================================================

      localStorage.setItem(
  "loggedInUser",
  JSON.stringify({
    ...result.data,
    accessToken: result.data?.accessToken,
  })
);

      // =================================================
      // SUCCESS TOAST
      // =================================================

      toast.success(
        result.message ||
          "Login successful!"
      );

      // =================================================
      // REDIRECT BASED ON ROLE
      // =================================================

      const role =
        result.data.role;

      if (role === "admin") {
        router.push(
          "/admindashboard"
        );
      } else if (
        role === "seller"
      ) {
        router.push(
          "/sellerdashboard"
        );
      } else if (
        role === "user"
      ) {
        router.push("/books");
      } else {
        router.push("/books");
      }

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      // =================================================
      // ONLY SHOW TOAST FOR LOGIN ERRORS
      // =================================================

      toast.error(
        typeof error === "string"
          ? error
          : "Login failed. Please try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">

      {/* =================================================
          TOAST CONTAINER
      ================================================= */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <div className="mx-auto max-w-md">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 text-center">

          <Link
            href="/"
            className="text-3xl font-bold text-gray-900"
          >
            Book
            <span className="text-orange-600">
              Store
            </span>
          </Link>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to continue exploring
            our books.
          </p>

        </div>

        {/* =================================================
            FORM CARD
        ================================================= */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="space-y-5"
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                  errors.email
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
              />

              {errors.email && (
                <p className="mt-1.5 text-sm text-red-500">
                  {
                    errors.email
                      .message
                  }
                </p>
              )}

            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register(
                  "password"
                )}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                  errors.password
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
              />

              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {
                    errors.password
                      .message
                  }
                </p>
              )}

            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={
                isSubmitting
              }
              className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Logging in..."
                : "Login"}
            </button>

          </form>

          {/* =================================================
              SIGNUP LINK
          ================================================= */}

          <p className="mt-6 text-center text-sm text-gray-500">

            Don't have an account?{" "}

            <Link
              href="/signup"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Create Account
            </Link>

          </p>

        </div>
      </div>

    </main>
  );
}