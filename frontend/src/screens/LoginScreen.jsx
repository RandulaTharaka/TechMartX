import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader.jsx";

import { toast } from "react-toastify";
import { useLoginMutation } from "../slices/usersApiSlice.js";
import { setCredentials } from "../slices/authSlice.js";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
      navigate(`/${redirect}`);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap(); // unwrap() is used to get the actual data from the promise returned by the mutation
      dispatch(setCredentials({ ...res })); // Dispatching the setCredentials action with the response
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error); // questions marks for optional chaining, which prevents errors if data or message is undefined
    }
  };

  return (
    <FormContainer>
      <Meta title="Login" />
      <h1>Sing In</h1>

      <Form onSubmit={submitHandler}>
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

        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading}
        >
          Sign In
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className="py-3">
        <Col>
          New Customer?{" "}
          <Link
            to={
              redirect
                ? `/register?redirect=${redirect}`
                : "/register" /*if redirect is defined, append it to the URL*/
            }
          >
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
