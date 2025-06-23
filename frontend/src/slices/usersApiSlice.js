import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice"; // apiSlice - use when having endpoints that are dealing with asynchronous requests
// This is a RTK Query API Slice: specialized for managing remote data: fetching, catching, and updating data from the server, with minimal boilerplate.

export const UsersApiSlice = apiSlice.injectEndpoints({
  // two endpoints are added to the API using injectEndpoints method of apiSlice.
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    // login is query endpoint.
    // This long query endpoint uses RTK Query’s builder.mutation method.
    // Mutations are used for operations that change data on the server (like POST, PUT, DELETE).
    // The response from the server (such as user info or a token) will be returned by the mutation and made available in the hook's result.
    login: builder.mutation({
      // The query property is a function that receives data (the user credentials, e.g., email and password) as its argument.
      // This function returns an object describing how to make the API request.
      query: (data) => ({
        url: `${USERS_URL}/auth`, // Doesn't need to perform fetch request or axios request to, instead done through redux
        method: "POST",
        body: data, // This will be sent as the payload in the POST request which contains user credentials
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  UsersApiSlice; // naming convension - 'getProducts', prefixed with 'use' & postfixed with 'Query'
