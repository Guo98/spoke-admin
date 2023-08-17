import React, { useState } from "react";
import {
  Button,
  Stack,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  Link,
} from "@mui/material";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { useAuth0 } from "@auth0/auth0-react";
import { standardGet } from "../../../services/standard";
import Recommendations from "./Recommendations";

interface CheckStockProps {
  type: string;
  setLoading: Function;
  brand: string;
  completeDeviceChoice: Function;
  spec: string;
}

const CheckStock = (props: CheckStockProps) => {
  const { type, spec, setLoading, brand, completeDeviceChoice } = props;

  const [loading, setBoxLoading] = useState(false);
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [url_link, setUrlLink] = useState("");
  const [product_name, setProdName] = useState("");
  const [aispecs, setAISpecs] = useState("");
  const [recs, setRecs] = useState<any[]>([]);
  const [stock_checked, setStockChecked] = useState(false);
  const [img_src, setImgSrc] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const checkStock = async () => {
    setLoading(true);
    setBoxLoading(true);
    const accessToken = await getAccessTokenSilently();
    const stockResp = await standardGet(
      accessToken,
      "checkstock/" + brand + " " + type + " " + spec
    );

    if (stockResp.status === "Successful") {
      setStockChecked(true);
      setStock(stockResp.data.stock_level);
      setPrice(stockResp.data.price);
      setProdName(stockResp.data.product_name);
      setUrlLink(stockResp.data.url_link);
      setAISpecs(stockResp.data.specs);
      setImgSrc(stockResp.data.image_source);
      if (stockResp.data.recommendations) {
        setRecs(stockResp.data.recommendations);
      }
    }
    setLoading(false);
    setBoxLoading(false);
  };

  return (
    <>
      {stock_checked && (
        <Stack direction="row" spacing={2} pt={2}>
          <img src={img_src} alt="Laptop Picture" />
          <div>
            <Typography fontWeight="bold" variant="h6" pb={2}>
              Requested Item:
            </Typography>
            <div style={{ paddingTop: 2 }}>
              <Typography display="inline" component="span" fontWeight="bold">
                Product Name:{" "}
              </Typography>
              <Typography display="inline" component="span">
                {product_name}
              </Typography>
            </div>
            <div style={{ paddingTop: 2 }}>
              <Typography display="inline" component="span" fontWeight="bold">
                Specs:{" "}
              </Typography>
              <Typography display="inline" component="span">
                {aispecs}
              </Typography>
            </div>
            {stock !== "" && (
              <div style={{ paddingTop: 2 }}>
                <Typography display="inline" component="span" fontWeight="bold">
                  Stock Level:{" "}
                </Typography>
                <Typography
                  display="inline"
                  component="span"
                  color={stock === "In Stock" ? "greenyellow" : "red"}
                >
                  {stock}
                </Typography>
              </div>
            )}
            {price !== "" && (
              <div style={{ paddingTop: 2 }}>
                <Typography display="inline" component="span" fontWeight="bold">
                  Estimated Price:{" "}
                </Typography>
                <Typography display="inline" component="span">
                  {price}
                </Typography>
              </div>
            )}
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
                    aispecs,
                    url_link,
                    "United States",
                    "",
                    price,
                    stock
                  )
                }
              >
                Request Quote
              </Button>
            </Stack>
          </div>
        </Stack>
      )}
      {recs.length > 0 && (
        <Recommendations
          completeDeviceChoice={completeDeviceChoice}
          recommendations={recs}
          requested_item={brand + " " + type + " " + spec}
        />
      )}
      {!stock_checked && (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 2 }}
        >
          <Button
            disabled={stock_checked || loading}
            variant="contained"
            onClick={checkStock}
            fullWidth
            sx={{ borderRadius: "10px" }}
          >
            {!loading ? "Check Stock" : <CircularProgress />}
          </Button>
        </Stack>
      )}
    </>
  );
};

export default CheckStock;
