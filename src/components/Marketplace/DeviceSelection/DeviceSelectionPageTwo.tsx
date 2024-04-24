import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";

import CheckStockSection from "../AI/CheckStockSection";
import { RootState } from "../../../app/store";
import { button_style, textfield_style } from "../../../utilities/styles";
import LinearLoading from "../../common/LinearLoading";

import { ScrapedStockInfo } from "../../../interfaces/marketplace";
import { setState } from "../../../app/slices/recipientSlice";

interface PageTwoProps {
  spec_options: any;
  device_line: string;
  setPage: Function;
  brand: string;
  setScrapedInfo: Function;
  scraped_info: ScrapedStockInfo | null;
  setDeviceUrl: Function;
  setDeviceLocation: Function;
  setDeviceColor: Function;
  setSupplier: Function;
  setRequestType: Function;
}

const DeviceSelectionPageTwo = (props: PageTwoProps) => {
  const {
    spec_options,
    device_line,
    setPage,
    brand,
    scraped_info,
    setScrapedInfo,
    setDeviceColor,
    setDeviceLocation,
    setDeviceUrl,
  } = props;

  const client_data = useSelector((state: RootState) => state.client.data);
  const selected_client = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const [region, setRegion] = useState("");
  const [color, setColor] = useState("");
  const [other_region, setOtherRegion] = useState("");
  const [other_color, setOtherColor] = useState("");
  const [supplier, setSupplier] = useState("");
  const [product_link, setProductLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [check_stock, setCheckStock] = useState(false);

  const handleRegionChange = (event: SelectChangeEvent) => {
    setRegion(event.target.value);
    setDeviceLocation(event.target.value);
  };

  const handleColorChange = (event: SelectChangeEvent) => {
    setColor(event.target.value);
    setDeviceColor(event.target.value);

    if (
      spec_options.colors_by_location[region][event.target.value] &&
      Object.keys(
        spec_options.colors_by_location[region][event.target.value]
      ) &&
      Object.keys(spec_options.colors_by_location[region][event.target.value])
        .length === 1
    ) {
      const supplier_key = Object.keys(
        spec_options.colors_by_location[region][event.target.value]
      )[0];

      setSupplier(supplier_key);
      props.setSupplier(supplier_key);
      setProductLink(
        spec_options.colors_by_location[region][event.target.value][
          supplier_key
        ]
      );
      setDeviceUrl(
        spec_options.colors_by_location[region][event.target.value][
          supplier_key
        ]
      );
    }

    setCheckStock(false);
    setScrapedInfo(null);
  };

  const handleSupplierChange = (event: SelectChangeEvent) => {
    setSupplier(event.target.value);
    props.setSupplier(event.target.value);
  };

  const isInStock = () => {
    if (supplier.toLowerCase() === "cdw") {
      if (
        scraped_info !== null &&
        scraped_info.stock_level.toLowerCase().includes("in stock")
      ) {
        if (
          selected_client === "Alma" ||
          client_data === "Alma" ||
          selected_client === "public"
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const completeDeviceChoice = () => {};

  const canContinue = () => {
    if (region === "" || color === "") {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (!loading) {
      setCheckStock(false);
    }
  }, [loading]);

  return (
    <Stack spacing={2}>
      <Divider textAlign="left">
        <Typography>Device Options</Typography>
      </Divider>
      <FormControl fullWidth size="small" sx={textfield_style} required>
        <InputLabel id="region-select-label">Shipping Region</InputLabel>
        <Select
          labelId="region-select-label"
          label="Shipping Region"
          onChange={handleRegionChange}
          required
          id="region-modal-select-type"
          value={region}
        >
          {spec_options.colors_by_location &&
            Object.keys(spec_options.colors_by_location).map((location) => (
              <MenuItem value={location}>{location}</MenuItem>
            ))}
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      {region === "Other" && (
        <TextField
          sx={textfield_style}
          label="Other Region"
          value={other_region}
          onChange={(e) => {
            setOtherRegion(e.target.value);
            setDeviceLocation(e.target.value);
          }}
          size="small"
          required
        />
      )}
      {region !== "" && region !== "Other" && (
        <FormControl fullWidth size="small" sx={textfield_style} required>
          <InputLabel id="color-select-label">Device Color</InputLabel>
          <Select
            labelId="color-select-label"
            label="Device Color"
            onChange={handleColorChange}
            required
            id="color-modal-select-type"
            value={color}
          >
            {spec_options.colors_by_location[region] &&
              Object.keys(spec_options.colors_by_location[region]) &&
              Object.keys(spec_options.colors_by_location[region]).length > 0 &&
              Object.keys(spec_options.colors_by_location[region]).map(
                (color: string) => <MenuItem value={color}>{color}</MenuItem>
              )}
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      )}
      {(color === "Other" || region === "Other") && (
        <TextField
          sx={textfield_style}
          label="Other Color"
          value={other_color}
          onChange={(e) => {
            setOtherColor(e.target.value);
            setDeviceColor(e.target.value);
          }}
          size="small"
          required
        />
      )}
      {color !== "Other" &&
        color !== "" &&
        spec_options.colors_by_location[region][color] &&
        Object.keys(spec_options.colors_by_location[region][color]) &&
        Object.keys(spec_options.colors_by_location[region][color]).length >
          1 && (
          <FormControl fullWidth size="small" sx={textfield_style} required>
            <InputLabel id="supplier-select-label">Supplier</InputLabel>
            <Select
              labelId="supplier-select-label"
              label="Supplier"
              onChange={handleSupplierChange}
              required
              id="supplier-modal-select-type"
              value={supplier}
            >
              {Object.keys(spec_options.colors_by_location[region][color]).map(
                (s) => (
                  <MenuItem value={s}>{s}</MenuItem>
                )
              )}
            </Select>
          </FormControl>
        )}
      {loading && <LinearLoading />}
      <CheckStockSection
        type={device_line}
        spec={spec_options.spec}
        brand={brand}
        setLoading={setLoading}
        supplier={supplier}
        product_link={product_link}
        others={brand === "Others"}
        client={client_data === "spokeops" ? selected_client : client_data}
        color={color}
        region={region}
        completeDeviceChoice={completeDeviceChoice}
        is_page={true}
        show_button={false}
        check_stock={check_stock}
        setScrapedInfo={setScrapedInfo}
      />
      <Stack direction="row" justifyContent="space-between">
        <Button onClick={() => setPage(0)}>Back</Button>
        <Stack direction="row" spacing={2}>
          {(region === "United States" ||
            region === "Netherlands" ||
            region === "Poland") &&
            color !== "" && (
              <Button
                variant="contained"
                sx={button_style}
                onClick={() => setCheckStock(true)}
                disabled={check_stock}
              >
                Check Supplier's Stock
              </Button>
            )}
          {isInStock() && (
            <Button
              variant="contained"
              sx={button_style}
              onClick={() => {
                props.setRequestType("buy");
                setPage(3);
              }}
            >
              Buy Directly From CDW
            </Button>
          )}
          <Button
            variant="contained"
            sx={button_style}
            disabled={canContinue()}
            onClick={() => setPage(2)}
          >
            Add Accessories
          </Button>
          <Button
            variant="contained"
            sx={button_style}
            disabled={canContinue()}
            onClick={() => setPage(3)}
          >
            Request Quote
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DeviceSelectionPageTwo;
