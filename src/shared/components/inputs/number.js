import React from 'react';
import NumberFormat from 'react-number-format';
import { Form } from 'react-bootstrap';

const OdometerInput = ({ value, onChange }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Odômetro:</Form.Label>
      <NumberFormat
        placeholder="Valor"
        value={value}
        onValueChange={(values) => onChange(values.value)}
        format="###,###"
        allowNegative={false}
        className="form-control"
      />
    </Form.Group>
  );
};

export default OdometerInput;