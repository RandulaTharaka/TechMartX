import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  Form,
  Button,
  Card,
  ListGroup,
} from "react-bootstrap";

import { FaTrash } from "react-icons/fa";
import Message from "../components/Message";
import Meta from "../components/Meta";
import formatPrice from "../utils/formatPrice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty })); // dispatching the addToCart action with product details plus quantity
  };

  const removeFromCartHandler = async (itemId) => {
    dispatch(removeFromCart(itemId)); // dispatching the removeFromCart action with item ID
  };

  const checkOutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  // Get cart items from Redux store
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  return (
    <div>
      <Meta title="Shopping Cart" />
      <Row>
        <Col md={8}>
          <h1 style={{ marginBottom: "20px" }}>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty! <Link to="/">Go back</Link>
            </Message>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>Rs. {formatPrice(item.price)}</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={
                          (e) => addToCartHandler(item, Number(e.target.value)) // product, quantity
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        className=""
                        onClick={() => {
                          removeFromCartHandler(item._id);
                          // using arrow function cuz its passing a function to b e called later, otherwise(in normal function) it will be called immediately during render.
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  )
                </h2>
                Rs.{" "}
                {formatPrice(
                  Number(
                    cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)
                  )
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={checkOutHandler}
                >
                  Proceed To Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;
