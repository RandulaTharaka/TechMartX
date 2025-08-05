import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import formatPrice from "../utils/formatPrice";

const Product = ({ product }) => {
  return (
    <>
      <Card className="my-3 p-3 rounded product-card">
        <Link to={`/product/${product._id}`}>
          <Card.Img variant="top" src={product.image} className="product-img" />
        </Link>

        <Card.Body>
          <Link to={`/product/${product._id}`}>
            <Card.Title as="div" className="product-title">
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>

          <Card.Text as="div">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            ></Rating>
          </Card.Text>

          <Card.Text as="h3">Rs. {formatPrice(product.price)}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default Product;
