import React, { FC, ReactElement, useState, useEffect } from "react";
import {
  Box,
  Grid,
  Drawer,
  Tabs,
  Tab,
  Fab,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useAuth0 } from "@auth0/auth0-react";
import * as FileSaver from "file-saver";
import { Buffer } from "buffer";
import { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { updateInventory } from "../../app/slices/inventorySlice";
import { download, getInventory } from "../../services/inventoryAPI";
import InventoryAccordion from "./InventoryAccordion";
import Filter from "./Filter";
import AddModal from "./AddModal";
import ManageModal from "./ManageModal";
import TabPanel from "../common/TabPanel";
import Header from "../Header/Header";
import "./Inventory.css";
import { InventorySummary } from "../../interfaces/inventory";

function a11yProps(index: number) {
  return {
    id: `inv-tab-${index}`,
    "aria-controls": `inv-tabpanel-${index}`,
  };
}

const Inventory: FC = (): ReactElement => {
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
  const clientData = useSelector((state: RootState) => state.client.data);

  const [filterdrawer, openFiltersDrawer] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [stock, setStock] = useState(data);
  const [deployed, setDeployed] = useState(data);
  const [inprogress, setInprogress] = useState(data);
  const [oginprogrss, setOGInprogress] = useState(data);
  const [ogstock, setOGStock] = useState(data);
  const [ogdeployed, setOGDeployed] = useState(data);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inprogTotal, setInprogTotal] = useState(0);
  const [deployedTotal, setDeployedTotal] = useState(0);
  const [stockTotal, setStockTotal] = useState(0);
  const [filtered, setFiltered] = useState(false);

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      let client = clientData === "spokeops" ? "FLYR" : clientData;
      console.log("client ::::::::: ", client);
      const accessToken = await getAccessTokenSilently();
      const inventoryResult = await getInventory(accessToken, client);
      dispatch(updateInventory(inventoryResult.data));
    };
    if (loading) {
      fetchData().catch(console.error);
    }
  }, [clientData]);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      let client = clientData === "spokeops" ? "FLYR" : clientData;
      const inventoryResult = await getInventory(accessToken, client);
      dispatch(updateInventory(inventoryResult.data));
    };

    if (!openAdd && data.length > 0) {
      fetchData().catch(console.error);
    }
  }, [openAdd]);

  useEffect(() => {
    if (data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  const downloadInventory = async () => {
    const accessToken = await getAccessTokenSilently();
    const downloadResult = await download(accessToken, clientData);

    const blob = new Blob([new Buffer(downloadResult.data)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    FileSaver.saveAs(blob, "inventory.xlsx");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setStock(stockRedux);
    setOGStock(stockRedux);
    setDeployed(deployedRedux);
    setOGDeployed(deployedRedux);
    setInprogress(pendingRedux);
    setOGInprogress(pendingRedux);

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
  }, [pendingRedux, deployedRedux, stockRedux]);

  useEffect(() => {
    let deployedVar = 0;
    deployed.forEach((d) => {
      deployedVar += d.serial_numbers.length;
    });
    setDeployedTotal(deployedVar);

    let inprogVar = 0;
    inprogress.forEach((p) => {
      inprogVar += p.serial_numbers.length;
    });
    setInprogTotal(inprogVar);

    let stockVar = 0;
    stock.forEach((s) => {
      stockVar += s.serial_numbers.length;
    });
    setStockTotal(stockVar);
  }, [stock, deployed, inprogress]);

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

  const searchFilter = (text: string) => {
    if (text !== "") {
      const searchStock = searchFilterFunction(
        [...ogstock],
        text.toLowerCase()
      );
      let searchInProg = searchFilterFunction(
        [...oginprogrss],
        text.toLowerCase()
      );

      let searchDeployed = searchFilterFunction(
        [...ogdeployed],
        text.toLowerCase()
      );

      setStock(searchStock);
      setDeployed(searchDeployed);
      setInprogress(searchInProg);
      setFiltered(true);
    } else {
      setFiltered(false);
      setStock(ogstock);
      setDeployed(ogdeployed);
      setInprogress(oginprogrss);
    }
  };

  const searchFilterFunction = (objs: InventorySummary[], text: string) => {
    return objs.filter(
      (device) =>
        device.name.toLowerCase().indexOf(text) > -1 ||
        device.location.toLowerCase().indexOf(text) > -1 ||
        device.serial_numbers.filter(
          (dev) => dev.sn.toLowerCase().indexOf(text) > -1
        ).length > 0
    );
  };

  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Header
          label="Search Inventory by device name, serial number, location"
          textChange={searchFilter}
        />
        <Grid container direction="row" alignItems="center">
          <Grid item xs={7}>
            <h2>
              Inventory{" "}
              <IconButton onClick={downloadInventory}>
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
              <ManageModal type="general" devices={ogstock} />
            </Box>
          </Grid>
        </Grid>
        <div className="right">
          <Drawer
            anchor="right"
            open={filterdrawer}
            onClose={() => openFiltersDrawer(false)}
            PaperProps={{ sx: { width: "20%" } }}
            keepMounted={true}
          >
            <div className="filter-padding">
              <Filter
                data={ogstock}
                ipData={oginprogrss}
                depData={ogdeployed}
                setData={setStock}
                setIPData={setInprogress}
                setDepData={setDeployed}
                setFiltering={setFiltered}
              />
            </div>
          </Drawer>
        </div>
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
                  {stockTotal > 0 ? (
                    <>
                      {stock?.length > 0 &&
                        stock.map((device, index) => {
                          return (
                            !device.new_device && (
                              <InventoryAccordion
                                {...device}
                                tabValue={tabValue}
                                key={index}
                              />
                            )
                          );
                        })}
                    </>
                  ) : (
                    <>
                      {!filtered ? (
                        <Typography>
                          Nothing in stock. To assign a laptop, please order
                          more.
                        </Typography>
                      ) : (
                        <Typography textAlign="center">
                          No results found
                        </Typography>
                      )}
                    </>
                  )}
                </>
              ) : (
                <CircularProgress />
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
                <CircularProgress />
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
                <CircularProgress />
              )}
            </Box>
          </TabPanel>
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
            deviceNames={ogstock}
          />
          <Fab
            color="primary"
            sx={{ bottom: 15, right: 15, position: "fixed" }}
            onClick={() => openFiltersDrawer(true)}
          >
            <FilterAltIcon />
          </Fab>
        </Box>
      </Box>
    </>
  );
};

export default Inventory;
