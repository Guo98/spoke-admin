import React from "react";
import { Card, Typography, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";

import { openMarketplace } from "../../app/slices/marketSlice";

interface BookmarkProps {
  device_line: string;
  specs: string;
  brand: string;
  locations: string[];
  item_type: string;
}

const BookmarkedCard = (props: BookmarkProps) => {
  const { device_line, specs, brand, locations } = props;

  const dispatch = useDispatch();

  const select_device = () => {
    const market_obj = {
      brand,
      specific_specs: specs,
      specific_device: device_line,
      bookmark: true,
      item_type: props.item_type,
    };

    dispatch(openMarketplace(market_obj));
  };
  return (
    <Card
      sx={{
        width: { sm: "100%", md: "30%" },
        maxHeight: "25%",
        borderRadius: 2,
      }}
      onClick={select_device}
    >
      <CardContent>
        <Typography fontWeight="bold">{device_line}</Typography>
        <Typography>{specs}</Typography>
      </CardContent>
    </Card>
  );
};

export default BookmarkedCard;
