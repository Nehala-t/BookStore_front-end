"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  signupSchema,
  type SignupFormData,
} from "../../schemas/signupSchema";

import type {
  RootState,
  AppDispatch,
} from "../../redux/store";

import { signupUser } from "../../redux/slices/authSlice";

export default function SignupPage() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const {
    loading: isSubmitting,
    error: serverError,
    successMessage,
  } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema),

    defaultValues: {
      role: "user",
    },
  });

  const onSubmit = async (
    formData: SignupFormData
  ) => {
    const {
      confirmPassword,
      ...signupData
    } = formData;

    console.log(
      "Signup data sent:",
      signupData
    );

    try {
      const result = await dispatch(
        signupUser(signupData)
      ).unwrap();

      console.log(
        "Signup Response:",
        result
      );

      // ==========================================
      // SAVE LOGGED-IN USER
      // ==========================================

      if (result.data) {
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(result.data)
        );

        console.log(
          "Saved loggedInUser:",
          result.data
        );
      }

      // ==========================================
      // SUCCESS TOAST
      // ==========================================

      toast.success(
        "Account created successfully."
      );

      // ==========================================
      // REDIRECT BASED ON ROLE
      // ==========================================

      const role = result.data?.role;

      setTimeout(() => {
        if (role === "admin") {
          router.push("/admindashboard");
        } else if (role === "seller") {
          router.push("/sellerdashboard");
        } else {
          router.push("/books");
        }
      }, 1000);

    } catch (error) {
      console.error(
        "Signup Error:",
        error
      );

      toast.error(
        typeof error === "string"
          ? error
          : "Registration failed. Please try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">

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

        {/* Header */}

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
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign up to start exploring our books.
          </p>

        </div>

        {/* Form Card */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Server Error */}

          {serverError && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          {/* Success Message */}

          {successMessage && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {successMessage}
            </div>
          )}

          {/* Signup Form */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* First Name + Last Name */}

            <div className="grid gap-5 sm:grid-cols-2">

              {/* First Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  First Name
                </label>

                <input
                  type="text"
                  autoComplete="given-name"
                  placeholder="Enter first name"
                  {...register("firstName")}
                  className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                    errors.firstName
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                  }`}
                />

                {errors.firstName && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.firstName.message}
                  </p>
                )}

              </div>

              {/* Last Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Last Name
                </label>

                <input
                  type="text"
                  autoComplete="family-name"
                  placeholder="Enter last name"
                  {...register("lastName")}
                  className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                    errors.lastName
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                  }`}
                />

                {errors.lastName && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.lastName.message}
                  </p>
                )}

              </div>

            </div>

            {/* Email */}

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
                  {errors.email.message}
                </p>
              )}

            </div>

            {/* Password */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                autoComplete="new-password"
                placeholder="Enter password"
                {...register("password")}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                  errors.password
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
              />

              {errors.password && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}

            </div>

            {/* Confirm Password */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
              />

              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}

            </div>

            {/* Account Type */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Account Type
              </label>

              <select
                {...register("role")}
                className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 ${
                  errors.role
                    ? "border-red-400 focus:ring-red-100"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-100"
                }`}
              >

                <option value="user">
                  User
                </option>

                <option value="seller">
                  Seller
                </option>

              </select>

              {errors.role && (
                <p className="mt-1.5 text-sm text-red-500">
                  {errors.role.message}
                </p>
              )}

            </div>

            {/* Submit Button */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login Link */}

          <p className="mt-6 text-center text-sm text-gray-500">

            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Login
            </Link>

          </p>

        </div>
      </div>
    </main>
  );
}