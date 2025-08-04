import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer.jsx";
import Loader from "../components/Loader.jsx";

import { toast } from "react-toastify";
import { useRegisterMutation } from "../slices/usersApiSlice.js";
import { setCredentials } from "../slices/authSlice.js";
import Meta from "../components/Meta";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  // Accessing userInfo from redux store
  /* who passes the state object into the state argument
      React Redux’s useSelector hook is programmed to “know” about the store (because of <Provider>).
      It gets the state from the store and passes it to your function.
      You don’t have to find or pass the state object yourself. */
  const { userInfo } = useSelector((state) => state.auth);

  // This code snippet is using React Router's useLocation hook to extract query parameters (such as redirect) from the current URL.
  /* useLocation() returns an object that represents the current URL location.
    The search property contains everything after the ?, such as ?redirect=/dashboard. */
  const { search } = useLocation();
  /* Creates a URLSearchParams object from the search string
    URLSearchParams is a built-in JavaScript class that makes it easy to work with the query string of a URL.
    It provides methods to get, set, and manipulate the query parameters. */
  const searchParams = new URLSearchParams(search);
  // Getting the redirect parameter or defaulting to "/"
  const redirect = searchParams.get("redirect") || "/";

  // Redirects to the specified path if userInfo is available
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ name, email, password }).unwrap(); // unwrap() is used to get the actual data from the promise returned by the mutation
        dispatch(setCredentials({ ...res })); // Dispatching the setCredentials action with the response
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error); // questions marks for optional chaining, which prevents errors if data or message is undefined
      }
    }
  };

  return (
    <FormContainer>
      <Meta title="Sign Up" />
      <h1>Sign Up</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          Already have an account?{" "}
          <Link
            to={
              redirect
                ? `/login?redirect=${redirect}`
                : "/login" /*if redirect is defined, append it to the URL*/
            }
          >
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
