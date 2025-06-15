import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

// This file is setting up an API slice using Redux Toolkit's RTK Query.

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL }); // fetchBasQuery() func. allows to make request to backend api

export const apiSlice = createApi({
  // createApi func. is used to set up a central place for managing all API interactions in a Redux application.
  baseQuery, // = baseQuery: baseQuery
  tagTypes: ["Product", "Order", "User"], // define types of data that are fetching from api
  endpoints: (builder) => ({}), // The builder pattern simplifies endpoint creation and eliminates the need to manually handle data fetching and error management with try-catch blocks, as RTK Query manages these concerns internally
});
