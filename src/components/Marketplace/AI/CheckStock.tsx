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
import { customer_ids } from "../../../utilities/cdw-mappings";

import { button_style } from "../../../utilities/styles";

interface CheckStockProps {
  type: string;
  setLoading: Function;
  brand: string;
  completeDeviceChoice: Function;
  spec: string;
  supplier?: string;
  product_link?: string;
  others: boolean;
  client: string;
  color: string;
  region: string;
  is_page?: boolean;
  show_button: boolean;
  check_stock?: boolean;
  setScrapedInfo?: Function;
}

const CheckStock = (props: CheckStockProps) => {
  const {
    type,
    spec,
    setLoading,
    brand,
    completeDeviceChoice,
    others,
    client,
    color,
    region,
  } = props;

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
  const [cdw_part_no, setCDWPartNo] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setStockChecked(false);
    setRecs([]);
    setStatus(-1);
  }, [spec, type, props.supplier]);

  const checkStock = async () => {
    setLoading(true);
    setBoxLoading(true);
    const accessToken = await getAccessTokenSilently();
    let checkObj: any = {
      item_name: brand + " " + type,
      specs: spec,
      supplier:
        region !== "United States"
          ? "bechtle"
          : props.supplier !== ""
          ? props.supplier
          : "cdw",
      others,
      color,
      location: region,
    };
    if (props.product_link !== "") {
      checkObj.product_link = props.product_link;
    }
    const stockResp = await standardPost(accessToken, "checkstock", checkObj);

    if (stockResp.status === "Successful") {
      setStockChecked(true);

      if (stockResp.data?.stock_level !== "Not Found") {
        if (stockResp.data) {
          setStock(stockResp.data.stock_level);
          setPrice(stockResp.data.price);
          setProdName(stockResp.data.product_name);
          setUrlLink(stockResp.data.url_link);
          setAISpecs(stockResp.data.specs);
          setImgSrc(stockResp.data.image_source);
          setCDWPartNo(stockResp.data.cdw_part_no);
          setStatus(0);
        }

        if (props.setScrapedInfo) {
          props.setScrapedInfo({
            device_url: stockResp.data.url_link,
            stock_level: stockResp.data.stock_level,
            est_price: stockResp.data.price,
            image_source: stockResp.data.image_source,
            scraped_specs: stockResp.data.specs,
            scraped_name: stockResp.data.product_name,
            supplier:
              region !== "United States"
                ? "bechtle"
                : props.supplier !== ""
                ? props.supplier
                : "cdw",
            cdw_part_no: stockResp.data.cdw_part_no,
          });
        }
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

  useEffect(() => {
    if (props.check_stock && !stock_checked) {
      checkStock().catch();
    }
  }, [props.check_stock]);

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
                      color={
                        stock.toLowerCase().includes("in stock")
                          ? "greenyellow"
                          : "red"
                      }
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
              <Link href={url_link} target="_blank">
                Link to Product
              </Link>
            </Stack>
          </Stack>
          {!props.is_page && (
            <Stack
              direction="row"
              spacing={2}
              pt={1}
              justifyContent="space-between"
            >
              {(client === "Alma" || client === "public") &&
                props.supplier === "cdw" &&
                region === "United States" && (
                  <Button
                    variant="contained"
                    sx={button_style}
                    fullWidth
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
                        props.supplier,
                        cdw_part_no,
                        "buy",
                        true
                      )
                    }
                  >
                    Buy Now
                  </Button>
                )}
              <Button
                variant="contained"
                sx={button_style}
                fullWidth
                onClick={() =>
                  completeDeviceChoice(
                    type,
                    spec,
                    url_link,
                    "United States",
                    price,
                    img_src,
                    stock,
                    aispecs,
                    props.supplier,
                    "",
                    "quote",
                    true
                  )
                }
              >
                Add Accessories
              </Button>
              <Button
                variant="contained"
                sx={button_style}
                fullWidth
                onClick={() =>
                  completeDeviceChoice(
                    type,
                    spec,
                    url_link,
                    "United States",
                    price,
                    img_src,
                    stock,
                    aispecs,
                    props.supplier,
                    "",
                    "quote",
                    false
                  )
                }
              >
                Request Quote
              </Button>
            </Stack>
          )}
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
          {props.show_button && (
            <Button
              disabled={loading}
              variant="contained"
              onClick={checkStock}
              fullWidth
              sx={button_style}
              id="marketplace-purchase-modal-check-stock"
            >
              {!loading ? "Check Supplier's Stock" : <CircularProgress />}
            </Button>
          )}
          {!props.is_page && (
            <Button
              variant="contained"
              sx={button_style}
              fullWidth
              disabled={loading}
              id="marketplace-purchase-modal-add-accessories"
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
                  props.supplier,
                  "",
                  "quote",
                  true
                )
              }
            >
              Add Accessories
            </Button>
          )}
          {!props.is_page && (
            <Button
              fullWidth
              variant="contained"
              sx={button_style}
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
                  props.supplier,
                  "",
                  "quote",
                  false
                )
              }
              disabled={loading}
              id="marketplace-purchase-modal-request-quote"
            >
              Request Quote
            </Button>
          )}
        </Stack>
      )}
    </>
  );
};

export default CheckStock;
