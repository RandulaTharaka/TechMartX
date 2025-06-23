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
    // This code sets up an RTK Query endpoint that, when called with a product ID, will fetch the details for that specific product from the backend API.
    // This getProductDetails  query endpoint using RTK Query’s builder.query method.
    getProductDetails: builder.query({
      // The 'query:' property is a function that receives a productId as its argument.
      // This function returns an object describing how to make the API request.
      /* This object can include properties such as:
            url: The endpoint to fetch data from (required).
            method: The HTTP method to use (e.g., "GET", "POST"). If not specified, "GET" is used by default.
            body: The data to send with the request (for "POST", "PUT", etc.).
            params: Query parameters to append to the URL.
            headers: Any custom headers to include in the request. */
      // The object returned by the query function gives RTK Query all the details it needs to construct and send the HTTP request to your backend.
      query: (productId) => ({
        // It uses a template string to combine the base URL (PRODUCTS_URL, e.g., /api/products) with the specific productId. = /api/products/123.
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5, //RTK Query will keep the fetched data cached for 5 seconds after the last component using the data unsubscribes, which helps optimize performance by reducing unnecessary network requests.
    }),
  }),
});

// RTK Query API slices export hooks (not action creators or reducers)
// Because you interact with the API via these hooks in your components, not by dispatching actions directly.
// Exports the auto-generated React hook for the useGetProductsQuery, and useGetProductDetailsQuery query.
// You use this hook in your components to trigger the product API call and get its status/results.
// naming convension - 'getProducts', prefixed with 'use' & postfixed with 'Query'
export const { useGetProductsQuery, useGetProductDetailsQuery } =
  productsApiSlice;
