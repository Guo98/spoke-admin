import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  Button,
  Stack,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  Link,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import { useAuth0 } from "@auth0/auth0-react";
import { standardGet } from "../../../services/standard";
import Recommendation from "./Recommendation";

interface CheckStockProps {
  type: string;
  setLoading: Function;
  brand: string;
  completeDeviceChoice: Function;
  spec: string;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  marginTop: "10px",
  mb: 1,
};

const CheckStock = (props: CheckStockProps) => {
  const { type, spec, setLoading, brand, completeDeviceChoice } = props;

  const [loading, setBoxLoading] = useState(false);
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [url_link, setUrlLink] = useState("");
  const [product_name, setProdName] = useState("");
  const [aispecs, setAISpecs] = useState("");
  const [rec, setRec] = useState<any | null>(null);
  const [stock_checked, setStockChecked] = useState(false);

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
      if (stockResp.data.recommendation) {
        setRec(stockResp.data.recommendation);
      }
    }
    setLoading(false);
    setBoxLoading(false);
  };

  return (
    <>
      {stock_checked && (
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          pt={2}
        >
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
            <div style={{ paddingTop: 2 }}>
              <Typography display="inline" component="span" fontWeight="bold">
                Stock Level:{" "}
              </Typography>
              <Typography display="inline" component="span">
                {stock}
              </Typography>
            </div>
            <div style={{ paddingTop: 2 }}>
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
          </div>
          <Tooltip title="Request Quote">
            <IconButton
              color="primary"
              onClick={() =>
                completeDeviceChoice(product_name, aispecs, url_link)
              }
            >
              <RequestQuoteIcon sx={{ mr: 2 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
      {rec && (
        <Recommendation
          price={rec.price}
          stock_level={rec.stock_level}
          product_name={rec.product_name}
          url_link={rec.url_link}
          specs={rec.specs}
          completeDeviceChoice={completeDeviceChoice}
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
