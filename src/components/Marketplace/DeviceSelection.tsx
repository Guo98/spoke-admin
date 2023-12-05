import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import CheckStock from "./AI/CheckStock";
import { event } from "cypress/types/jquery";

interface DeviceSelectionProps {
  types: any;
  setLoading: Function;
  brand: string;
  completeDeviceChoice: Function;
  clear_device: boolean;
  setClear: Function;
  loading: boolean;
  suppliers?: any;
  client: string;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  mb: 2,
};

const DeviceSelection = (props: DeviceSelectionProps) => {
  const {
    types,
    setLoading,
    brand,
    completeDeviceChoice,
    clear_device,
    setClear,
    loading,
    client,
  } = props;

  const [other_brand, setOtherBrand] = useState("");

  const [type, setType] = useState("");
  const [typeIndex, setTypeIndex] = useState(-1);
  const [other_type, setOtherType] = useState("");

  const [specs, setSpecs] = useState("");
  const [specIndex, setSpecIndex] = useState(-1);
  const [other_specs, setOtherSpecs] = useState("");
  const [color, setColor] = useState("");

  const [region, setRegion] = useState("");
  const [other_region, setOtherRegion] = useState("");
  const [supplier, setSupplier] = useState("");
  const [product_link, setProductLink] = useState("");

  useEffect(() => {
    if (clear_device) {
      setClear(false);
      if (brand !== "Others") {
        setType("");
        setTypeIndex(-1);
        setOtherType("");
        setSpecs("");
        setSpecIndex(-1);
        setOtherSpecs("");
        setRegion("");
        setOtherRegion("");
        setColor("");
        setSupplier("");
        setProductLink("");
      } else {
        setOtherBrand("");
        setOtherType("");
        setOtherSpecs("");
        setOtherRegion("");
      }
    }
  }, [clear_device]);

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
      setSupplier(
        types[typeIndex]?.specs[specIndex]?.supplier &&
          Object.keys(types[typeIndex]?.specs[specIndex]?.supplier)[0]
          ? Object.keys(types[typeIndex]?.specs[specIndex]?.supplier)[0]
          : ""
      );
    }
    setSpecs(event.target.value);
    setOtherSpecs("");
  };

  const handleRegionChange = (event: SelectChangeEvent) => {
    setRegion(event.target.value);
    if (event.target.value === "United States") {
      if (
        types[typeIndex]?.specs[specIndex]?.supplier &&
        types[typeIndex]?.specs[specIndex]?.supplier?.cdw &&
        types[typeIndex]?.specs[specIndex]?.supplier?.cdw[color]
      ) {
        setProductLink(
          types[typeIndex]?.specs[specIndex]?.supplier?.cdw[color]
        );
      }
    }
  };

  const handleSupplierChange = (event: SelectChangeEvent) => {
    setSupplier(event.target.value);
    if (
      types[typeIndex]?.specs[specIndex]?.supplier &&
      types[typeIndex]?.specs[specIndex]?.supplier[event.target.value] &&
      types[typeIndex]?.specs[specIndex]?.supplier[event.target.value][color]
    ) {
      setProductLink(
        types[typeIndex]?.specs[specIndex]?.supplier[event.target.value][color]
      );
    }
  };

  const handleColorChange = (event: SelectChangeEvent) => {
    setColor(event.target.value);
  };

  return (
    <>
      {brand !== "Others" && (
        <FormControl
          fullWidth
          sx={{ ...textFieldStyle, mt: 3 }}
          required
          size="small"
        >
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
      )}
      {brand === "Others" && (
        <>
          <Autocomplete
            sx={{ ...textFieldStyle, mt: 2 }}
            id="solo-brand"
            inputValue={other_brand}
            onChange={(e, v) => setOtherBrand(v ? v : "")}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Brands"
                onChange={(e) => setOtherBrand(e.target.value)}
              />
            )}
            freeSolo
            options={["Apple", "Lenovo", "Dell", "Microsoft"]}
            size="small"
          />
          <TextField
            label="Device Type"
            sx={textFieldStyle}
            helperText="e.g. MacBook Pro, XPS, Latitude, ThinkPad X1"
            fullWidth
            size="small"
            required
            value={other_type}
            onChange={(event) => setOtherType(event.target.value)}
          />
        </>
      )}
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
            <MenuItem value="Other">Different Specs</MenuItem>
          </Select>
        </FormControl>
      )}
      {(specs === "Other" || brand === "Others") && (
        <TextField
          label={brand === "Others" ? "Specs" : "Other Specs"}
          sx={textFieldStyle}
          helperText='e.g. 13", M2 Pro, 32GB, 512GB (Screen Size, CPU, RAM, SSD)'
          fullWidth
          size="small"
          required
          value={other_specs}
          onChange={(event) => setOtherSpecs(event.target.value)}
        />
      )}
      {type !== "" && (
        <FormControl
          fullWidth
          sx={textFieldStyle}
          required
          size="small"
          disabled={type === ""}
        >
          <InputLabel id="color-select-label">Color</InputLabel>
          <Select
            labelId="color-select-label"
            id="color-select"
            label="Color"
            onChange={handleColorChange}
            value={color}
            required
          >
            {type !== "" &&
              typeIndex !== -1 &&
              types[typeIndex].colors?.map((c: string) => {
                return <MenuItem value={c}>{c}</MenuItem>;
              })}
            <MenuItem value="Default">Default</MenuItem>
          </Select>
        </FormControl>
      )}
      <FormControl
        fullWidth
        sx={textFieldStyle}
        required
        size="small"
        disabled={(specs === "" || specIndex < 0) && other_specs === ""}
      >
        <InputLabel id="region-select-label">Shipping Region</InputLabel>
        <Select
          labelId="region-select-label"
          id="region-select"
          label="Shipping Region"
          onChange={handleRegionChange}
          value={region}
          required
        >
          {specs !== "" &&
            types[typeIndex]?.specs[specIndex]?.locations.map(
              (specLocation: string) => {
                return <MenuItem value={specLocation}>{specLocation}</MenuItem>;
              }
            )}
          {(brand === "Others" || specs === "Other") && (
            <MenuItem value="United States">United States</MenuItem>
          )}
          <MenuItem value="Other">Different Region</MenuItem>
        </Select>
      </FormControl>
      {region === "Other" && (
        <TextField
          label="Other Region"
          sx={textFieldStyle}
          fullWidth
          size="small"
          required
          value={other_region}
          onChange={(event) => setOtherRegion(event.target.value)}
        />
      )}
      {region === "United States" && (
        <>
          {props.suppliers && props.suppliers["United States"] && (
            <FormControl
              fullWidth
              sx={textFieldStyle}
              required
              size="small"
              disabled={(specs === "" || specIndex < 0) && other_specs === ""}
            >
              <InputLabel id="supplier-select-label">Supplier</InputLabel>
              <Select
                labelId="supplier-select-label"
                id="supplier-select"
                label="Supplier"
                onChange={handleSupplierChange}
                value={supplier}
                required
              >
                {props.suppliers["United States"].map((s: string) => {
                  return <MenuItem value={s.toLowerCase()}>{s}</MenuItem>;
                })}
              </Select>
            </FormControl>
          )}
          <CheckStock
            type={brand === "Others" ? other_type : type}
            spec={specs === "Other" || brand === "Others" ? other_specs : specs}
            brand={brand === "Others" ? other_brand : brand}
            completeDeviceChoice={completeDeviceChoice}
            setLoading={setLoading}
            supplier={supplier}
            product_link={product_link}
            others={brand === "Others"}
            client={client}
          />
        </>
      )}
      {region !== "" && region !== "United States" && (
        <Button
          fullWidth
          variant="contained"
          sx={{ borderRadius: "10px" }}
          onClick={() =>
            completeDeviceChoice(
              type === "" ? other_type : type,
              specs === "Other" || specs === "" ? other_specs : specs,
              "",
              region === "Other" ? other_region : region,
              "",
              "",
              "",
              "",
              supplier
            )
          }
        >
          Request Quote
        </Button>
      )}
    </>
  );
};

export default DeviceSelection;
