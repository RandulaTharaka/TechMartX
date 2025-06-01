// This file manages your cart’s state in Redux, handles adding/updating items, and keeps the cart in sync with local storage.
// They are called slice files because, in Redux Toolkit, a slice represents a single "slice" (or section) of your application's global state and all the logic (reducers and actions) related to it.

import { createSlice } from "@reduxjs/toolkit"; // createSlice cuz not using endpoints here
import { updateCart } from "../utils/cartUtils";

// initially checking items in local storage if any available and setting initial state
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // addToCart handles adding/updating, remove from cart
    // reducer addToCart function takes two arguments: state(current state) & action(any data in payload)

    addToCart: (state, action) => {
      // current state and action(action happens with a event)
      const item = action.payload; // a product with quantity
      const existItem = state.cartItems.find((x) => x._id === item._id); // checking if the item already exists in the cart

      if (existItem) {
        state.cartItems = state.cartItems.map(
          (x) => (x._id === existItem._id ? item : x) // update the same item with new data if it exists
        );
      } else {
        state.cartItems = [...state.cartItems, item]; // spread accross operator: it creates a copy of the current array and add new items to it.
      }
      return updateCart(state); // update the cart after adding/updating the item
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((x) => x._id !== itemId); // filter out the item to be removed

      return updateCart(state); // update the cart after removing the item
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
