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

import {
  ScrapedStockInfo,
  OtherDeviceInfo,
} from "../../../interfaces/marketplace";
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
  setOtherDevice: Function;
  device_color: string;
  device_location: string;
  other_device: OtherDeviceInfo | null;
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
    setOtherDevice,
    device_color,
    device_location,
    other_device,
  } = props;

  const client_data = useSelector((state: RootState) => state.client.data);
  const selected_client = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const [other_brand, setOtherBrand] = useState("");
  const [other_line, setOtherLine] = useState("");
  const [other_specs, setOtherSpecs] = useState("");

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
    if (brand === "Others") {
      if (
        other_brand === "" ||
        other_specs === "" ||
        other_line === "" ||
        other_region === ""
      ) {
        return true;
      }
    } else if (region === "" || color === "") {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (!loading) {
      setCheckStock(false);
    }
  }, [loading]);

  useEffect(() => {
    if (brand === "Others") {
      if (device_color !== "") {
        setOtherColor(device_color);
      }
      if (device_location !== "") {
        setOtherRegion(device_location);
      }
      if (other_device !== null) {
        setOtherBrand(other_device.brand);
        setOtherLine(other_device.line);
        setOtherSpecs(other_device.specs);
      }
    } else {
      if (spec_options.colors_by_location) {
        if (
          Object.keys(spec_options.colors_by_location).includes(device_location)
        ) {
          setRegion(device_location);
        } else {
          setOtherRegion(device_location);
          setRegion("Other");
          setOtherColor(device_color);
          setColor("Other");
        }

        if (spec_options.colors_by_location[device_location]) {
          if (
            Object.keys(spec_options.colors_by_location[region]).includes(
              device_color
            )
          ) {
            setColor(device_color);
          } else {
            setOtherColor(device_color);
            setColor("Other");
          }
        }
      }
    }
  }, [device_color, device_location, other_device]);

  return (
    <Stack spacing={2}>
      <Divider textAlign="left">
        <Typography>Device Options</Typography>
      </Divider>
      {brand !== "Others" && (
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
      )}
      {brand === "Others" && (
        <>
          <TextField
            sx={textfield_style}
            label="Device Brand"
            value={other_brand}
            onChange={(e) => {
              setOtherBrand(e.target.value);
            }}
            size="small"
            helperText="e.g. Apple, Dell, Lenovo"
            required
          />
          <TextField
            sx={textfield_style}
            label="Device Line"
            value={other_line}
            onChange={(e) => {
              setOtherLine(e.target.value);
            }}
            helperText="e.g. Macbook Pro, ThinkPad X1 Carbon, XPS"
            size="small"
            required
          />
          <TextField
            sx={textfield_style}
            label="Device Specs"
            value={other_specs}
            onChange={(e) => {
              setOtherSpecs(e.target.value);
            }}
            helperText='Format specs as Screen Size, CPU, RAM, SSD. eg. 14", M3, 36GB, 1TB'
            size="small"
            required
          />
        </>
      )}
      {(region === "Other" || brand === "Others") && (
        <TextField
          sx={textfield_style}
          label={brand === "Others" ? "Region" : "Other Region"}
          value={other_region}
          onChange={(e) => {
            setOtherRegion(e.target.value);
            setDeviceLocation(e.target.value);
          }}
          size="small"
          required
        />
      )}
      {region !== "" && region !== "Other" && brand !== "Others" && (
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
      {(color === "Other" || region === "Other" || brand === "Others") && (
        <TextField
          sx={textfield_style}
          label={brand === "Others" ? "Color" : "Other Color"}
          value={other_color}
          onChange={(e) => {
            setOtherColor(e.target.value);
            setDeviceColor(e.target.value);
          }}
          size="small"
        />
      )}
      {color !== "Other" &&
        color !== "" &&
        brand !== "Others" &&
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
      {brand !== "Others" && (
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
      )}
      <Stack direction="row" justifyContent="space-between">
        <Button
          onClick={() => {
            if (brand === "Others") {
              setPage(-1);
            } else {
              setPage(0);
            }
          }}
        >
          Back
        </Button>
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
            onClick={() => {
              if (brand === "Others") {
                setOtherDevice({
                  brand: other_brand,
                  line: other_line,
                  specs: other_specs,
                });
              }
              setPage(3);
            }}
          >
            Request Quote
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DeviceSelectionPageTwo;
