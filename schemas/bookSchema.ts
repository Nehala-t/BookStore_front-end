import * as yup from "yup";

export const addBookSchema = yup.object({
  title: yup
    .string()
    .required("Book title is required")
    .min(2, "Title must be at least 2 characters"),

  description: yup
    .string()
    .required("Description is required")
    .min(100, "Description must be at least 100 characters"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be greater than 0"),

  discountPrice: yup
    .number()
    .typeError("Discount price must be a number")
    .required("Discount price is required")
    .positive("Discount price must be greater than 0")
    .test(
      "less-than-price",
      "Discount price must be less than price",
      function (value) {
        return value < this.parent.price;
      }
    ),

  category: yup
    .string()
    .required("Category is required"),

  author: yup
    .string()
    .required("Author is required")
    .min(2, "Author name is too short"),

  isbn: yup
    .string()
    .required("ISBN is required")
    .min(10, "ISBN must be at least 10 characters"),

  publisher: yup
    .string()
    .required("Publisher is required"),

  publicationDate: yup
    .string()
    .required("Publication date is required"),

  pages: yup
    .number()
    .typeError("Pages must be a number")
    .required("Number of pages is required")
    .positive("Pages must be greater than 0")
    .integer("Pages must be a whole number"),

  language: yup
    .string()
    .required("Language is required"),

  stock: yup
    .number()
    .typeError("Stock must be a number")
    .required("Stock is required")
    .min(0, "Stock cannot be negative")
    .integer("Stock must be a whole number"),
});

export type BookFormData = yup.InferType<typeof addBookSchema>;
