import { createApi } from "@reduxjs/toolkit/query/react";
import api from "../lib/api";

export interface Book {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  image?: string;
  category: string;
  author: string;
  isbn: string;
  publisher?: string;
  publicationDate?: string;
  pages?: number;
  language?: string;
  stock: number;
  status: string;
  isDeleted: boolean;
}

interface BooksResponse {
  success: boolean;
  message: string;
  data: Book[];
}


// Axios baseQuery
const axiosBaseQuery =
  () =>
  async ({
    url,
    method,
    data,
    params,
  }: {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    data?: unknown;
    params?: Record<string, unknown>;
  }) => {
    try {
      const result = await api({
        url,
        method,
        data,
        params,
      });

      return {
        data: result.data,
      };
    } catch (axiosError: any) {
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };


export const bookApi = createApi({
  reducerPath: "bookApi",

  baseQuery: axiosBaseQuery(),

  endpoints: (builder) => ({

    // GET ALL BOOKS
    getBooks: builder.query<BooksResponse, void>({
      query: () => ({
        url: "/book/getAllBooks",
        method: "GET",
      }),
    }),

  }),
});


export const {
  useGetBooksQuery,
} = bookApi;

