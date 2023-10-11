import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  ButtonGroup,
  Button,
  IconButton,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { useSearchParams } from "react-router-dom";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as FileSaver from "file-saver";
import { Buffer } from "buffer";

import {
  setNewInventory,
  filterInventory,
  resetInventory,
  inventoryFilterByEntity,
} from "../../app/slices/inventorySlice";
import { RootState } from "../../app/store";
import { standardGet } from "../../services/standard";
import { roleMapping } from "../../utilities/mappings";

import Header from "../Header/Header";
import InventoryCard from "./InventoryCard";
import InventorySummary from "./InventorySummary";
import LinearLoading from "../common/LinearLoading";
import AssignModal from "./AssignModal";
import OffboardModal from "./OffboardModal";

import { InventorySummary as IS } from "../../interfaces/inventory";
import AppContainer from "../AppContainer/AppContainer";

const MainInventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [client, setClient] = useState("");

  const [loading, setLoading] = useState(false);
  const [page_number, setPageNumber] = useState(0);
  const [selected_device, setSelectedDevice] = useState<IS | null>(null);
  const [selected_tab, setSelectedTab] = useState(0);
  const [in_stock_devices, setInStockDevices] = useState<IS[]>([]);
  const [device_names, setDeviceNames] = useState<string[]>([]);

  const [inventory_list, setInventoryList] = useState<IS[]>([]);

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const selectedEntity = useSelector(
    (state: RootState) => state.client.selectedEntity
  );
  const roles = useSelector((state: RootState) => state.client.roles);

  const inventory_redux = useSelector(
    (state: RootState) => state.inventory.devices
  );

  const filtered_redux = useSelector(
    (state: RootState) => state.inventory.filteredDevices
  );
  const filtered_page_redux = useSelector(
    (state: RootState) => state.inventory.filteredPage
  );
  const search_term = useSelector(
    (state: RootState) => state.inventory.search_text
  );

  const getInventory = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    let route = `inventory/${client}`;

    if (roles?.length > 0 && roles[0] !== "admin") {
      route = route + `/${roleMapping[roles[0]]}`;
    }

    const inventoryResult = await standardGet(accessToken, route);
    dispatch(setNewInventory(inventoryResult.data));
    setLoading(false);
  };

  useEffect(() => {
    setClient(clientData === "spokeops" ? selectedClientData : clientData);
  }, [clientData, selectedClientData]);

  useEffect(() => {
    getInventory().catch();
  }, [client]);

  useEffect(() => {
    dispatch(inventoryFilterByEntity(selectedEntity));
  }, [selectedEntity]);

  useEffect(() => {
    if (filtered_page_redux !== -1) {
      setInventoryList(filtered_redux);

      if (filtered_page_redux === 1 && filtered_redux.length === 1) {
        filterTab(filtered_redux[0], search_term);
        setSelectedDevice(filtered_redux[0]);
        setPageNumber(1);
      }
    } else {
      setInventoryList(inventory_redux);
    }
  }, [filtered_redux, filtered_page_redux]);

  useEffect(() => {
    if (searchParams.get("sn")) {
      dispatch(filterInventory(searchParams.get("sn")!));
    }
  }, [searchParams]);

  useEffect(() => {
    let temp_in_stock_devices: IS[] = [];
    let all_device_names: string[] = [];
    if (inventory_redux && inventory_redux.length > 0) {
      inventory_redux.forEach((ir) => {
        if (
          ir.serial_numbers.filter((s) => s.status === "In Stock").length > 0
        ) {
          temp_in_stock_devices.push(ir);
        }

        if (all_device_names.indexOf(ir.name) < 0) {
          all_device_names.push(ir.name);
        }
      });
      setDeviceNames(all_device_names);
      setInStockDevices(temp_in_stock_devices);
    }

    setInventoryList(inventory_redux);
  }, [inventory_redux]);

  const selectDevice = (index: number, tab_index: number = 0) => {
    setPageNumber(1);
    setSelectedDevice(inventory_redux[index]);
    setSelectedTab(tab_index);
  };

  const searchFilter = (text: string) => {
    if (text !== "") {
      dispatch(filterInventory(text));
    } else {
      dispatch(resetInventory());
    }
  };

  const filterTab = (device: IS, st: string) => {
    const filtered_sn = device.serial_numbers.filter(
      (s) =>
        s.sn.toLowerCase().includes(st) ||
        s.full_name?.toLowerCase().includes(st)
    );

    if (filtered_sn.length > 0) {
      const { status, condition } = filtered_sn[0];

      if (status === "In Stock") {
        if (condition === "New" || condition === "Used") {
          setSelectedTab(0);
        } else {
          setSelectedTab(3);
        }
      } else if (status === "Deployed") {
        setSelectedTab(1);
      } else if (status === "Pending") {
        setSelectedTab(2);
      }
    }
  };

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

  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Header
          label="Search Inventory by device name, serial number, location, employee name"
          textChange={searchFilter}
        />
        {page_number === 0 && (
          <Stack
            direction="row"
            spacing={2}
            pt={2}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1}>
              <Typography component="h2" variant="h5" fontWeight="bold">
                Inventory Overview
              </Typography>
              <IconButton
                onClick={downloadInventory}
                id="inventory-export-button"
              >
                <FileDownloadIcon />
              </IconButton>
            </Stack>
            <ButtonGroup variant="contained">
              <AssignModal
                type="main"
                disabled={false}
                devices={in_stock_devices}
              />
              <OffboardModal client={client} all_devices={device_names} />
              <Button
                onClick={() => AppContainer.navigate("/marketplace")}
                sx={{ borderRadius: "0px 10px 10px 0px" }}
              >
                Buy
              </Button>
            </ButtonGroup>
          </Stack>
        )}
        {page_number === 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {loading && <LinearLoading />}
            {inventory_list &&
              inventory_list.length > 0 &&
              inventory_list.map((inv, index: number) => (
                <InventoryCard
                  {...inv}
                  goToPage={selectDevice}
                  index={index}
                  client={client}
                />
              ))}
          </Box>
        )}
        {page_number === 1 && (
          <Box>
            {selected_device && (
              <InventorySummary
                {...selected_device}
                goToPage={setPageNumber}
                client={client}
                refresh={getInventory}
                selected_tab={selected_tab}
              />
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default MainInventory;
