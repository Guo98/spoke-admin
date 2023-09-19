import React, { FC, ReactElement, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Fab,
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
} from "../../app/slices/inventorySlice";
import { standardGet } from "../../services/standard";
import { roleMapping } from "../../utilities/mappings";
import InventoryAccordion from "./InventoryAccordion";
import AddModal from "./AddModal";
import ManageModal from "./ManageModal";
import TabPanel from "../common/TabPanel";
import Header from "../Header/Header";
import "./Inventory.css";
import { InventorySummary } from "../../interfaces/inventory";
import LinearLoading from "../common/LinearLoading";

function a11yProps(index: number) {
  return {
    id: `inv-tab-${index}`,
    "aria-controls": `inv-tabpanel-${index}`,
  };
}

const Inventory: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const data = useSelector((state: RootState) => state.inventory.data);
  const pendingRedux = useSelector(
    (state: RootState) => state.inventory.pending
  );
  const deployedRedux = useSelector(
    (state: RootState) => state.inventory.deployed
  );
  const stockRedux = useSelector(
    (state: RootState) => state.inventory.in_stock
  );
  const eolRedux = useSelector(
    (state: RootState) => state.inventory.end_of_life
  );
  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const selectedEntity = useSelector(
    (state: RootState) => state.client.selectedEntity
  );

  const roles = useSelector((state: RootState) => state.client.roles);

  const brands = useSelector((state: RootState) => state.inventory.brands);

  // const [filterdrawer, openFiltersDrawer] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [stock, setStock] = useState(data.in_stock);
  const [deployed, setDeployed] = useState(data.deployed);
  const [inprogress, setInprogress] = useState(data.pending);
  const [endoflife, setEndOfLife] = useState(data.end_of_life);

  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inprogTotal, setInprogTotal] = useState(0);
  const [deployedTotal, setDeployedTotal] = useState(0);
  const [stockTotal, setStockTotal] = useState(0);
  const [eolTotal, setEolTotal] = useState(0);
  const [deviceTotal, setDeviceTotal] = useState(0);
  const [filtered, setFiltered] = useState(false);
  const [search_serial, setSearchSerial] = useState("");
  const [chip, setChip] = useState("");

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  const marketClient =
    clientData === "spokeops" ? selectedClientData : clientData;

  const fetchData = async () => {
    setLoading(true);
    let client = clientData === "spokeops" ? selectedClientData : clientData;
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
    if (!loading) {
      fetchData().catch(console.error);
    }
  }, [clientData]);

  useEffect(() => {
    if (selectedClientData !== "") {
      fetchData().catch(console.error);
    }
  }, [selectedClientData]);

  useEffect(() => {
    if (!openAdd && data.in_stock.length > 0) {
      fetchData().catch(console.error);
    }
  }, [openAdd]);

  useEffect(() => {
    if (data.in_stock.length >= 0) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {}, [brands]);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const updateCount = () => {
    let deployedVar = 0;
    deployedRedux.forEach((d) => {
      deployedVar += d.serial_numbers.length;
    });
    setDeployedTotal(deployedVar);

    let inprogVar = 0;
    pendingRedux.forEach((p) => {
      inprogVar += p.serial_numbers.length;
    });
    setInprogTotal(inprogVar);

    let stockVar = 0;
    stockRedux.forEach((s) => {
      stockVar += s.serial_numbers.length;
    });
    setStockTotal(stockVar);

    let eolVar = 0;
    eolRedux.forEach((e) => {
      eolVar += e.serial_numbers.length;
    });

    setDeviceTotal(stockRedux.length);
  };

  useEffect(() => {
    setInprogress(pendingRedux);
    setEndOfLife(eolRedux);
    if (search_serial !== "") {
      searchFilter(search_serial);
    } else {
      setStock(stockRedux);
      setDeployed(deployedRedux);
      updateCount();
    }
  }, [pendingRedux, deployedRedux, stockRedux, eolRedux]);

  useEffect(() => {
    updateCount();
  }, [stock, deployed, inprogress]);

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
    if (!filtered) {
      let deployedVar = 0;
      deployedRedux.forEach((d) => {
        deployedVar += d.serial_numbers.length;
      });
      setDeployedTotal(deployedVar);

      let inprogVar = 0;
      pendingRedux.forEach((p) => {
        inprogVar += p.serial_numbers.length;
      });
      setInprogTotal(inprogVar);
    }
  }, [filtered]);

  useEffect(() => {
    dispatch(filterInventoryByEntity(selectedEntity));
  }, [selectedEntity]);

  const searchFilter = (text: string) => {
    if (text !== "") {
      let searchStock = searchFilterFunction(
        [...data.in_stock],
        text.toLowerCase()
      );
      let searchInProg = searchFilterFunction(
        [...data.pending],
        text.toLowerCase()
      );

      let searchDeployed = searchFilterFunction(
        [...data.deployed],
        text.toLowerCase()
      );

      setStock(searchStock);
      setDeployed(searchDeployed);
      setInprogress(searchInProg);
      setFiltered(true);
      if (
        searchStock.length === 0 &&
        searchDeployed.length === 0 &&
        searchInProg.length > 0
      ) {
        setTabValue(2);
      } else if (
        searchStock.length === 0 &&
        searchDeployed.length > 0 &&
        searchInProg.length === 0
      ) {
        setTabValue(1);
      } else if (
        searchStock.length > 0 &&
        searchDeployed.length === 0 &&
        searchInProg.length === 0
      ) {
        setTabValue(0);
      }
    } else {
      setFiltered(false);
      setStock(data.in_stock);
      setDeployed(data.deployed);
      setInprogress(data.pending);
    }
  };

  const searchFilterFunction = (objs: InventorySummary[], text: string) => {
    return objs.filter(
      (device) =>
        device.name.toLowerCase().indexOf(text) > -1 ||
        device.location.toLowerCase().indexOf(text) > -1 ||
        device.serial_numbers.filter(
          (dev) => dev.sn.toLowerCase().indexOf(text) > -1
        ).length > 0 ||
        device.serial_numbers.filter(
          (dev) =>
            dev.first_name && dev.first_name.toLowerCase().indexOf(text) > -1
        ).length > 0 ||
        device.serial_numbers.filter(
          (dev) =>
            dev.last_name && dev.last_name.toLowerCase().indexOf(text) > -1
        ).length > 0
    );
  };

  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Header
          label="Search Inventory by device name, serial number, location, employee name"
          textChange={searchFilter}
        />
        <Grid container direction="row" alignItems="center">
          <Grid item xs={7}>
            <h2>
              Inventory{" "}
              <IconButton
                onClick={downloadInventory}
                id="inventory-export-button"
              >
                <FileDownloadIcon />
              </IconButton>
            </h2>
          </Grid>
          <Grid item xs={5}>
            <Box
              display="flex"
              justifyContent="flex-end"
              justifyItems="center"
              alignItems="center"
            >
              <ManageModal
                type="general"
                devices={data.in_stock}
                instock_quantity={stockTotal}
              />
            </Box>
          </Grid>
        </Grid>
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
              <Tab label="End of Life" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0} prefix="inv">
            <Box
              sx={{
                display: loading ? "flex" : "block",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {!loading ? (
                <>
                  {deviceTotal > 0 ? (
                    <>
                      {stock?.length > 0 &&
                        stock.map((device, index) => {
                          if (
                            device.serial_numbers.length > 0 ||
                            !device.hide_out_of_stock
                          )
                            return (
                              !device.new_device && (
                                <InventoryAccordion
                                  {...device}
                                  tabValue={tabValue}
                                  key={index}
                                  index={index}
                                  total_devices={stock.length}
                                  search_serial_number={search_serial}
                                  refresh={fetchData}
                                />
                              )
                            );
                        })}
                    </>
                  ) : (
                    <>
                      <Typography textAlign="center">
                        No Inventory Currently In Stock
                      </Typography>
                    </>
                  )}
                  {stockTotal === 0 && filtered && (
                    <Typography textAlign="center">No results found</Typography>
                  )}
                </>
              ) : (
                <LinearLoading />
              )}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1} prefix="inv">
            <Box
              sx={{
                display: "block",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {!loading ? (
                <>
                  {deployedTotal > 0 ? (
                    <>
                      {deployed?.length > 0 &&
                        deployed.map((device, index) => {
                          return (
                            device.serial_numbers.length > 0 && (
                              <InventoryAccordion
                                {...device}
                                tabValue={tabValue}
                                key={index}
                                index={index}
                                total_devices={deployed.length}
                                search_serial_number={search_serial}
                                refresh={fetchData}
                              />
                            )
                          );
                        })}
                    </>
                  ) : (
                    <>
                      {!filtered ? (
                        <>
                          <img
                            src={
                              "https://spokeimages.blob.core.windows.net/image/warehouse.avif"
                            }
                            style={{
                              display: "block",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          />
                          <div>
                            <Typography
                              textAlign="center"
                              sx={{ paddingTop: "20px" }}
                              variant="subtitle1"
                            >
                              No Inventory Currently Deployed
                            </Typography>
                          </div>
                        </>
                      ) : (
                        <Typography textAlign="center">
                          No results found
                        </Typography>
                      )}
                    </>
                  )}
                </>
              ) : (
                <LinearLoading />
              )}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={2} prefix="inv">
            <Box
              sx={{
                display: "block",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {!loading ? (
                <>
                  {inprogTotal > 0 ? (
                    <>
                      {inprogress?.length > 0 &&
                        inprogress.map((device, index) => {
                          return (
                            device.serial_numbers.length > 0 && (
                              <InventoryAccordion
                                {...device}
                                tabValue={tabValue}
                                key={index}
                                clientData={clientData}
                                index={index}
                                total_devices={inprogress.length}
                                search_serial_number={search_serial}
                                refresh={fetchData}
                              />
                            )
                          );
                        })}
                    </>
                  ) : (
                    <>
                      {!filtered ? (
                        <>
                          <img
                            src={
                              "https://spokeimages.blob.core.windows.net/image/warehousestock.png"
                            }
                            style={{
                              display: "block",
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          />
                          <div>
                            <Typography
                              textAlign="center"
                              sx={{ paddingTop: "20px" }}
                              variant="subtitle1"
                            >
                              No Inventory Currently Pending
                            </Typography>
                          </div>
                        </>
                      ) : (
                        <Typography textAlign="center">
                          No results found
                        </Typography>
                      )}
                    </>
                  )}
                </>
              ) : (
                <LinearLoading />
              )}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={3} prefix="inv">
            {loading ? (
              <LinearLoading />
            ) : (
              <>
                {eolTotal > 0 ? (
                  <Box
                    sx={{
                      display: "block",
                      flexWrap: "wrap",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    {endoflife.length > 0 &&
                      endoflife.map((device, index) => {
                        return (
                          device.serial_numbers.length > 0 && (
                            <InventoryAccordion
                              {...device}
                              tabValue={tabValue}
                              key={index}
                              clientData={clientData}
                              index={index}
                              total_devices={inprogress.length}
                              search_serial_number={search_serial}
                              refresh={fetchData}
                            />
                          )
                        );
                      })}
                  </Box>
                ) : (
                  <Typography textAlign="center">
                    No devices near end of service
                  </Typography>
                )}
              </>
            )}
          </TabPanel>
          {marketClient !== "Automox" &&
            marketClient !== "Alma" &&
            marketClient !== "Flo Health" &&
            marketClient !== "Hidden Road" &&
            marketClient !== "Roivant" &&
            marketClient !== "Sona" && (
              <>
                <Fab
                  color="primary"
                  sx={{ bottom: 15, position: "fixed" }}
                  onClick={() => setOpenAdd(true)}
                  variant="extended"
                >
                  <Typography>Add Inventory</Typography>
                </Fab>
                <AddModal
                  open={openAdd}
                  setParentOpen={setOpenAdd}
                  deviceNames={data.in_stock}
                />
              </>
            )}
          {/* <Fab
            color="primary"
            sx={{ bottom: 15, right: 15, position: "fixed" }}
            onClick={() => openFiltersDrawer(true)}
          >
            <FilterAltIcon />
          </Fab> */}
        </Box>
      </Box>
    </>
  );
};

export default Inventory;
