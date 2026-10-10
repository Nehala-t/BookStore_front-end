"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../redux/store";

import {
  addSellerBook,
  fetchSellerBooks,
} from "../redux/slices/sellerSlice";

import {
  addBookSchema,
  type BookFormData,
} from "../schemas/bookSchema";

interface AddBookFormProps {
  onSuccess: () => void;
}

export default function AddBookForm({
  onSuccess,
}: AddBookFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  // =====================================================
  // IMAGE STATE
  // =====================================================

  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");

  // =====================================================
  // FORM
  // =====================================================

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: yupResolver(addBookSchema),
  });

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

 const handleImageChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const selectedFiles = Array.from(e.target.files || []);

  if (selectedFiles.length === 0) {
    return;
  }

  setImageError("");

  setImages((prevImages) => {
    // Combine existing + newly selected images
    const combinedImages = [
      ...prevImages,
      ...selectedFiles,
    ];

    // Remove duplicate files
    const uniqueImages = combinedImages.filter(
      (file, index, self) =>
        index ===
        self.findIndex(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified
        )
    );

    // Maximum 5 images
    if (uniqueImages.length > 5) {
      setImageError(
        "You can upload a maximum of 5 images."
      );

      return uniqueImages.slice(0, 5);
    }

    return uniqueImages;
  });

  // Allow selecting the same file again later
  e.target.value = "";
};

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const handleRemoveImage = (index: number) => {
    setImages((prev) =>
      prev.filter((_, imageIndex) => imageIndex !== index)
    );

    setImageError("");
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const onSubmit = async (data: BookFormData) => {
    // Check image
    if (images.length === 0) {
      setImageError(
        "At least one book image is required."
      );

      return;
    }

    setImageError("");

    try {
      // =================================================
      // CREATE FORM DATA
      // =================================================

      const formData = new FormData();

      formData.append("title", data.title);

      formData.append(
        "description",
        data.description
      );

      formData.append(
        "price",
        String(data.price)
      );

      formData.append(
        "discountPrice",
        String(data.discountPrice)
      );

      formData.append(
        "category",
        data.category
      );

      formData.append(
        "author",
        data.author
      );

      formData.append(
        "isbn",
        data.isbn
      );

      formData.append(
        "publisher",
        data.publisher
      );

      formData.append(
        "publicationDate",
        data.publicationDate
      );

      formData.append(
        "pages",
        String(data.pages)
      );

      formData.append(
        "language",
        data.language
      );

      formData.append(
        "stock",
        String(data.stock)
      );

      // =================================================
      // ADD ALL IMAGES
      // =================================================

      images.forEach((file) => {
        formData.append("images", file);
      });

      // =================================================
      // API REQUEST
      // =================================================

      await dispatch(
        addSellerBook(formData)
      ).unwrap();

      // =================================================
      // SUCCESS TOAST
      // =================================================

      toast.success(
        "Book published successfully!"
      );

      // =================================================
      // REFRESH SELLER BOOKS
      // =================================================

      await dispatch(
        fetchSellerBooks()
      ).unwrap();

      // =================================================
      // RESET FORM
      // =================================================

      reset();

      setImages([]);
      setImageError("");

      // =================================================
      // GO BACK TO BOOKS
      // =================================================

      onSuccess();

    } catch (error: unknown) {
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to publish book"
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Add New Book
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Add a new book to your inventory.
          </p>
        </div>

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* ================================================= */}
          {/* TITLE */}
          {/* ================================================= */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Book Title
            </label>

            <input
              type="text"
              {...register("title")}
              placeholder="Enter book title"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* ================================================= */}
          {/* DESCRIPTION */}
          {/* ================================================= */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>

            <textarea
              {...register("description")}
              placeholder="Enter book description"
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />

            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ================================================= */}
          {/* PRICE */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price
              </label>

              <input
                type="number"
                {...register("price")}
                placeholder="Enter price"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Discount Price
              </label>

              <input
                type="number"
                {...register("discountPrice")}
                placeholder="Enter discount price"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.discountPrice && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.discountPrice.message}
                </p>
              )}
            </div>

          </div>

          {/* ================================================= */}
          {/* CATEGORY + AUTHOR */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>

              <input
                type="text"
                {...register("category")}
                placeholder="e.g. Fiction"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.category && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Author
              </label>

              <input
                type="text"
                {...register("author")}
                placeholder="Enter author name"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.author && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.author.message}
                </p>
              )}
            </div>

          </div>

          {/* ================================================= */}
          {/* ISBN + PUBLISHER */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ISBN
              </label>

              <input
                type="text"
                {...register("isbn")}
                placeholder="Enter ISBN"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.isbn && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.isbn.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Publisher
              </label>

              <input
                type="text"
                {...register("publisher")}
                placeholder="Enter publisher"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.publisher && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.publisher.message}
                </p>
              )}
            </div>

          </div>

          {/* ================================================= */}
          {/* PUBLICATION DATE + PAGES */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Publication Date
              </label>

              <input
                type="date"
                {...register("publicationDate")}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.publicationDate && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.publicationDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Pages
              </label>

              <input
                type="number"
                {...register("pages")}
                placeholder="Enter number of pages"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.pages && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.pages.message}
                </p>
              )}
            </div>

          </div>

          {/* ================================================= */}
          {/* LANGUAGE + STOCK */}
          {/* ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Language
              </label>

              <input
                type="text"
                {...register("language")}
                placeholder="e.g. English"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.language && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.language.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stock
              </label>

              <input
                type="number"
                {...register("stock")}
                placeholder="Enter stock quantity"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />

              {errors.stock && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>

          </div>

          {/* ================================================= */}
          {/* IMAGES */}
          {/* ================================================= */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Book Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-slate-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-orange-500 file:text-white
                file:cursor-pointer
                hover:file:bg-orange-600"
            />

            <p className="text-xs text-slate-500 mt-1">
              Select up to 5 images.
            </p>

            {/* IMAGE ERROR */}

            {imageError && (
              <p className="text-sm text-red-500 mt-1">
                {imageError}
              </p>
            )}

            {/* IMAGE PREVIEWS */}

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">

                {images.map((file, index) => {
                  const previewUrl =
                    URL.createObjectURL(file);

                  return (
                    <div
                      key={`${file.name}-${index}`}
                      className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={previewUrl}
                        alt={`Book image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />

                      {/* REMOVE BUTTON */}

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveImage(index)
                        }
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold shadow hover:bg-red-600 transition"
                      >
                        ×
                      </button>

                      {/* IMAGE NUMBER */}

                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                        Image {index + 1}
                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>

          {/* ================================================= */}
          {/* SUBMIT */}
          {/* ================================================= */}

          <div className="pt-4">

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Publishing..."
                : "Publish Book"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
