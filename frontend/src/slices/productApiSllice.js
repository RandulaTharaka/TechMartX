import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice"; // apiSlice - use when having endpoints that are dealing with asynchronous requests

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL, // Doesn't need to perform fetch request or axios request to, instead done through redux
      }),
      keepUnusedDataFor: 5, // 5 Seconds // This is how long RTK Query will keep your data cached for after the last component unsubscribes.
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } =
  productsApiSlice; // naming convension - 'getProducts', prefixed with 'use' & postfixed with 'Query'
