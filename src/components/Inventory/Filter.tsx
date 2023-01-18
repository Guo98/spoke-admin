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
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import Box from "@mui/material/Box";
import { InventorySummary } from "../../interfaces/inventory";
import Typography from "@mui/material/Typography";

interface FilterProps {
  data: InventorySummary[];
  setData: Function;
  device_name?: string[];
  selected_location?: string;
}

const boxStyle = {
  border: "1px black",
};

const Filter = (props: FilterProps) => {
  const { data, setData, device_name, selected_location } = props;
  const [devices, setDevices] = useState<string[]>(device_name as string[]);
  const [location, setLocation] = useState(selected_location);
  const [condition, setCondition] = useState("");
  const [sortDeviceIcon, setSortDeviceIcon] = useState<JSX.Element | null>(
    null
  );
  const [sortDevice, setSortDevice] = useState("");
  const [sortLocationIcon, setSortLocationIcon] = useState<JSX.Element | null>(
    null
  );
  const [sortLocation, setSortLocation] = useState("");

  const locations = [...new Set(data.map((item) => item.location))];
  const deviceNames = [...new Set(data.map((item) => item.name))];

  const handleDeviceChange = (event: SelectChangeEvent<typeof devices>) => {
    const {
      target: { value },
    } = event;
    setDevices(typeof value === "string" ? value.split(",") : value);
  };

  const handleConditionChange = (event: React.ChangeEvent, value: string) => {
    setCondition(value);
  };

  const clearAll = () => {
    setDevices([]);
    setLocation("");
    setCondition("");
    setData(data);
    setSortLocation("");
    setSortLocationIcon(null);
    setSortDevice("");
    setSortDeviceIcon(null);
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

  const sortByAction = (type: string) => {
    let sortData = data;
    if (type === "device") {
      setSortLocation("");
      setSortLocationIcon(null);
      if (!sortDeviceIcon || sortDevice === "descending") {
        setSortDeviceIcon(<NorthIcon />);
        setSortDevice("ascending");
        sortData.sort((a, b) =>
          a.name > b.name ? 1 : a.name < b.name ? -1 : 0
        );
      } else if (sortDevice === "ascending") {
        setSortDeviceIcon(<SouthIcon />);
        setSortDevice("descending");
        sortData.sort((a, b) =>
          a.name < b.name ? 1 : a.name > b.name ? -1 : 0
        );
      }
    } else if (type === "location") {
      setSortDevice("");
      setSortDeviceIcon(null);
      if (!sortLocationIcon || sortLocation === "descending") {
        setSortLocationIcon(<NorthIcon />);
        setSortLocation("ascending");
        sortData.sort((a, b) =>
          a.location > b.location ? 1 : a.location < b.location ? -1 : 0
        );
      } else if (sortLocation === "ascending") {
        setSortLocationIcon(<SouthIcon />);
        setSortLocation("descending");
        sortData.sort((a, b) =>
          a.location < b.location ? 1 : a.location > b.location ? -1 : 0
        );
      }
    }
    setData(sortData);
  };

  return (
    <>
      <Typography variant="h6" component="h4">
        Sort By
      </Typography>
      <>
        <Stack
          spacing={2}
          width="90%"
          alignItems="center"
          sx={{ paddingTop: "10px" }}
        >
          <Button
            variant={sortDevice === "" ? "outlined" : "contained"}
            startIcon={sortDeviceIcon}
            sx={{ width: "80%", borderRadius: "10px" }}
            onClick={() => sortByAction("device")}
          >
            Device
          </Button>
          <Button
            startIcon={sortLocationIcon}
            sx={{ width: "80%", borderRadius: "10px" }}
            variant={sortLocation === "" ? "outlined" : "contained"}
            onClick={() => sortByAction("location")}
          >
            Location
          </Button>
        </Stack>
      </>
      <Typography variant="h6" component="h4">
        Filter By
      </Typography>
      <Box sx={boxStyle}>
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
      </Box>
    </>
  );
};

export default Filter;
