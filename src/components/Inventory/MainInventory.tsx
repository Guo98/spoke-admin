import React, { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { setNewInventory } from "../../app/slices/inventorySlice";
import { RootState } from "../../app/store";
import { standardGet } from "../../services/standard";
import { roleMapping } from "../../utilities/mappings";

import Header from "../Header/Header";
import InventoryCard from "./InventoryCard";
import InventorySummary from "./InventorySummary";
import LinearLoading from "../common/LinearLoading";
import { InventorySummary as IS } from "../../interfaces/inventory";

const MainInventory = () => {
  const [client, setClient] = useState("");

  const [loading, setLoading] = useState(false);
  const [page_number, setPageNumber] = useState(0);
  const [selected_device, setSelectedDevice] = useState<IS | null>(null);
  const [selected_tab, setSelectedTab] = useState(0);

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const roles = useSelector((state: RootState) => state.client.roles);
  const inventory_redux = useSelector(
    (state: RootState) => state.inventory.devices
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

  useEffect(() => {}, [inventory_redux]);

  const selectDevice = (index: number, tab_index: number = 0) => {
    setPageNumber(1);
    setSelectedDevice(inventory_redux[index]);
    setSelectedTab(tab_index);
  };

  const searchFilter = () => {};

  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Header
          label="Search Inventory by device name, serial number, location, employee name"
          textChange={searchFilter}
        />
        <Stack direction="row" spacing={2} pt={2}>
          <Typography component="h2" variant="h5" fontWeight="bold">
            {page_number === 0 && "Inventory Overview"}
          </Typography>
        </Stack>
        {page_number === 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: "10px",
            }}
          >
            {loading && <LinearLoading />}
            {inventory_redux &&
              inventory_redux.length > 0 &&
              inventory_redux.map((inv, index: number) => (
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
