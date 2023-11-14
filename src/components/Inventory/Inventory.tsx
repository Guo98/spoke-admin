import React, { FC, ReactElement, useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useAuth0 } from "@auth0/auth0-react";
import * as FileSaver from "file-saver";
import { Buffer } from "buffer";
import { useSearchParams, useLocation } from "react-router-dom";
import { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import {
  setInventory,
  filterInventoryByEntity,
  filterByBrand,
  resetInventory,
  filterInventory,
} from "../../app/slices/inventorySlice";
import { standardGet, standardPost } from "../../services/standard";
import { roleMapping } from "../../utilities/mappings";
import InventoryAccordion from "./InventoryAccordion";
import ManageModal from "./ManageModal";

import Header from "../Header/Header";
import "./Inventory.css";
import { InventorySummary } from "../../interfaces/inventory";
import LinearLoading from "../common/LinearLoading";
import InventorySkeleton from "./InventorySkeleton";

function a11yProps(index: number) {
  return {
    id: `inv-tab-${index}`,
    "aria-controls": `inv-tabpanel-${index}`,
  };
}

const Inventory: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const dispatch = useDispatch<any>();
  // inventory redux
  const data = useSelector((state: RootState) => state.inventory.data);

  const brands = useSelector((state: RootState) => state.inventory.brands);
  const serial_info = useSelector(
    (state: RootState) => state.inventory.serial_info
  );
  const current_inventory = useSelector(
    (state: RootState) => state.inventory.current_inventory
  );
  const filtered_inventory = useSelector(
    (state: RootState) => state.inventory.filteredDevices
  );
  const is_filtered = useSelector(
    (state: RootState) => state.inventory.filtered
  );
  // client redux
  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const selectedEntity = useSelector(
    (state: RootState) => state.client.selectedEntity
  );
  const roles = useSelector((state: RootState) => state.client.roles);

  const [tabValue, setTabValue] = useState(0);
  const [client, setClient] = useState(
    clientData === "spokeops" ? selectedClientData : clientData
  );

  const [inventory, setUIInventory] = useState<InventorySummary[]>([]);
  const [loading, setLoading] = useState(false);

  const [search_serial, setSearchSerial] = useState("");
  const [chip, setChip] = useState("");

  const [inventory_filter_msg, setInvFilterMsg] = useState("");
  const [has_eol, setEol] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const fetchData = async () => {
    setLoading(true);

    const accessToken = await getAccessTokenSilently();

    let route = `inventory/${client}`;

    if (roles?.length > 0 && roles[0] !== "admin") {
      route = route + `/${roleMapping[roles[0]]}`;
    }

    const inventoryResult = await standardGet(accessToken, route);
    dispatch(setInventory(inventoryResult.data));

    if (selectedEntity !== "") {
      dispatch(filterInventoryByEntity(selectedEntity));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (client !== "") {
      fetchData().catch();
    }
  }, [client]);

  useEffect(() => {
    if (clientData === "spokeops") {
      setClient(selectedClientData);
    } else {
      setClient(clientData);
    }
  }, [selectedClientData, clientData]);

  useEffect(() => {}, [brands]);

  useEffect(() => {
    if (current_inventory.length > 0 && !is_filtered) {
      setUIInventory(current_inventory);

      for (const dev of current_inventory) {
        if (dev.eol!.length > 0) {
          setEol(true);
          break;
        }
      }
    }
  }, [current_inventory]);

  useEffect(() => {
    if (is_filtered) {
      setUIInventory(filtered_inventory);
      if (search_serial !== "") {
        if (filtered_inventory.length === 0) {
          missing_mapping().catch();
          setInvFilterMsg(
            "Device has not been mapped yet in the inventory. Will be updated in 24 hours."
          );
        } else {
          if (
            filtered_inventory[0].deployed!.length > 0 &&
            filtered_inventory[0].deployed!.filter(
              (sn) => sn.sn === search_serial
            ).length > 0
          ) {
            setTabValue(1);
          } else if (
            filtered_inventory[0].pending!.length > 0 &&
            filtered_inventory[0].pending!.filter(
              (sn) => sn.sn === search_serial
            ).length > 0
          ) {
            setTabValue(2);
          }
        }
      }
    } else {
      setUIInventory(current_inventory);
      setInvFilterMsg("");

      if (search_serial !== "") {
        searchParams.delete("sn");
        setSearchParams(searchParams);
        setSearchSerial("");
      }
    }
  }, [filtered_inventory, is_filtered]);

  useEffect(() => {
    if (searchParams.get("sn")) {
      setSearchSerial(searchParams.get("sn")!);
    } else {
      setSearchSerial("");
      searchFilter("");
      setTabValue(0);
    }
  }, [searchParams, location.pathname]);

  useEffect(() => {
    dispatch(filterInventoryByEntity(selectedEntity));
  }, [selectedEntity]);

  useEffect(() => {
    searchFilter(search_serial);
  }, [search_serial]);

  const downloadInventory = async () => {
    const accessToken = await getAccessTokenSilently();

    let route = `downloadinventory/${
      clientData === "spokeops" ? selectedClientData : clientData
    }`;

    if (selectedEntity !== "") {
      route = route + `/${selectedEntity}`;
    }

    const downloadResult = await standardGet(accessToken, route);

    const blob = new Blob([new Buffer(downloadResult.data)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    FileSaver.saveAs(blob, "inventory.xlsx");
  };

  const missing_mapping = async () => {
    const access_token = await getAccessTokenSilently();

    const missing_resp = await standardPost(
      access_token,
      "missing",
      serial_info
    );
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const searchFilter = (text: string) => {
    setLoading(true);
    dispatch(filterInventory(text));
    setLoading(false);
  };

  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Header
          label="Search Inventory by device name, serial number, location, employee name"
          textChange={searchFilter}
          search_value={search_serial}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <h2>
            Inventory{" "}
            <IconButton
              onClick={downloadInventory}
              id="inventory-export-button"
            >
              <FileDownloadIcon />
            </IconButton>
          </h2>
          <ManageModal devices={current_inventory} />
        </Stack>
        {brands.length > 0 && (
          <Stack direction="row" spacing={2}>
            {brands.map((b) => (
              <Chip
                clickable
                label={b}
                onClick={() => {
                  setChip(b);
                  dispatch(filterByBrand(b));
                }}
                onDelete={
                  b === chip
                    ? () => {
                        setChip("");
                        dispatch(resetInventory());
                      }
                    : undefined
                }
                variant={b === chip ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        )}
        {loading && <LinearLoading />}
        {!loading && (
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="inventory tabs"
              >
                <Tab label="In Stock" {...a11yProps(0)} />
                <Tab label="Deployed" {...a11yProps(1)} />
                <Tab label="Pending" {...a11yProps(2)} />
                {has_eol && <Tab label="End of Life" {...a11yProps(3)} />}
              </Tabs>
            </Box>
            <Stack spacing={1} pt={1}>
              {inventory_filter_msg !== "" && (
                <Typography>{inventory_filter_msg}</Typography>
              )}
              {inventory.length > 0 &&
                inventory.map((device, index) => {
                  if (tabValue === 0) {
                    return (
                      <InventoryAccordion
                        {...device}
                        tabValue={tabValue}
                        key={index}
                        index={index}
                        total_devices={device.in_stock!.length}
                        search_serial_number={search_serial}
                        refresh={fetchData}
                        client={client}
                      />
                    );
                  } else if (tabValue === 1 && device.deployed!.length > 0) {
                    return (
                      <InventoryAccordion
                        {...device}
                        tabValue={tabValue}
                        key={index}
                        index={index}
                        total_devices={device.deployed!.length}
                        search_serial_number={search_serial}
                        refresh={fetchData}
                        client={client}
                      />
                    );
                  } else if (tabValue === 2 && device.pending!.length > 0) {
                    return (
                      <InventoryAccordion
                        {...device}
                        tabValue={tabValue}
                        key={index}
                        index={index}
                        total_devices={device.pending!.length}
                        search_serial_number={search_serial}
                        refresh={fetchData}
                        client={client}
                      />
                    );
                  } else if (tabValue === 3 && device.eol!.length > 0) {
                    return (
                      <InventoryAccordion
                        {...device}
                        tabValue={tabValue}
                        key={index}
                        index={index}
                        total_devices={device.eol!.length}
                        search_serial_number={search_serial}
                        refresh={fetchData}
                        client={client}
                      />
                    );
                  }
                })}
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Inventory;
