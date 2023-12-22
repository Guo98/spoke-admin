import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Stack,
  TextField,
  Button,
} from "@mui/material";

import CheckStock from "../AI/CheckStock";

import { textfield_style, button_style } from "../../../utilities/styles";

interface AccessoriesProps {
  items: any;
  setItemName: Function;
  item_name: string;
  completeItemChoice: Function;
}

const AccessoriesSelection = (props: AccessoriesProps) => {
  const { setItemName, item_name, items, completeItemChoice } = props;

  const [item_index, setItemIndex] = useState(-1);
  const [location, setLocation] = useState("");

  useEffect(() => {}, [item_name]);

  const handleItemChange = (event: SelectChangeEvent) => {
    setItemName(event.target.value);

    setItemIndex(items.map((i: any) => i.type).indexOf(event.target.value));
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    setLocation(event.target.value);
  };

  return (
    <Stack spacing={2} pt={2}>
      <FormControl fullWidth sx={textfield_style} required size="small">
        <InputLabel id="type-select-label">Device Type</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          label="Device Type"
          onChange={handleItemChange}
          value={item_name}
          required
        >
          {items &&
            items.length > 0 &&
            items.map((item: any) => {
              return <MenuItem value={item.type}>{item.type}</MenuItem>;
            })}
        </Select>
      </FormControl>
      <FormControl
        fullWidth
        sx={textfield_style}
        required
        size="small"
        disabled={item_index < 0}
      >
        <InputLabel id="loc-select-label">Locations</InputLabel>
        <Select
          labelId="loc-select-label"
          id="loc-select"
          label="Locations"
          onChange={handleLocationChange}
          value={location}
          required
        >
          {items[item_index] &&
            items[item_index].locations &&
            items[item_index].locations.length > 0 &&
            items[item_index].locations.map((loc: any) => {
              return <MenuItem value={loc}>{loc}</MenuItem>;
            })}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        sx={button_style}
        onClick={() =>
          completeItemChoice(
            item_name,
            "",
            "",
            location,
            "",
            "",
            "",
            "",
            "",
            "",
            "buy"
          )
        }
      >
        Submit Order
      </Button>
    </Stack>
  );
};

export default AccessoriesSelection;

/**
 * 
 * @param props dn: string,
    ds: string,
    du: string = "",
    region: string,
    price: string,
    image_source: string,
    stock_level: string,
    ai_specs: string,
    sup: string,
    cdw_part_no: string = "",
    type: string = "quote"
 * @returns 
 */
