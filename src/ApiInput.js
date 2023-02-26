import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

/**
 * A small form to let the user add an API Key
 */
const ApiInput = ({handler, value}) => {
  const [text, setText] = useState("");

function handleSubmit(e) {
  e.preventDefault();
  handler(text);
}

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Image Service API Key</Form.Label>
        <Form.Control type="text" onChange={(e) => setText(e.target.value)} value={text} />
        <Form.Text className="text-muted">
          This API key is used locally by your browser, it is not stored neither shared.
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default ApiInput;
