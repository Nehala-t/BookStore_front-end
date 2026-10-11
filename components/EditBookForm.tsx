"use client";

import { useEffect, useState } from "react";
import {
  useForm,
} from "react-hook-form";

import {
  yupResolver,
} from "@hookform/resolvers/yup";

import {
  useDispatch,
} from "react-redux";

import {
  BookOpen,
  ImagePlus,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";

import { toast } from "react-toastify";

import type {
  AppDispatch,
} from "../redux/store";

import {
  editSellerBook,
  type SellerBook,
} from "../redux/slices/sellerSlice";

import {
  addBookSchema,
  type BookFormData,
} from "../schemas/bookSchema";


// =====================================================
// PROPS
// =====================================================

interface EditBookFormProps {
  book: SellerBook;

  onSuccess: () => void;

  onCancel: () => void;
}


// =====================================================
// COMPONENT
// =====================================================

export default function EditBookForm({
  book,
  onSuccess,
  onCancel,
}: EditBookFormProps) {

  const dispatch =
    useDispatch<AppDispatch>();


  // ===================================================
  // IMAGES
  // ===================================================

  const [
    existingImages,
    setExistingImages,
  ] = useState<string[]>(
    book.images || []
  );

  const [
    newImages,
    setNewImages,
  ] = useState<File[]>([]);

  const [
    imageError,
    setImageError,
  ] = useState("");


  // ===================================================
  // FORM
  // ===================================================

  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
      isSubmitting,
    },

  } = useForm<BookFormData>({
    resolver: yupResolver(
      addBookSchema
    ),

    defaultValues: {
      title: book.title || "",

      description:
        book.description || "",

      price:
        book.price ?? 0,

      discountPrice: book.discountPrice ?? undefined,

      category:
        book.category || "",

      author:
        book.author || "",

      isbn:
        book.isbn || "",

      publisher:
        book.publisher || "",

      publicationDate:
        book.publicationDate
          ? book.publicationDate.substring(
              0,
              10
            )
          : "",

      pages:
        book.pages ?? 0,

      language:
        book.language || "",

      stock:
        book.stock ?? 0,
    },
  });


  // ===================================================
  // UPDATE FORM WHEN BOOK CHANGES
  // ===================================================

  useEffect(() => {

    reset({
      title:
        book.title || "",

      description:
        book.description || "",

      price:
        book.price ?? 0,

      discountPrice: book.discountPrice ?? undefined,

      category:
        book.category || "",

      author:
        book.author || "",

      isbn:
        book.isbn || "",

      publisher:
        book.publisher || "",

      publicationDate:
        book.publicationDate
          ? book.publicationDate.substring(
              0,
              10
            )
          : "",

      pages:
        book.pages ?? 0,

      language:
        book.language || "",

      stock:
        book.stock ?? 0,
    });


    setExistingImages(
      book.images || []
    );

    setNewImages([]);

    setImageError("");

  }, [
    book,
    reset,
  ]);


  // ===================================================
  // IMAGE CHANGE
  // ===================================================

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const selectedFiles =
      Array.from(
        e.target.files || []
      );

    if (
      selectedFiles.length === 0
    ) {
      return;
    }


    setImageError("");


    setNewImages(
      (previousImages) => {

        const combinedImages = [
          ...previousImages,
          ...selectedFiles,
        ];


        // Remove duplicate files

        const uniqueImages =
          combinedImages.filter(
            (file, index, array) =>
              index ===
              array.findIndex(
                (item) =>
                  item.name ===
                    file.name &&
                  item.size ===
                    file.size &&
                  item.lastModified ===
                    file.lastModified
              )
          );


        const totalImages =
          existingImages.length +
          uniqueImages.length;


        if (
          totalImages > 5
        ) {

          setImageError(
            "You can upload a maximum of 5 images."
          );


          const allowedNewImages =
            Math.max(
              0,
              5 -
                existingImages.length
            );


          return uniqueImages.slice(
            0,
            allowedNewImages
          );
        }


        return uniqueImages;
      }
    );


    // Allow selecting
    // the same file again

    e.target.value = "";
  };


  // ===================================================
  // REMOVE EXISTING IMAGE
  // ===================================================

  const handleRemoveExistingImage = (
    index: number
  ) => {

    setExistingImages(
      (previousImages) =>
        previousImages.filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
    );

    setImageError("");
  };


  // ===================================================
  // REMOVE NEW IMAGE
  // ===================================================

  const handleRemoveNewImage = (
    index: number
  ) => {

    setNewImages(
      (previousImages) =>
        previousImages.filter(
          (_, imageIndex) =>
            imageIndex !== index
        )
    );

    setImageError("");
  };


  // ===================================================
  // SUBMIT
  // ===================================================

  const onSubmit = async (
    data: BookFormData
  ) => {

    try {

      setImageError("");


      // ===============================================
      // FORM DATA
      // ===============================================

      const formData =
        new FormData();


      formData.append(
        "title",
        data.title
      );


      formData.append(
        "description",
        data.description
      );


      formData.append(
        "price",
        String(data.price)
      );


      if (
        data.discountPrice !==
          null &&
        data.discountPrice !==
          undefined
      ) {

        formData.append(
          "discountPrice",
          String(
            data.discountPrice
          )
        );
      }


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


      // ===============================================
      // EXISTING IMAGES
      // ===============================================

      existingImages.forEach(
        (image) => {

          formData.append(
            "existingImages",
            image
          );

        }
      );


      // ===============================================
      // NEW IMAGES
      // ===============================================

      newImages.forEach(
        (file) => {

          formData.append(
            "images",
            file
          );

        }
      );


      // ===============================================
      // REDUX
      // ===============================================

      await dispatch(
        editSellerBook({
          id: book._id,
          formData,
        })
      ).unwrap();


      // ===============================================
      // SUCCESS
      // ===============================================

      toast.success(
        "Book updated successfully"
      );


      onSuccess();

    } catch (error: any) {

      console.error(
        "EDIT BOOK ERROR:",
        error
      );


      // Backend message
      // comes from rejectWithValue

      toast.error(
        typeof error === "string"
          ? error
          : "Failed to update book"
      );
    }
  };


  // ===================================================
  // STYLES
  // ===================================================

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";


  const errorClass =
    "mt-1 text-xs text-rose-500";


  // ===================================================
  // JSX
  // ===================================================

  return (

    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">

            <BookOpen className="h-5 w-5 text-orange-600" />

          </div>


          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Edit Book
            </h1>

            <p className="text-sm text-slate-500">
              Update your book information
            </p>

          </div>

        </div>


        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >

          <ArrowLeft className="h-4 w-4" />

          Back to Books

        </button>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
      >

        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <div className="mb-8">

          <h2 className="text-lg font-semibold text-slate-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update the basic details of your book.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* TITLE */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Book Title
            </label>

            <input
              type="text"
              {...register("title")}
              className={inputClass}
              placeholder="Enter book title"
            />

            {errors.title && (
              <p className={errorClass}>
                {errors.title.message}
              </p>
            )}

          </div>


          {/* AUTHOR */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Author
            </label>

            <input
              type="text"
              {...register("author")}
              className={inputClass}
              placeholder="Enter author name"
            />

            {errors.author && (
              <p className={errorClass}>
                {errors.author.message}
              </p>
            )}

          </div>


          {/* CATEGORY */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <input
              type="text"
              {...register("category")}
              className={inputClass}
              placeholder="Enter category"
            />

            {errors.category && (
              <p className={errorClass}>
                {errors.category.message}
              </p>
            )}

          </div>


          {/* DESCRIPTION */}

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              {...register(
                "description"
              )}
              rows={5}
              className={inputClass}
              placeholder="Enter book description"
            />

            {errors.description && (
              <p className={errorClass}>
                {
                  errors.description
                    .message
                }
              </p>
            )}

          </div>

        </div>


        {/* =================================================
            BOOK DETAILS
        ================================================= */}

        <div className="mb-6 mt-10">

          <h2 className="text-lg font-semibold text-slate-900">
            Book Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Update pricing, publication and inventory information.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* PRICE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Price
            </label>

            <input
              type="number"
              step="0.01"
              {...register("price")}
              className={inputClass}
              placeholder="Enter price"
            />

            {errors.price && (
              <p className={errorClass}>
                {errors.price.message}
              </p>
            )}

          </div>


          {/* DISCOUNT PRICE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Discount Price
            </label>

            <input
              type="number"
              step="0.01"
              {...register(
                "discountPrice"
              )}
              className={inputClass}
              placeholder="Enter discount price"
            />

            {errors.discountPrice && (
              <p className={errorClass}>
                {
                  errors.discountPrice
                    .message
                }
              </p>
            )}

          </div>


          {/* ISBN */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              ISBN
            </label>

            <input
              type="text"
              {...register("isbn")}
              className={inputClass}
              placeholder="Enter ISBN"
            />

            {errors.isbn && (
              <p className={errorClass}>
                {errors.isbn.message}
              </p>
            )}

          </div>


          {/* PUBLISHER */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Publisher
            </label>

            <input
              type="text"
              {...register(
                "publisher"
              )}
              className={inputClass}
              placeholder="Enter publisher"
            />

            {errors.publisher && (
              <p className={errorClass}>
                {
                  errors.publisher
                    .message
                }
              </p>
            )}

          </div>


          {/* PUBLICATION DATE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Publication Date
            </label>

            <input
              type="date"
              {...register(
                "publicationDate"
              )}
              className={inputClass}
            />

            {errors.publicationDate && (
              <p className={errorClass}>
                {
                  errors.publicationDate
                    .message
                }
              </p>
            )}

          </div>


          {/* PAGES */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Pages
            </label>

            <input
              type="number"
              {...register("pages")}
              className={inputClass}
              placeholder="Number of pages"
            />

            {errors.pages && (
              <p className={errorClass}>
                {errors.pages.message}
              </p>
            )}

          </div>


          {/* LANGUAGE */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Language
            </label>

            <input
              type="text"
              {...register(
                "language"
              )}
              className={inputClass}
              placeholder="Enter language"
            />

            {errors.language && (
              <p className={errorClass}>
                {errors.language.message}
              </p>
            )}

          </div>


          {/* STOCK */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Stock
            </label>

            <input
              type="number"
              {...register("stock")}
              className={inputClass}
              placeholder="Enter stock quantity"
            />

            {errors.stock && (
              <p className={errorClass}>
                {errors.stock.message}
              </p>
            )}

          </div>

        </div>


        {/* =================================================
            IMAGES
        ================================================= */}

        <div className="mt-10">

          <div className="mb-4">

            <h2 className="text-lg font-semibold text-slate-900">
              Book Images
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep existing images or add new images. Maximum 5 images.
            </p>

          </div>


          {/* EXISTING IMAGES */}

          {existingImages.length >
            0 && (

            <div className="mb-5">

              <p className="mb-3 text-sm font-medium text-slate-700">
                Existing Images
              </p>


              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                {existingImages.map(
                  (
                    image,
                    index
                  ) => (

                    <div
                      key={`${image}-${index}`}
                      className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >

                      <img
                        src={image}
                        alt={`Book image ${
                          index + 1
                        }`}
                        className="h-32 w-full object-cover"
                      />


                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveExistingImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
                      >

                        <X className="h-4 w-4" />

                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* NEW IMAGES */}

          {newImages.length >
            0 && (

            <div className="mb-5">

              <p className="mb-3 text-sm font-medium text-slate-700">
                New Images
              </p>


              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                {newImages.map(
                  (
                    file,
                    index
                  ) => (

                    <div
                      key={`${file.name}-${file.lastModified}`}
                      className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >

                      <img
                        src={URL.createObjectURL(
                          file
                        )}
                        alt={file.name}
                        className="h-32 w-full object-cover"
                      />


                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveNewImage(
                            index
                          )
                        }
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
                      >

                        <X className="h-4 w-4" />

                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* ADD IMAGE */}

          {existingImages.length +
            newImages.length <
            5 && (

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 transition hover:border-orange-300 hover:bg-orange-50">

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">

                <ImagePlus className="h-6 w-6 text-orange-600" />

              </div>


              <p className="text-sm font-semibold text-slate-700">
                Add Book Images
              </p>


              <p className="mt-1 text-xs text-slate-500">
                PNG, JPG or JPEG
              </p>


              <p className="mt-1 text-xs text-slate-400">
                Select images multiple times if needed
              </p>


              <input
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleImageChange
                }
                className="hidden"
              />

            </label>

          )}


          {imageError && (
            <p className="mt-2 text-sm text-rose-500">
              {imageError}
            </p>
          )}


          <p className="mt-3 text-xs text-slate-400">
            {existingImages.length +
              newImages.length}{" "}
            / 5 images
          </p>

        </div>


        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <X className="h-4 w-4" />

            Cancel

          </button>


          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-orange-300"
          >

            <Save className="h-4 w-4" />

            {isSubmitting
              ? "Updating..."
              : "Update Book"}

          </button>

        </div>

      </form>

    </div>
  );
}
