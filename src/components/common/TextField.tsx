import React from "react";
import TF from "@mui/material/TextField";

interface TextFieldProps {
  label: string;
  value: string;
  onChange(text: string): void;
  fullWidth?: boolean;
  disabled?: boolean;
  defaultValue?: string;
  required?: boolean;
  id?: string;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const TextField = (props: TextFieldProps) => {
  const { label, value, onChange, id } = props;
  return (
    <TF
      label={label}
      value={value}
      size="small"
      onChange={(e) => onChange(e.target.value)}
      sx={textFieldStyle}
      fullWidth={props.fullWidth}
      disabled={props.disabled}
      defaultValue={props.defaultValue}
      required={props.required}
      id={id}
    />
  );
};

export default TextField;
