// This file manages your cart’s state in Redux, handles adding/updating items, and keeps the cart in sync with local storage.
// They are called slice files because, in Redux Toolkit, a slice represents a single "slice" (or section) of your application's global state and all the logic (reducers and actions) related to it.
// This is Traditional Redux Slice: Manage local/global app state that is updated synchronously (like a cart, UI toggles, or form data.)

import { createSlice } from "@reduxjs/toolkit"; // createSlice cuz not using api-endpoints here
import { updateCart } from "../utils/cartUtils";

// Initially checking items in local storage if any available and setting initial state
const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      cartItems: [],
      // define all expected properties for the cart state
      // itemsPrice: "0.00",
      // shippingPrice: "0.00",
      // taxPrice: "0.00",
      // totalPrice: "0.00",
    };

// A slice is a section of your Redux state (Redux state is always global.)
// Redux is mainly used to manage global state in large or complex React applications.

// createSlice() func. creates a slice object for the cart state to manage adding and removeing items from the cart.
const cartSlice = createSlice({
  // Followings are called slice options or slice configuration properties in Redux Toolkit.
  name: "cart",
  initialState, // { cartItems: [] }
  reducers: {
    // It is called a reducer function because it follows the concept of the reduce operation in functional programming. A reducer takes the current state and an action, and "reduces" them to a new state.
    // In Redux, the reducer function determines how the state should change in response to an action, always returning a new state object.

    // addToCart handles adding/updating, remove from cart
    // reducer addToCart function takes two arguments: state(current state) & action(any data in payload)

    // current state and action(action happens with a event)
    addToCart: (state, action) => {
      // a product with quantity to this action argument is passed from addToCart({ ...product, qty }) func. in productScreen.jsx
      const item = action.payload;
      // checking if the item already exists in the cart
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map(
          // update the same item with new data if it exists
          (x) => (x._id === existItem._id ? item : x)
        );
      } else {
        // If there is no Items, add item
        // spread accross operator: it creates a copy of the current array and add new items to it.
        state.cartItems = [...state.cartItems, item];
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
