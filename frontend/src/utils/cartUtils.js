export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // if cartItems is empty, set all prices to "0.00"
  if (state.cartItems.length === 0) {
    state.itemsPrice = "0.00";
    state.shippingPrice = "0.00";
    state.taxPrice = "0.00";
    state.totalPrice = "0.00";
  } else {
    // Calculate items price
    // defining properties itemPrice for the cart state since this function is called in reducer function
    state.itemsPrice = addDecimals(
      // About reduce() array method:
      // reduce() is an array method that processes each item in the array and accumulates a single result.
      // It takes a callback function and an initial value (0 in this case).

      // (acc, item) => acc + item.price * item.qty
      // Multiplies the item’s price by its quantity (item.price * item.qty) to get the total price for that item.
      // Adds that value to the accumulator (acc), which keeps a running total.

      // 0 (initial value)
      // The accumulator (acc) starts at 0.
      state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    // Calculate shipping price    // If items price is more than 10000, shipping is free, else it's 100
    state.shippingPrice = addDecimals(250);

    // Calculate tax price
    state.taxPrice = addDecimals(Number(0.05 * state.itemsPrice));

    // Calculate total price
    state.totalPrice = (
      Number(state.itemsPrice) +
      Number(state.shippingPrice) +
      Number(state.taxPrice)
    ).toFixed(2);
  }
  // localStorage is a web storage API that allows you to store data (in key-value pairs) in the browser.
  // You do not need to import it as it is a global object available in the browser environment.
  localStorage.setItem("cart", JSON.stringify(state)); // Save cart to local storage

  return state;
};
