import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import formatPrice from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";
import { getImageUrl } from "../utils/media";

const OrderScreen = () => {
  const { id: orderId } = useParams(); // Get the order ID from the URL parameters

  const {
    data: order,
    refetch, // Refetch the order details when needed // The refetch() can be used to manually trigger a refetch of the order details
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // Pay Order
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation(); // isLoading: loadingPay - just renaming isLoading to loadingPay

  // Deliver order
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  // PayPal Dispatcher
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  // Get paypal client id
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // If paypal client id available, loadPayPalScript with paypalDispatch
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      // If Order is not paid, loadPayPalScript
      if (order && !order.isPaid) {
        // check if the script already loaded
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, errorPayPal, loadingPayPal]);

  function onApprove(data, actions) {
    // this triggers paypal    // details returns by paypal
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch(); // Refetch the order details after payment, calling the refetch defined in useGetOrderDetailsQuery(orderId) hook.
        toast.success("Payment successful");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }); // using 'then' & 'async cuz it returns a promise
  }
  async function onApproveTest() {
    // (just for testing purposes) set the pay to true, so we don't have to go through pay pal
    try {
      await payOrder({ orderId, details: { payer: {} } }).unwrap();
      refetch(); //  Refetch the order details after payment, calling the refetch defined in useGetOrderDetailsQuery(orderId) hook.
      toast.success("Payment successful");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return (
      actions.order
        .create({
          purchase_units: [
            {
              amount: {
                value: order.totalPrice,
              },
            },
          ],
        })
        // using 'then' since returns a promise
        .then((orderId) => {
          return orderId;
        })
    );
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch(); // Refetch the order details after delivery, calling the refetch defined in useGetOrderDetailsQuery(orderId) hook.
      toast.success("Order delievered");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };
  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <Meta title={`Pay Order: ${order._id}`} />
      <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong>
                {order.User.name}
              </p>
              <p>
                <strong>Email: </strong>
                {order.User.email}
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.zip}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered On: {formatDate(order.deliveredAt)}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">
                  Paid On: {formatDate(order.paidAt)}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} x Rs.{formatPrice(item.price)} = Rs.
                      {formatPrice(item.qty * item.price)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row className="mb-1">
                  <Col>Items:</Col>
                  <Col>Rs. {formatPrice(order.itemsPrice)}</Col>
                </Row>

                <Row className="mb-1">
                  <Col>Shipping:</Col>
                  <Col>Rs. {formatPrice(order.shippingPrice)}</Col>
                </Row>

                <Row className="mb-2">
                  <Col>Tax:</Col>
                  <Col>Rs. {formatPrice(order.taxPrice)}</Col>
                </Row>

                <Row>
                  <hr />
                  <Col>
                    <strong>Total:</strong>
                  </Col>
                  <Col>
                    <strong>Rs. {formatPrice(order.totalPrice)}</strong>
                  </Col>
                </Row>

                {!order.isPaid && ( // && means 'then' here. && is used here to render a component only if a condition is true
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <div>
                        {
                          <Button
                            onClick={onApproveTest}
                            className="w-100 fw-semibold"
                            style={{ marginBottom: "15px" }}
                          >
                            Pay Now
                          </Button>
                        }
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      </div>
                    )}
                  </ListGroup.Item>
                )}
                {loadingDeliver && <Loader />}
                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListGroup.Item>
                      <Button
                        type="button"
                        className="btn btn-block"
                        onClick={deliverOrderHandler}
                      >
                        Mark As Delivered
                      </Button>
                    </ListGroup.Item>
                  )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
