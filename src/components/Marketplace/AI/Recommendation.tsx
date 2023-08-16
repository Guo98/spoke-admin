import React from "react";
import {
  Typography,
  Divider,
  Link,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

interface RecommendationProps {
  price: string;
  product_name: string;
  stock_level: string;
  url_link: string;
  specs: string;
  completeDeviceChoice: Function;
  image_source: string;
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
  } = props;
  return (
    <>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <img src={image_source} />
        <Stack spacing={1} justifyContent="center">
          <div>
            <Typography display="inline" component="span" fontWeight="bold">
              Product Name:{" "}
            </Typography>
            <Typography display="inline" component="span">
              {product_name}
            </Typography>
          </div>
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
          <Link href={url_link} target="_blank">
            Link to Product
          </Link>
        </Stack>
        <Tooltip title="Request Quote">
          <IconButton
            color="primary"
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
            <RequestQuoteIcon sx={{ mr: 2 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </>
  );
};

export default Recommendation;
