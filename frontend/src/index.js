import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter as Router,
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen.jsx";

// This page defines routing structure and the main rendering logic for a React application
// It uses React Router v6 to manage navigation between different pages

// The <Route path="/" element={<App />}> line sets up a parent route at the root path ("/"), which renders the App component as a layout or wrapper for all nested routes.
// Inside this parent route, three child routes are defined:
// The home screen (<HomeScreen />) at the root path, a product details page (<ProductScreen />) that uses a dynamic :id parameter in the URL, and a cart page (<CartScreen />).
// This nested structure allows the App component to provide shared layout or logic for all these pages.

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="/cart" element={<CartScreen />} />
    </Route>
  )
);

// <React.StrictMode> wrapper, which helps catch potential issues during development.
// Redux <Provider> component wraps the router, making the Redux store available to all components in the app
// <RouterProvider> is given the router configuration, enabling navigation and route matching.
// Finally, reportWebVitals() is called to measure and report performance metrics for the application

const root = ReactDOM.createRoot(document.getElementById("root"));
// This method is responsible for rendering your React component tree into the DOM.
// This is the entry point for rendering your entire React application and is essential for displaying your UI in the browser.
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
