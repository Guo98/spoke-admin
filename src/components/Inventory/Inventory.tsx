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
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useAuth0 } from "@auth0/auth0-react";
import { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { updateInventory } from "../../app/slices/inventorySlice";
import { getInventory } from "../../services/inventoryAPI";
import InventoryAccordion from "./InventoryAccordion";
import Filter from "./Filter";
import AddModal from "./AddModal";
import AssignModal from "./AssignModal";
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

  const [cards, setCards] = useState(true);
  const [filterdrawer, openFiltersDrawer] = useState(false);
  const [device, setDevice] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [stock, setStock] = useState(data);
  const [deployed, setDeployed] = useState(data);
  const [inprogress, setInprogress] = useState(data);
  const [oginprogrss, setOGInprogress] = useState(data);
  const [ogstock, setOGStock] = useState(data);
  const [ogdeployed, setOGDeployed] = useState(data);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const client = atob(localStorage.getItem("spokeclient")!);
      const accessToken = await getAccessTokenSilently();
      const inventoryResult = await getInventory(accessToken, client);
      dispatch(updateInventory(inventoryResult.data));
    };
    if (loading) {
      fetchData().catch(console.error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const client = atob(localStorage.getItem("spokeclient")!);
      const accessToken = await getAccessTokenSilently();
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

  const setFilters = (location: string, name: string) => {
    setLocation(location);
    setDevice([name]);
    let filteredResults = tabValue === 0 ? stock : deployed;
    filteredResults = filteredResults.filter(
      (device) => device.name === name && device.location === location
    );
    setCards(false);
    if (tabValue === 0) {
      setStock(filteredResults);
    } else {
      setDeployed(filteredResults);
    }
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
  }, [pendingRedux, deployedRedux, stockRedux]);

  const searchBar = (text: string) => {
    text = text.toLowerCase();
    if (text !== "") {
      switch (tabValue as number) {
        case 0:
          let copiedStock = searchFilter([...ogstock], text);
          setStock(copiedStock);
          break;
        case 1:
          let copiedDeploy = searchFilter([...ogdeployed], text);
          setDeployed(copiedDeploy);
          break;
        case 2:
          let copiedProg = searchFilter([...oginprogrss], text);
          setInprogress(copiedProg);
          break;
      }
    } else {
      switch (tabValue as number) {
        case 0:
          setStock(ogstock);
          break;
        case 1:
          setDeployed(ogdeployed);
          break;
        case 2:
          setInprogress(oginprogrss);
          break;
      }
    }
  };

  const searchFilter = (objs: InventorySummary[], text: string) => {
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
          textChange={searchBar}
        />
        <Grid container direction="row" alignItems="center">
          <Grid item xs={7}>
            <h2>Inventory</h2>
          </Grid>
          <Grid item xs={5}>
            <Box
              display="flex"
              justifyContent="flex-end"
              justifyItems="center"
              alignItems="center"
            >
              <AssignModal type="general" devices={ogstock} />
            </Box>
          </Grid>
        </Grid>
        <div className="right">
          <Drawer
            anchor="right"
            open={filterdrawer}
            onClose={() => openFiltersDrawer(false)}
            PaperProps={{ sx: { width: "20%" } }}
          >
            <div className="filter-padding">
              <Filter
                data={
                  tabValue === 0
                    ? ogstock
                    : tabValue === 1
                    ? ogdeployed
                    : oginprogrss
                }
                setData={
                  tabValue === 0
                    ? setStock
                    : tabValue === 1
                    ? setDeployed
                    : setInprogress
                }
                device_name={device}
                selected_location={[location]}
                tab_value={tabValue}
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
                  {inprogress?.length > 0 &&
                    inprogress.map((device, index) => {
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
