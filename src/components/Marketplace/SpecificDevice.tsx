import React, { useState, useEffect } from "react";
import {
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Link,
  Divider,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

import SmallLinearLoading from "../common/SmallLinearLoading";

import { standardPost } from "../../services/standard";

interface SDProps {
  device_name: string;
  supplier_links?: any;
  location: string;
  completeDeviceChoice: Function;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const SpecificDevice = (props: SDProps) => {
  const { device_name, location, completeDeviceChoice } = props;

  const { getAccessTokenSilently } = useAuth0();

  const [supplier, setSupplier] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(-1);

  const [img_src, setImgSrc] = useState("");
  const [price, setPrice] = useState("");
  const [stock_level, setStockLevel] = useState("");
  const [product_link, setProductLink] = useState("");
  const [product_name, setProductName] = useState("");
  const [ai_specs, setAISpecs] = useState("");

  useEffect(() => {
    if (Object.keys(props.supplier_links).length === 1) {
      setSupplier(Object.keys(props.supplier_links)[0].toLowerCase());
    }
  }, [props.supplier_links]);

  const handleSupplierChange = (event: SelectChangeEvent) => {
    setSupplier(event.target.value);
  };

  const checkStock = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    let checkObj: any = {
      item_name: device_name,
      specs: "",
      supplier: supplier,
      product_link: props.supplier_links[supplier],
      others: false,
    };

    const stockResp = await standardPost(accessToken, "checkstock", checkObj);

    if (stockResp.status === "Successful") {
      const {
        image_source,
        price,
        stock_level,
        url_link,
        product_name,
        specs,
      } = stockResp.data;
      setSuccess(0);
      setImgSrc(image_source);
      setPrice(price);
      setStockLevel(stock_level);
      setProductLink(url_link);
      setProductName(product_name);
      setAISpecs(specs);
    } else {
      setSuccess(1);
    }
    setLoading(false);
  };

  return (
    <>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Typography fontWeight="bold" fontSize="115%">
          {device_name}
        </Typography>
        <Typography>{location}</Typography>
        {props.supplier_links &&
          Object.keys(props.supplier_links).length > 0 && (
            <FormControl fullWidth sx={textFieldStyle} required size="small">
              <InputLabel id="supplier-select-label">Supplier</InputLabel>
              <Select
                labelId="supplier-select-label"
                id="supplier-select"
                label="Supplier"
                onChange={handleSupplierChange}
                value={supplier}
                required
              >
                {Object.keys(props.supplier_links).map((s: string) => {
                  return <MenuItem value={s.toLowerCase()}>{s}</MenuItem>;
                })}
              </Select>
            </FormControl>
          )}
        {!loading && success === 0 && (
          <>
            <Divider textAlign="left">Search Result</Divider>
            <Stack direction="row" spacing={2} pt={2}>
              <img
                src={img_src}
                alt="Laptop Picture"
                style={{ maxHeight: 200, maxWidth: 200 }}
              />
              <Stack spacing={2}>
                <Typography>{product_name}</Typography>
                <div>
                  <Typography
                    component="span"
                    display="inline"
                    fontWeight="bold"
                  >
                    Estimated Price:{" "}
                  </Typography>
                  <Typography component="span" display="inline">
                    {price}
                  </Typography>
                </div>
                <div>
                  <Typography
                    component="span"
                    display="inline"
                    fontWeight="bold"
                  >
                    Stock Level:{" "}
                  </Typography>
                  <Typography component="span" display="inline">
                    {stock_level}
                  </Typography>
                </div>
                <Link href={product_link}>Product Link</Link>
              </Stack>
            </Stack>
          </>
        )}
        <Stack direction="row" spacing={2}>
          {props.supplier_links &&
            Object.keys(props.supplier_links).length > 0 && (
              <Button
                variant="contained"
                fullWidth
                sx={{ borderRadius: "10px" }}
                onClick={checkStock}
                disabled={loading}
              >
                {loading ? <SmallLinearLoading /> : "Check Supplier's Stock"}
              </Button>
            )}
          <Button
            variant="contained"
            onClick={() =>
              completeDeviceChoice(
                device_name,
                device_name,
                product_link || "",
                location,
                price || "",
                img_src || "",
                stock_level || "",
                ai_specs || "",
                supplier
              )
            }
            fullWidth
            sx={{ borderRadius: "10px" }}
            disabled={loading}
          >
            Request Quote
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

/**
 *     dn: string,
    ds: string,
    du: string = "",
    region: string,
    price: string,
    image_source: string,
    stock_level: string,
    ai_specs: string,
    sup: string
 */

export default SpecificDevice;
