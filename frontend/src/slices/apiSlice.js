import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL }); // fetchBasQuery() func. allows to make request to backend api

export const apiSlice = createApi({
  baseQuery, // = baseQuery: baseQuery
  tagTypes: ["Product", "Order", "User"], // define types of data that are fetching from api
  endpoints: (builder) => ({}), // builder eliminates the need to manually fetch data and handle errors with try catch blocks
});
