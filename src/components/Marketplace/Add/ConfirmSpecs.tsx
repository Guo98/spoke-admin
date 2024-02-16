import React, { useState, useEffect } from "react";
import {
  Typography,
  Stack,
  IconButton,
  Divider,
  Button,
  TextField,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth0 } from "@auth0/auth0-react";

import { standardPost } from "../../../services/standard";

import { button_style, textfield_style } from "../../../utilities/styles";
import LinearLoading from "../../common/LinearLoading";

interface ConfirmProps {
  back: Function;
  specs: any;
  client: string;
  supplier_url: string;
  refresh: Function;
}

const ConfirmSpecs = (props: ConfirmProps) => {
  const { back, specs, supplier_url, client, refresh } = props;

  const [device_name, setDeviceName] = useState(specs.name || "");
  const [screen_size, setScreenSize] = useState(specs.screen_size || "");
  const [cpu, setCPU] = useState(specs.cpu || "");
  const [ram, setRAM] = useState(specs.ram || "");
  const [ssd, setSSD] = useState(specs.hard_drive || "");
  const [color, setColor] = useState(specs.color || "");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(-1);

  const { getAccessTokenSilently } = useAuth0();

  const add_device = async () => {
    setLoading(true);
    const access_token = await getAccessTokenSilently();

    let body: any = {
      client,
      type: specs.device_type,
      brand: specs.brand,
      supplier_url,
      locations: [location],
      supplier: specs.supplier,
      img_src: specs.image_source,
    };

    if (specs.device_type === "laptops") {
      body = {
        ...body,
        device_line: specs.device_line,
        screen_size: specs.screen_size,
        cpu: specs.cpu,
        ram: specs.ram,
        ssd: specs.hard_drive,
        color: specs.color,
      };
    } else if (specs.device_type === "accessories") {
      body = {
        ...body,
        item_name: device_name,
      };
    } else if (specs.device_type === "phones") {
      body = {
        ...body,
        item_name: device_name,
        device_line: specs.device_line,
        color: specs.color,
      };
    }
    if (specs.supplier.toLowerCase() === "insight") {
      body.sku = specs.sku;
    }

    const add_resp = await standardPost(access_token, "marketplace/add", body);

    if (add_resp.status === "Successful") {
      setSuccess(0);
      await refresh();
    } else {
      setSuccess(1);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (
      supplier_url.includes("www.cdw.com") ||
      supplier_url.includes("www.insight.com")
    ) {
      setLocation("United States");
    }
  }, [supplier_url]);

  return (
    <>
      {!loading ? (
        <Stack spacing={2} id="confirm-specs-stack">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => back(0)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography component="h4" variant="h5">
              Device Details
            </Typography>
          </Stack>
          <Divider />
          {success !== -1 && (
            <Alert severity={success === 0 ? "success" : "error"}>
              {success === 0
                ? "Successfully added to marketplace!"
                : "Error in adding to marketplace."}
            </Alert>
          )}
          <Stack spacing={1} id="confirm-specs-details-stack">
            <Typography id="confirm-specs-product-name">
              Product Name: {specs.name}
            </Typography>
            {specs.supplier && (
              <Typography id="confirm-specs-supplier">
                Supplier: {specs.supplier}
              </Typography>
            )}
            {specs.stock_level && (
              <Typography id="confirm-specs-stock-level">
                Stock Level: {specs.stock_level}
              </Typography>
            )}
            {specs.price && (
              <Typography id="confirm-specs-est-price">
                Estimated Price: {specs.price}
              </Typography>
            )}
            {specs.image_source && (
              <Stack direction="row" justifyContent="space-evenly">
                <img
                  src={specs.image_source}
                  title="Device Picture"
                  loading="lazy"
                  style={{ width: "40%", height: "40%" }}
                />
              </Stack>
            )}
          </Stack>
          <TextField
            label="Device Title"
            value={device_name}
            size="small"
            sx={textfield_style}
            onChange={(e) => setDeviceName(e.target.value)}
            id="confirm-specs-text-product-name"
          />
          {(specs.device_type === "laptops" ||
            specs.device_type === "desktops") && (
            <Stack spacing={2} id="confirm-specs-device-details-stack">
              <Stack direction="row" spacing={2}>
                <TextField
                  size="small"
                  sx={textfield_style}
                  label="Screen Size"
                  fullWidth
                  value={screen_size}
                  onChange={(e) => setScreenSize(e.target.value)}
                  id="confirm-specs-text-screen"
                />
                <TextField
                  size="small"
                  sx={textfield_style}
                  label="CPU"
                  fullWidth
                  value={cpu}
                  onChange={(e) => setCPU(e.target.value)}
                  id="confirm-specs-text-cpu"
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  size="small"
                  sx={textfield_style}
                  label="RAM"
                  fullWidth
                  value={ram}
                  onChange={(e) => setRAM(e.target.value)}
                  id="confirm-specs-text-ram"
                />
                <TextField
                  size="small"
                  sx={textfield_style}
                  label="SSD"
                  fullWidth
                  value={ssd}
                  onChange={(e) => setSSD(e.target.value)}
                  id="confirm-specs-text-ssd"
                />
              </Stack>
              <TextField
                label="Color"
                value={color}
                size="small"
                sx={textfield_style}
                onChange={(e) => setColor(e.target.value)}
                id="confirm-specs-text-color"
              />
            </Stack>
          )}
          <TextField
            label="Location"
            value={location}
            size="small"
            sx={textfield_style}
            onChange={(e) => setLocation(e.target.value)}
            id="confirm-specs-text-location"
          />
          <Divider />
          <Button
            variant="contained"
            sx={button_style}
            onClick={add_device}
            disabled={loading || success === 0}
            id="confirm-specs-add-button"
          >
            {loading ? <LinearLoading /> : "Add to Marketplace"}
          </Button>
        </Stack>
      ) : (
        <LinearLoading />
      )}
    </>
  );
};

export default ConfirmSpecs;
