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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuth0 } from "@auth0/auth0-react";
import { standardGet } from "../../../services/standard";

interface CheckStockProps {
  types: any;
  setLoading: Function;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  marginTop: "10px",
  mb: 1,
};

const CheckStock = (props: CheckStockProps) => {
  const { types, setLoading } = props;
  const [type, setType] = useState("");
  const [typeIndex, setTypeIndex] = useState(-1);
  const [specs, setSpecs] = useState("");
  const [specIndex, setSpecIndex] = useState(-1);
  const [loading, setBoxLoading] = useState(false);
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");

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
      "checkstock/" + type + " " + specs
    );

    if (stockResp.status === "Successful") {
      console.log("stock resp ::::::::: ", stockResp.data);
      setStock(stockResp.data.stock_level);
      setPrice(stockResp.data.price);
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
      {stock !== "" && (
        <div style={{ paddingTop: 2 }}>
          <Typography display="inline" component="span" fontWeight="bold">
            Stock Level:{" "}
          </Typography>
          <Typography display="inline" component="span">
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
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button
          disabled={specs === "" || type === "" || loading}
          variant="contained"
          onClick={checkStock}
        >
          {!loading ? "Check Stock" : <CircularProgress />}
        </Button>
        {stock === "In Stock" && (
          <Button variant="contained">Get Recommendations</Button>
        )}
      </Stack>
    </>
  );
};

export default CheckStock;
