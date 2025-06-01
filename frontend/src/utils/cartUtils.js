export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  // Calculate shipping price    // If items price is more than 10000, shipping is free, else it's 100
  state.shippingPrice = addDecimals(state.itemsPrice > 10000 ? 0 : 100);

  // Calculate tax price
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice));

  // Calculate total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Save cart to local storage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
