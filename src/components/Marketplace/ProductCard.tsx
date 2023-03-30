import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface ProductProps {
  cardAction: Function;
  label: string;
  imgSrc: string;
  index: number;
}

const ProductCard = (props: ProductProps) => {
  const { label, imgSrc, cardAction, index } = props;

  return (
    <Card
      sx={{
        minWidth: "275px",
        maxWidth: "500px",
        margin: "10px",
        borderRadius: 2,
        boxShadow: "5px 5px 5px gray",
      }}
      onClick={() => cardAction(label, index)}
    >
      <CardMedia
        image={imgSrc}
        title={label}
        component="img"
        height="175px"
        sx={{
          objectFit: "contain",
          paddingTop: "15px",
          backgroundColor: "white",
        }}
      />
      <CardContent>
        <Typography textAlign="center" sx={{ fontWeight: "bold" }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
