import React from "react";
import { Typography, Divider } from "@mui/material";

interface RecommendationProps {
  price: string;
  product_name: string;
  stock_level: string;
  url_link: string;
}

const Recommendation = (props: RecommendationProps) => {
  const { product_name, price, stock_level, url_link } = props;
  return (
    <>
      <Divider />
      <Typography fontWeight="bold">Recommended Replacement:</Typography>
      <Typography>{product_name}</Typography>
    </>
  );
};

export default Recommendation;
