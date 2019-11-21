import { useState } from "react";

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);

  return [
    fields,
    (event) => {
      setValues({
        ...fields,
        [event.target.id]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
      });
    }
  ];
}

export function handleFormChange(event) {
  const target = event.target;

  console.log(event);
  console.log(this.state);

  this.setState({
    [target.id]: target.type === 'checkbox' ? target.checked : target.value
  });
}
