import React, { useState, useEffect } from "react";
import { IconButton, Typography, Stack } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface QuantityProps {
  changeQuantity: Function;
  item: string;
  item_quantity: number;
}

const QuantityField = (props: QuantityProps) => {
  const { item, changeQuantity, item_quantity } = props;
  const [quantity, setQuantity] = useState(item_quantity || 1);

  useEffect(() => {
    changeQuantity(item, quantity);
  }, [quantity]);

  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="space-between"
      alignItems="center"
    >
      <IconButton
        onClick={() => setQuantity(quantity - 1)}
        disabled={quantity === 1}
      >
        <RemoveIcon />
      </IconButton>
      <Typography>{quantity}</Typography>
      <IconButton onClick={() => setQuantity(quantity + 1)}>
        <AddIcon />
      </IconButton>
    </Stack>
  );
};

export default QuantityField;
