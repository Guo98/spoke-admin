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
  types: any;
  setLoading: Function;
  brand: string;
  completeDeviceChoice: Function;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  marginTop: "10px",
  mb: 1,
};

const CheckStock = (props: CheckStockProps) => {
  const { types, setLoading, brand, completeDeviceChoice } = props;
  const [type, setType] = useState("");
  const [typeIndex, setTypeIndex] = useState(-1);
  const [specs, setSpecs] = useState("");
  const [specIndex, setSpecIndex] = useState(-1);
  const [loading, setBoxLoading] = useState(false);
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [url_link, setUrlLink] = useState("");
  const [product_name, setProdName] = useState("");
  const [aispecs, setAISpecs] = useState("");
  const [rec, setRec] = useState<any | null>(null);
  const [stock_checked, setStockChecked] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
    setTypeIndex(
      types.map((type: any) => type.type).indexOf(event.target.value)
    );
  };

  const handleSpecsChange = (event: SelectChangeEvent) => {
    if (event.target.value === "Others") {
      setSpecIndex(-1);
    } else {
      const specIndex = types[typeIndex].specs
        ?.map((spec: any) => spec.spec)
        .indexOf(event.target.value);
      setSpecIndex(specIndex);
    }
    setSpecs(event.target.value);
  };

  const checkStock = async () => {
    setLoading(true);
    setBoxLoading(true);
    const accessToken = await getAccessTokenSilently();
    const stockResp = await standardGet(
      accessToken,
      "checkstock/" + brand + " " + type + " " + specs
    );

    if (stockResp.status === "Successful") {
      console.log("stock resp ::::::::: ", stockResp.data);
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
      <FormControl fullWidth sx={textFieldStyle} required size="small">
        <InputLabel id="type-select-label">Device Type</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          label="Device Type"
          onChange={handleTypeChange}
          value={type}
          required
        >
          {types &&
            types.length > 0 &&
            types.map((brandtype: any) => {
              return (
                <MenuItem value={brandtype.type}>{brandtype.type}</MenuItem>
              );
            })}
        </Select>
      </FormControl>
      {type !== "" && (
        <FormControl
          fullWidth
          sx={textFieldStyle}
          required
          size="small"
          disabled={type === ""}
        >
          <InputLabel id="specs-select-label">Specs</InputLabel>
          <Select
            labelId="specs-select-label"
            id="specs-select"
            label="Specs"
            onChange={handleSpecsChange}
            value={specs}
            required
          >
            {type !== "" &&
              typeIndex !== -1 &&
              types[typeIndex].specs?.map((spec: any) => {
                return <MenuItem value={spec.spec}>{spec.spec}</MenuItem>;
              })}
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      )}
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
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button
          disabled={stock_checked || loading}
          variant="contained"
          onClick={checkStock}
        >
          {!loading ? "Check Stock" : <CircularProgress />}
        </Button>
      </Stack>
    </>
  );
};

export default CheckStock;
