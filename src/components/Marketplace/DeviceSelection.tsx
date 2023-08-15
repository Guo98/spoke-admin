import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Typography,
  IconButton,
  Tooltip,
  Link,
} from "@mui/material";
import CheckStock from "./AI/CheckStock";

interface DeviceSelectionProps {
  types: any;
  setLoading: Function;
  brand: string;
  completeDeviceChoice: Function;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  mb: 2,
};

const DeviceSelection = (props: DeviceSelectionProps) => {
  const { types, setLoading, brand, completeDeviceChoice } = props;

  const [other_brand, setOtherBrand] = useState("");

  const [type, setType] = useState("");
  const [typeIndex, setTypeIndex] = useState(-1);
  const [other_type, setOtherType] = useState("");

  const [specs, setSpecs] = useState("");
  const [specIndex, setSpecIndex] = useState(-1);
  const [other_specs, setOtherSpecs] = useState("");

  const [region, setRegion] = useState("");
  const [other_region, setOtherRegion] = useState("");

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

  const handleRegionChange = (event: SelectChangeEvent) => {
    setRegion(event.target.value);
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
          <TextField
            label="Brand"
            sx={{ ...textFieldStyle, mt: 2 }}
            fullWidth
            size="small"
            required
            value={other_brand}
            onChange={(event) => setOtherBrand(event.target.value)}
          />
          <TextField
            label="Device Type"
            sx={textFieldStyle}
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
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      )}
      {(specs === "Other" || brand === "Others") && (
        <TextField
          label={brand === "Others" ? "Specs" : "Other Specs"}
          sx={textFieldStyle}
          fullWidth
          size="small"
          required
          value={other_specs}
          onChange={(event) => setOtherSpecs(event.target.value)}
        />
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
          {brand === "Others" && (
            <MenuItem value="United States">United States</MenuItem>
          )}
          <MenuItem value="Other">Other</MenuItem>
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
        <CheckStock
          type={brand === "Others" ? other_type : type}
          spec={specs === "Other" || brand === "Others" ? other_specs : specs}
          brand={brand === "Others" ? other_brand : brand}
          completeDeviceChoice={completeDeviceChoice}
          setLoading={setLoading}
        />
      )}
      {region !== "" && region !== "United States" && (
        <Button
          fullWidth
          variant="contained"
          sx={{ borderRadius: "10px" }}
          onClick={() =>
            completeDeviceChoice(
              type,
              specs === "Other" ? other_specs : specs,
              "",
              region === "Other" ? other_region : region
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
