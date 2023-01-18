import React, { FC, ReactElement, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import AddIcon from "@mui/icons-material/Add";
import Drawer from "@mui/material/Drawer";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth0 } from "@auth0/auth0-react";
import { RootState } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { updateInventory } from "../../app/slices/inventorySlice";
import { getInventory } from "../../services/inventoryAPI";
import SummaryCard from "./SummaryCard";
import SummaryList from "./SummaryList";
import Filter from "./Filter";
import AddModal from "./AddModal";
import { InventorySummary } from "../../interfaces/inventory";
import "./Inventory.css";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ paddingTop: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `inv-tab-${index}`,
    "aria-controls": `inv-tabpanel-${index}`,
  };
}

const Inventory: FC = (): ReactElement => {
  const data = useSelector((state: RootState) => state.inventory.data);
  const [cards, setCards] = useState(true);
  const [filterdrawer, openFiltersDrawer] = useState(false);
  const [inventoryData, setInventoryData] = useState(data);
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
      const accessToken = await getAccessTokenSilently();
      const inventoryResult = await getInventory(accessToken);
      dispatch(updateInventory(inventoryResult.data));
    };

    fetchData().catch(console.error);
  }, []);

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
    setInventoryData(data);
    let inStock: InventorySummary[] = [];
    let deployed: InventorySummary[] = [];
    let offboarding: InventorySummary[] = [];

    const tempData = data;
    tempData.forEach((device) => {
      let instocklaptops = device.serial_numbers.filter(
        (individual) => individual.status === "In Stock"
      );

      let deployedlaptops = device.serial_numbers.filter(
        (individual) => individual.status === "Deployed"
      );

      let offboardingLaptops = device.serial_numbers.filter(
        (individual) =>
          individual.status === "Offboarding" ||
          individual.status === "Returning" ||
          individual.status === "Top Up"
      );

      let tempInStock = { ...device };
      tempInStock.serial_numbers = instocklaptops.slice(0);
      inStock.push(tempInStock);

      let tempDeployed = { ...device };
      tempDeployed.serial_numbers = deployedlaptops.slice(0);
      deployed.push(tempDeployed);

      let tempOffboarding = { ...device };
      tempOffboarding.serial_numbers = offboardingLaptops.slice(0);
      offboarding.push(tempOffboarding);
    });
    setStock(inStock);
    setOGStock(inStock);
    setDeployed(deployed);
    setOGDeployed(deployed);
    setInprogress(offboarding);
    setOGInprogress(offboarding);
  }, [data]);

  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Grid container>
          <Grid item xs={7}>
            <h2>Inventory</h2>
          </Grid>
          <Grid item xs={5}>
            <ToggleButtonGroup sx={{ float: "right" }} exclusive>
              <ToggleButton
                value="cards"
                selected={cards}
                onClick={() => setCards(true)}
              >
                <ViewModuleIcon />
              </ToggleButton>
              <ToggleButton
                value="list"
                selected={!cards}
                onClick={() => setCards(false)}
              >
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <div className="right">
          <Drawer
            anchor="right"
            open={filterdrawer}
            onClose={() => openFiltersDrawer(false)}
            PaperProps={{ sx: { width: "20%" } }}
          >
            <div className="container-padding">
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
                selected_location={location}
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
          <TabPanel value={tabValue} index={0}>
            <Box
              sx={{
                display: cards ? "flex" : "block",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: cards ? "space-evenly" : "center",
              }}
            >
              {!loading ? (
                <>
                  {stock?.length > 0 &&
                    stock.map((device, index) => {
                      return cards ? (
                        <SummaryCard
                          {...device}
                          setFilters={setFilters}
                          index={index}
                          type="stock"
                        />
                      ) : (
                        <SummaryList {...device} />
                      );
                    })}
                </>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box
              sx={{
                display: cards ? "flex" : "block",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: cards ? "space-evenly" : "center",
              }}
            >
              {!loading ? (
                <>
                  {deployed?.length > 0 &&
                    deployed.map((device, index) => {
                      return cards ? (
                        <SummaryCard
                          {...device}
                          setFilters={setFilters}
                          index={index}
                          type="deployed"
                        />
                      ) : (
                        <SummaryList {...device} />
                      );
                    })}
                </>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Box
              sx={{
                display: cards ? "flex" : "block",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: cards ? "space-evenly" : "center",
              }}
            >
              {!loading ? (
                <>
                  {inprogress?.length > 0 &&
                    inprogress.map((device, index) => {
                      return cards ? (
                        <SummaryCard
                          {...device}
                          setFilters={setFilters}
                          index={index}
                          type="deployed"
                        />
                      ) : (
                        <SummaryList {...device} />
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
          >
            <AddIcon />
          </Fab>
          <AddModal
            open={openAdd}
            setParentOpen={setOpenAdd}
            deviceNames={inventoryData}
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
