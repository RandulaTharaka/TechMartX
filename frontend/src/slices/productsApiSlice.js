import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice"; // apiSlice - use when having endpoints that are dealing with asynchronous requests
// This is a RTK Query API Slice: specialized for managing remote data: fetching, catching, and updating data from the server, with minimal boilerplate.

export const productsApiSlice = apiSlice.injectEndpoints({
  // two endpoints are added to the API using injectEndpoints method of apiSlice.
  endpoints: (builder) => ({
    // getProducts is query endpoint.
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: {
          keyword,
          pageNumber,
        }, // Doesn't need to perform fetch request or axios request to, instead done through redux
      }),
      keepUnusedDataFor: 5, // 5 Seconds // This is how long RTK Query will keep your data cached for after the last component unsubscribes.
      providesTags: ["Products"],
      // providesTags: ["Products"] associates the query's cached data with the "Products" tag.
      // Mutations with invalidatesTags: ["Products"] will trigger an automatic refetch of this query, keeping the product list up-to-date.
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
      //RTK Query will keep the fetched data cached for 5 seconds after the last component using the data unsubscribes, which helps optimize performance by reducing unnecessary network requests.
      // in RTK Query sets how long (in seconds) the cached data should be kept after the last component using it unsubscribes.
      /* For example, keepUnusedDataFor: 5 means the data will stay in the cache for 5 seconds after no component is using it.
         If a component requests the same data again within 5 seconds, RTK Query will use the cached data instead of refetching from the server. */
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
      /* This tells RTK Query that when this mutation is successful, 
         it should invalidate the 'Product' tag, which will trigger a refetch of any queries that are tagged
         with 'Product'. This is useful for keeping your data fresh after creating a new product. */

      /* The line invalidatesTags: ["Product"], is used in Redux Toolkit Query (RTK Query) to manage cache invalidation for API data. 
         When you define this property inside an endpoint (such as a mutation), 
         you are telling RTK Query that after this endpoint is called successfully, 
         any cached data associated with the "Product" tag should be considered outdated or "invalidated." */
      invalidatesTags: ["Product"], // Invalidate = "mark as outdated and refetch to get fresh data with those queries that have providedTags[""]
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    createProductReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
  }),
});

// RTK Query API slices export hooks (not action creators or reducers)
// Because you interact with the API via these hooks in your components, not by dispatching actions directly.
// Exports the auto-generated React hook for the useGetProductsQuery, and useGetProductDetailsQuery query.
// You use this hook in your components to trigger the product API call and get its status/results.
// naming convension - 'getProducts', prefixed with 'use' & postfixed with 'Query'
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
