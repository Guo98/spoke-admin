import React from "react";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface DropdownProps {
  handleChange(event: SelectChangeEvent): void;
}

const ClientDropdown = (props: DropdownProps) => {
  const { handleChange } = props;

  return (
    <FormControl fullWidth size="small" sx={{ paddingBottom: "15px" }}>
      <InputLabel id="client-select-label">Client</InputLabel>
      <Select
        labelId="client-select-label"
        label="Client"
        onChange={handleChange}
      >
        <MenuItem value="public">Mock</MenuItem>
        <MenuItem value="FLYR">FLYR</MenuItem>
        <MenuItem value="Bowery">Bowery</MenuItem>
        <MenuItem value="NurseDash">NurseDash</MenuItem>
        <MenuItem value="Intersect Power">Intersect Power</MenuItem>
        <MenuItem value="Hidden Road">Hidden Road</MenuItem>
        <MenuItem value="Alma">Alma</MenuItem>
        <MenuItem value="Automox">Automox</MenuItem>
        <MenuItem value="Life360">Life360</MenuItem>
        <MenuItem value="Sona">Sona</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ClientDropdown;
