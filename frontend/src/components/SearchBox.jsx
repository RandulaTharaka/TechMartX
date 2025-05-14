import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const SearchBox = () => {
  return (
    <Form inline>
      <Row>
        <Col xs="auto">
          <Form.Control
            type="text"
            placeholder="Search Products..."
            className=" mr-sm-2"
          />
        </Col>
        <Col xs="auto">
          <Button type="submit" variant="outline-primary">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBox;
