import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { InventorySummary } from "../../interfaces/inventory";

interface FilterProps {
  data: InventorySummary[];
  setData: Function;
  device_name?: string[];
  selected_location?: string;
}

const Filter = (props: FilterProps) => {
  const { data, setData, device_name, selected_location } = props;
  const [devices, setDevices] = useState<string[]>(device_name as string[]);
  const [location, setLocation] = useState(selected_location);
  const [condition, setCondition] = useState("");

  const locations = [...new Set(data.map((item) => item.location))];
  const deviceNames = [...new Set(data.map((item) => item.name))];

  const handleDeviceChange = (event: SelectChangeEvent<typeof devices>) => {
    const {
      target: { value },
    } = event;
    console.log("value here :::::: ", value);
    setDevices(typeof value === "string" ? value.split(",") : value);
  };

  const handleConditionChange = (event: React.ChangeEvent, value: string) => {
    setCondition(value);
  };

  const clearAll = () => {
    setDevices([]);
    setLocation("");
    setCondition("");
    console.log("data in here ::::::::::: ", data);
    setData(data);
  };

  const filterDevices = () => {
    let filteredResults = data;
    if (devices.length > 0) {
      if (location !== "") {
        filteredResults = data.filter(
          (item) =>
            devices.indexOf(item.name) > -1 && item.location === location
        );
      } else {
        filteredResults = data.filter(
          (item) => devices.indexOf(item.name) > -1
        );
      }
    }
    setData(filteredResults);
  };

  useEffect(() => {
    // if (location !== "" || devices.length > 0) filterDevices();
  }, []);

  return (
    <>
      <h3>Filters</h3>
      <>
        <FormControl sx={{ width: "90%" }}>
          <InputLabel id="device-label">Device</InputLabel>
          <Select
            labelId="device-label"
            id="device-multi-checkbox"
            multiple
            value={devices}
            variant="standard"
            label="Device"
            onChange={handleDeviceChange}
            renderValue={(selected) => selected.join(",")}
          >
            {deviceNames.map((device) => (
              <MenuItem key={device} value={device}>
                <Checkbox checked={devices.indexOf(device) > -1} />
                <ListItemText primary={device} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
      <div className="radio-padding">
        <FormControl>
          <FormLabel id="condition-label">Condition</FormLabel>
          <RadioGroup
            aria-labelledby="condition-label"
            name="condition-radio-group"
            onChange={handleConditionChange}
          >
            <FormControlLabel
              value="new"
              control={<Radio checked={condition === "new"} />}
              label="New"
            />
            <FormControlLabel
              value="old"
              control={<Radio checked={condition === "old"} />}
              label="Old"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <>
        <FormControl sx={{ width: "90%" }}>
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            labelId="location-label"
            id="location-select"
            value={location}
            label="Location"
            variant="standard"
            onChange={(event: SelectChangeEvent) =>
              setLocation(event.target.value as string)
            }
          >
            {locations.map((loc) => (
              <MenuItem value={loc}>{loc}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
      <>
        <Stack
          direction="row"
          justifyContent="space-evenly"
          sx={{ paddingRight: 5, paddingTop: 5 }}
        >
          <Button onClick={filterDevices}>Apply</Button>
          <Button onClick={clearAll}>Clear</Button>
        </Stack>
      </>
    </>
  );
};

export default Filter;
