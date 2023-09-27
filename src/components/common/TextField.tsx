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
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const TextField = (props: TextFieldProps) => {
  const { label, value, onChange } = props;
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
    />
  );
};

export default TextField;
