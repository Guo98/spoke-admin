import React from "react";
import { Typography, Link, Stack, Button } from "@mui/material";
import RateSelection from "./RateSelection";

interface RecommendationProps {
  price: string;
  product_name: string;
  stock_level: string;
  url_link: string;
  specs: string;
  completeDeviceChoice: Function;
  image_source: string;
  requested_item: string;
}

const Recommendation = (props: RecommendationProps) => {
  const {
    product_name,
    price,
    stock_level,
    url_link,
    specs,
    completeDeviceChoice,
    image_source,
    requested_item,
  } = props;
  return (
    <>
      <Stack direction="row" spacing={2}>
        <img src={image_source} />
        <Stack spacing={1} justifyContent="center" width="100%">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <div>
              <Typography
                display="inline"
                component="span"
                fontWeight="bold"
                fontSize="115%"
              >
                Product Name:{" "}
              </Typography>
              <Typography display="inline" component="span" fontSize="115%">
                {product_name}
              </Typography>
            </div>
            <RateSelection
              recommended_item={product_name}
              recommended_link={url_link}
              requested_item={requested_item}
            />
          </Stack>
          <div>
            <Typography display="inline" component="span" fontWeight="bold">
              Specs:{" "}
            </Typography>
            <Typography display="inline" component="span">
              {specs}
            </Typography>
          </div>
          <div>
            <Typography display="inline" component="span" fontWeight="bold">
              Stock Level:{" "}
            </Typography>
            <Typography
              display="inline"
              component="span"
              color={stock_level === "In Stock" ? "greenyellow" : "red"}
            >
              {stock_level}
            </Typography>
          </div>
          <div>
            <Typography display="inline" component="span" fontWeight="bold">
              Estimated Price:{" "}
            </Typography>
            <Typography display="inline" component="span">
              {price}
            </Typography>
          </div>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Link href={url_link} target="_blank">
              Link to Product
            </Link>
            <Button
              variant="contained"
              sx={{ borderRadius: "10px", mt: 2 }}
              onClick={() =>
                completeDeviceChoice(
                  product_name,
                  specs,
                  url_link,
                  "United States",
                  price,
                  image_source,
                  stock_level
                )
              }
            >
              Request Quote
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Recommendation;
