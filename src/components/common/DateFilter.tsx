import React, { useEffect } from "react";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface DropdownProps {
  handleChange(event: SelectChangeEvent): void;
  defaultValue: string;
  label: string;
}

const DateFilter = (props: DropdownProps) => {
  const { handleChange, defaultValue, label } = props;

  useEffect(() => {}, [defaultValue]);
  return (
    <FormControl size="small" variant="standard">
      <InputLabel id="date-select-label">{label}</InputLabel>
      <Select
        labelId="date-select-label"
        label="Approvals From"
        onChange={handleChange}
        defaultValue={defaultValue}
      >
        <MenuItem value="30">Last 30 Days</MenuItem>
        <MenuItem value="60">Last 60 Days</MenuItem>
        <MenuItem value="All">All Time</MenuItem>
      </Select>
    </FormControl>
  );
};

export default DateFilter;
