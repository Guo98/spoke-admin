import React, { useState, useEffect } from "react";
import {
  Button,
  Stack,
  CircularProgress,
  Typography,
  Alert,
  Link,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { standardGet, standardPost } from "../../../services/standard";
import Recommendations from "./Recommendations";

interface CheckStockProps {
  type: string;
  setLoading: Function;
  brand: string;
  completeDeviceChoice: Function;
  spec: string;
  supplier?: string;
  product_link?: string;
  others: boolean;
}

const CheckStock = (props: CheckStockProps) => {
  const { type, spec, setLoading, brand, completeDeviceChoice, others } = props;

  const [status, setStatus] = useState(-1);

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

  useEffect(() => {
    setStockChecked(false);
    setRecs([]);
    setStatus(-1);
  }, [spec, type]);

  const checkStock = async () => {
    setLoading(true);
    setBoxLoading(true);
    const accessToken = await getAccessTokenSilently();
    let checkObj: any = {
      item_name: brand + " " + type,
      specs: spec,
      supplier: props.supplier !== "" ? props.supplier : "cdw",
      others,
    };
    if (props.product_link !== "") {
      checkObj.product_link = props.product_link;
    }
    const stockResp = await standardPost(accessToken, "checkstock", checkObj);

    if (stockResp.status === "Successful") {
      setStockChecked(true);
      if (stockResp.data.stock_level !== "Not Found") {
        setStock(stockResp.data.stock_level);
        setPrice(stockResp.data.price);
        setProdName(stockResp.data.product_name);
        setUrlLink(stockResp.data.url_link);
        setAISpecs(stockResp.data.specs);
        setImgSrc(stockResp.data.image_source);
        setStatus(0);
      } else {
        setStatus(2);
      }
      if (stockResp.data.recommendations) {
        setRecs(stockResp.data.recommendations);
      }
    } else {
      setStatus(1);
    }
    setLoading(false);
    setBoxLoading(false);
  };

  return (
    <>
      {stock_checked && status === 1 && (
        <Alert severity="error">
          Issue with checking stock for this device, please try again later.
        </Alert>
      )}
      {stock_checked && status === 2 && (
        <Typography>
          No result found, please select a new configuration.
        </Typography>
      )}
      {stock_checked && status === 0 && (
        <>
          <Typography fontWeight="bold" variant="h6" pb={1}>
            Requested Item:
          </Typography>
          <Stack direction="row" spacing={2} pt={2}>
            <img
              src={img_src}
              alt="Laptop Picture"
              style={{ maxHeight: 219, maxWidth: 200 }}
            />
            <Stack spacing={1} justifyContent="center" width="100%">
              <div>
                <div style={{ paddingTop: 2 }}>
                  <Typography
                    display="inline"
                    component="span"
                    fontWeight="bold"
                  >
                    Product Name:{" "}
                  </Typography>
                  <Typography display="inline" component="span">
                    {product_name}
                  </Typography>
                </div>
                <div style={{ paddingTop: 2 }}>
                  <Typography
                    display="inline"
                    component="span"
                    fontWeight="bold"
                  >
                    Specs:{" "}
                  </Typography>
                  <Typography display="inline" component="span">
                    {aispecs}
                  </Typography>
                </div>
                {stock !== "" && (
                  <div style={{ paddingTop: 2 }}>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
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
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
                      Estimated Price:{" "}
                    </Typography>
                    <Typography display="inline" component="span">
                      {price}
                    </Typography>
                  </div>
                )}
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
                  sx={{ borderRadius: "10px" }}
                  onClick={() =>
                    completeDeviceChoice(
                      product_name,
                      spec,
                      url_link,
                      "United States",
                      price,
                      img_src,
                      stock,
                      aispecs,
                      props.supplier
                    )
                  }
                >
                  Request Quote
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </>
      )}
      {recs.length > 0 && (
        <Recommendations
          completeDeviceChoice={completeDeviceChoice}
          recommendations={recs}
          requested_item={brand + " " + type + " " + spec}
          chosen_specs={spec}
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
            disabled={loading}
            variant="contained"
            onClick={checkStock}
            fullWidth
            sx={{ borderRadius: "10px" }}
          >
            {!loading ? "Check Supplier's Stock" : <CircularProgress />}
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ borderRadius: "10px" }}
            onClick={() =>
              completeDeviceChoice(
                type,
                spec,
                "",
                "United States",
                "",
                "",
                "",
                "",
                props.supplier
              )
            }
            disabled={loading}
          >
            Request Quote
          </Button>
        </Stack>
      )}
    </>
  );
};

export default CheckStock;
