import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice"; // apiSlice - use when having endpoints that are dealing with asynchronous requests
// This is a RTK Query API Slice: specialized for managing remote data: fetching, catching, and updating data from the server, with minimal boilerplate.

export const productsApiSlice = apiSlice.injectEndpoints({
  // two endpoints are added to the API using injectEndpoints method of apiSlice.
  endpoints: (builder) => ({
    // getProducts is query endpoint.
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL, // Doesn't need to perform fetch request or axios request to, instead done through redux
      }),
      keepUnusedDataFor: 5, // 5 Seconds // This is how long RTK Query will keep your data cached for after the last component unsubscribes.
    }),
    // getProductDetails is query endpoint.
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5, //RTK Query will keep the fetched data cached for 5 seconds after the last component using the data unsubscribes, which helps optimize performance by reducing unnecessary network requests.
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery } =
  productsApiSlice; // naming convension - 'getProducts', prefixed with 'use' & postfixed with 'Query'
