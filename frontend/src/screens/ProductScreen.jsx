import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // using useParams hook
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import {
  useGetProductDetailsQuery,
  useCreateProductReviewMutation,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";
import { addToCart } from "../slices/cartSlice";
import { useDispatch } from "react-redux"; // for dispatching actions
import Meta from "../components/Meta";

// The ProductScreen component is a React functional component that displays detailed information about a single product in this e-commerce application.
const ProductScreen = () => {
  /* const [product, setProduct] = useState(); 
  const { id: productId } = useParams(); //de-structuring*/

  /* useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <p>Loading...</p>;
  } */

  // Use React Router’s useParams hook to extract the product ID from the URL, which is then used to fetch the product’s details.

  const { id: productId } = useParams(); //de-structuring

  // The component maintains a local state variable qty to track the quantity of the product the user wants to add to their cart, defaulting to 1
  const [qty, setQty] = useState(1); // for quantity selection // default value is 1

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Using RTK Query to fetch product details
  // Instead of manually fetching data with axios and managing local state, the component leverages RTK Query’s useGetProductDetailsQuery hook to automatically fetch and cache the product data from the backend.
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [createProductReview] = useCreateProductReviewMutation();

  // It also uses Redux’s useDispatch to dispatch actions and React Router’s useNavigate to programmatically navigate the user to the cart page after adding an item.
  const dispatch = useDispatch(); // for dispatching actions
  const navigate = useNavigate(); // for navigation

  // Function to handle adding the product to the cart
  // This function will dispatch the addToCart action with the product details
  // calls the add to cart handler from the cart slice

  // The “Add To Cart” button dispatches an action to add the selected product and quantity to the Redux store and then navigates the user to the cart page.
  // Curly braces {} are used in JavaScript to define a block of statements, such as the body of a function, an if statement, or a loop.
  // Parentheses () are used for function calls or to group expressions.
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty })); // dispatching the addToCart action
    // The syntax { ...product, qty } uses the JavaScript spread operator to copy all key-value pairs from the product object and then adds or overrides the qty property with the current quantity selected by the user.
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    console.log("submithandler");
    e.preventDefault();

    // create a new reveiw for the product and send as a post
    try {
      await createProductReview({ productId, rating, comment }).unwrap();
      toast.success("Review created successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={5}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: ${product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out Of Stock"}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating}></Rating>
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h4>Write a Customer Review</h4>
                  <Form onSubmit={submitHandler}>
                    <Form.Group className="my-2">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        required
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="my-2">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        row="3"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Button type="submit" variant="primary">
                      Submit
                    </Button>
                  </Form>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
