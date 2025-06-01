import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
  //In React, children is a special, reserved prop that automatically holds whatever is placed between a component’s opening and closing tags.
};

Message.defaultProps = { variant: "info" };

export default Message;
