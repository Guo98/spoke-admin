import React, {
  useEffect,
  useState,
  ReactElement,
  JSXElementConstructor,
} from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { InventorySummary } from "../../interfaces/inventory";
import InitialInventoryState from "../../types/redux/inventory";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

interface FilterProps {
  data: InventorySummary[];
  setData: Function;
  device_name?: string[];
  selected_location?: string[];
  tab_value: number;
}

const reduxInventoryMapping = ["in_stock", "deployed", "pending"];

const boxStyle = {
  border: "1px black",
};

const Filter = (props: FilterProps) => {
  const { data, setData, device_name, selected_location, tab_value } = props;
  const ogdata = useSelector(
    (state: RootState) =>
      state.inventory[
        reduxInventoryMapping[tab_value] as keyof InitialInventoryState
      ]
  );

  const [devices, setDevices] = useState<string[]>(
    device_name![0] !== "" ? (device_name as string[]) : []
  );
  const [rams, setRams] = useState<string[]>([]);
  const [cpus, setCpus] = useState<string[]>([]);
  const [storages, setStorages] = useState<string[]>([]);
  const [location, setLocation] = useState<string[]>(
    selected_location![0] !== "" ? (selected_location as string[]) : []
  );
  const [condition, setCondition] = useState("");
  const [sortDeviceIcon, setSortDeviceIcon] = useState<
    ReactElement<any, string | JSXElementConstructor<any>> | undefined
  >(undefined);
  const [sortDevice, setSortDevice] = useState("");
  const [sortLocationIcon, setSortLocationIcon] = useState<
    ReactElement<any, string | JSXElementConstructor<any>> | undefined
  >(undefined);
  const [sortLocation, setSortLocation] = useState("");

  const locations = [...new Set(data.map((item) => item.location))];
  const deviceNames = [...new Set(data.map((item) => item.name))];
  const deviceRams = [
    ...new Set(
      data.map((item) => {
        if (item.specs?.ram) {
          return item.specs.ram;
        }
      })
    ),
  ].filter((r) => r);

  const deviceCpus = [
    ...new Set(
      data.map((item) => {
        if (item.specs?.cpu) {
          return item.specs.cpu;
        }
      })
    ),
  ].filter((c) => c);
  const deviceStorages = [
    ...new Set(
      data.map((item) => {
        if (item.specs?.hard_drive) {
          return item.specs.hard_drive;
        }
      })
    ),
  ].filter((h) => h);

  const filterDevice = (device: string) => {
    if (devices.indexOf(device) > -1) {
      setDevices(devices.filter((dev) => dev !== device));
    } else {
      setDevices((prevDevices) => [...prevDevices, device]);
    }
  };

  const filterRam = (ram: string) => {
    if (rams.indexOf(ram) > -1) {
      setRams(rams.filter((r) => r !== ram));
    } else {
      setRams((prevRams) => [...prevRams, ram]);
    }
  };

  const filterCpu = (cpu: string) => {
    if (cpus.indexOf(cpu) > -1) {
      setCpus(cpus.filter((c) => c !== cpu));
    } else {
      setCpus((prevCpus) => [...prevCpus, cpu]);
    }
  };

  const filterLocation = (loc: string) => {
    if (location.indexOf(loc) > -1) {
      setLocation(location.filter((l) => l !== loc));
    } else {
      setLocation((prevLocation) => [...prevLocation, loc]);
    }
  };

  const filterStorage = (storage: string) => {
    if (storages.indexOf(storage) > -1) {
      setStorages(storages.filter((s) => s !== storage));
    } else {
      setStorages((prevStorages) => [...prevStorages, storage]);
    }
  };

  const handleConditionChange = (value: string) => {
    setCondition(value);
  };

  const clearAll = () => {
    setDevices([]);
    setRams([]);
    setCpus([]);
    setStorages([]);
    setLocation([]);
    setCondition("");
    setData(ogdata);
    setSortLocation("");
    setSortLocationIcon(undefined);
    setSortDevice("");
    setSortDeviceIcon(undefined);
  };

  const filterDevices = () => {
    let filteredResults: InventorySummary[] = JSON.parse(JSON.stringify(data));

    if (devices.length > 0)
      filteredResults = data.filter((item) => devices.indexOf(item.name) > -1);

    if (location.length > 0)
      filteredResults = filteredResults.filter(
        (item) => location.indexOf(item.location) > -1
      );

    if (rams.length > 0)
      filteredResults = filteredResults.filter(
        (item) => item.specs && rams.indexOf(item.specs!.ram) > -1
      );

    if (cpus.length > 0)
      filteredResults = filteredResults.filter(
        (item) => item.specs && cpus.indexOf(item.specs!.cpu) > -1
      );

    if (storages.length > 0)
      filteredResults = filteredResults.filter(
        (item) => item.specs && storages.indexOf(item.specs!.hard_drive) > -1
      );

    if (condition !== "") {
      let newResult = [...filteredResults];
      for (let i = 0; i < filteredResults.length; i++) {
        const filteredSN = filteredResults[i].serial_numbers.filter(
          (individual) => {
            return individual.condition === condition;
          }
        );

        newResult[i].serial_numbers = [...filteredSN];
      }
      setData(newResult);
    } else {
      setData(filteredResults);
    }
  };

  const sortByAction = (type: string) => {
    let sortData: InventorySummary[] = JSON.parse(JSON.stringify(data));
    if (type === "device") {
      setSortLocation("");
      setSortLocationIcon(undefined);
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
      setSortDeviceIcon(undefined);
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
      <Typography variant="h6" component="h4" fontWeight="bold">
        Sort and Filter
      </Typography>
      <hr />
      <Typography fontWeight="bold">Sort</Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Chip
          icon={sortDeviceIcon}
          label="Device"
          variant={sortDevice === "" ? "outlined" : "filled"}
          color={sortDevice === "" ? "default" : "primary"}
          clickable
          onClick={() => sortByAction("device")}
        />
        <Chip
          icon={sortLocationIcon}
          label="Location"
          variant={sortLocation === "" ? "outlined" : "filled"}
          color={sortLocation === "" ? "default" : "primary"}
          onClick={() => sortByAction("location")}
          clickable
        />
      </Box>
      <br />
      <hr />
      <Typography fontWeight="bold">Filters</Typography>
      <br />
      <Typography variant="caption">Device(s)</Typography>
      <Box
        sx={{
          display: "flex",
          paddingTop: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {deviceNames.map((device) => (
          <Chip
            label={device}
            variant={devices.indexOf(device) > -1 ? "filled" : "outlined"}
            clickable
            sx={{ marginTop: "5px" }}
            onClick={() => filterDevice(device)}
          />
        ))}
      </Box>
      <br />
      <Typography variant="caption">Condition</Typography>
      <Box
        sx={{
          display: "flex",
          paddingTop: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <Chip
          clickable
          label="New"
          variant={condition === "New" ? "filled" : "outlined"}
          onClick={() => handleConditionChange("New")}
        />
        <Chip
          clickable
          label="Used"
          variant={condition === "Used" ? "filled" : "outlined"}
          onClick={() => handleConditionChange("Used")}
        />
      </Box>
      <br />
      <Typography variant="caption">Location</Typography>
      <Box
        sx={{
          display: "flex",
          paddingTop: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        {locations.map((loc) => (
          <Chip
            label={loc}
            variant={location.indexOf(loc) > -1 ? "filled" : "outlined"}
            clickable
            sx={{ marginTop: "5px" }}
            onClick={() => filterLocation(loc)}
          />
        ))}
      </Box>
      <br />
      <Typography variant="caption">RAM</Typography>
      <Box
        sx={{
          display: "flex",
          paddingTop: 1,
          flexDirection: "wrap",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        {deviceRams.map((ram) => (
          <Chip
            label={ram}
            clickable
            sx={{ marginTop: "5px" }}
            variant={rams.indexOf(ram!) > -1 ? "filled" : "outlined"}
            onClick={() => filterRam(ram!)}
          />
        ))}
      </Box>
      <br />
      <Typography variant="caption">CPU</Typography>
      <Box
        sx={{
          display: "flex",
          paddingTop: 1,
          flexDirection: "wrap",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        {deviceCpus.map((cpu) => (
          <Chip
            label={cpu}
            clickable
            sx={{ marginTop: "5px" }}
            variant={cpus.indexOf(cpu!) > -1 ? "filled" : "outlined"}
            onClick={() => filterCpu(cpu!)}
          />
        ))}
      </Box>
      <br />
      <Typography variant="caption">Storage</Typography>
      <Box
        sx={{
          display: "flex",
          paddingTop: 1,
          flexDirection: "wrap",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        {deviceStorages.map((storage) => (
          <Chip
            label={storage}
            clickable
            sx={{ marginTop: "5px" }}
            variant={storages.indexOf(storage!) > -1 ? "filled" : "outlined"}
            onClick={() => filterStorage(storage!)}
          />
        ))}
      </Box>
      <Box sx={boxStyle}>
        <>
          <Stack
            direction="row"
            justifyContent="space-evenly"
            sx={{ paddingTop: 5, paddingBottom: 5 }}
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
