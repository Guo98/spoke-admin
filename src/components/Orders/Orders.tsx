import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, IconButton, Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useSearchParams } from "react-router-dom";
import { Buffer } from "buffer";
import * as FileSaver from "file-saver";
import { downloadOrders, getAllOrders } from "../../services/ordersAPI";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { updateOrders, filterEntity } from "../../app/slices/ordersSlice";
import { Order } from "../../interfaces/orders";
import OrderItem from "./OrderItem";
import TabPanel from "../common/TabPanel";
import Header from "../Header/Header";
import "./Orders.css";

function a11yProps(index: number) {
  return {
    id: `orders-tab-${index}`,
    "aria-controls": `orders-tabpanel-${index}`,
  };
}

const style = {
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  justifyContent: "space-evenly",
};

const Orders = () => {
  const data = useSelector((state: RootState) => state.orders.data);
  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const selectedEntity = useSelector(
    (state: RootState) => state.client.selectedEntity
  );
  const roles = useSelector((state: RootState) => state.client.roles);

  const [tabValue, setTabValue] = useState(0);
  const [ordersData, setOrders] = useState(data);
  const [allOrders, setAll] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [inprog, setInprog] = useState<Order[]>([]);
  const [completed, setCompleted] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState(false);

  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const {
    getAccessTokenSilently,
    loginWithRedirect,
    isAuthenticated,
    isLoading,
  } = useAuth0();

  useEffect(() => {
    const paramsAsObj = Object.fromEntries([...searchParams]);
    if (
      Object.keys(paramsAsObj).indexOf("invitation") > -1 &&
      Object.keys(paramsAsObj).indexOf("organization") > -1 &&
      !isAuthenticated &&
      !isLoading
    ) {
      loginWithRedirect({
        invitation: paramsAsObj.invitation,
        organization: paramsAsObj.organization,
      });
    } else if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [searchParams, isLoading, isAuthenticated]);

  const fetchData = async () => {
    const accessToken = await getAccessTokenSilently();
    let client = clientData === "spokeops" ? selectedClientData : clientData;

    const ordersResult = await getAllOrders(
      accessToken,
      client,
      roles.length > 0 ? roles[0] : ""
    );

    dispatch(updateOrders(ordersResult.data));
    if (selectedEntity !== "") {
      dispatch(filterEntity(selectedEntity));
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading && loading) {
      if (clientData) {
        fetchData().catch(console.error);
      }
    }
  }, [isAuthenticated, isLoading, clientData]);

  useEffect(() => {
    if (clientData === "spokeops") {
      fetchData().catch(console.error);
    }
  }, [selectedClientData]);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    dispatch(filterEntity(selectedEntity));
  }, [selectedEntity]);

  useEffect(() => {
    if (!loading) {
      let combinedOrders = [] as Order[];
      setOrders(data);
      combinedOrders = combinedOrders.concat(
        data.in_progress!,
        data.completed!
      );
      setInprog([...data.in_progress!].reverse());
      setCompleted([...data.completed!].reverse());
      setAll(combinedOrders.sort((a, b) => b.orderNo - a.orderNo));
    }
  }, [loading, data]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const download = async () => {
    const accessToken = await getAccessTokenSilently();

    const downloadResult = await downloadOrders(
      accessToken,
      clientData === "spokeops" ? selectedClientData : clientData,
      selectedEntity
    );

    const blob = new Blob([new Buffer(downloadResult.data)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    FileSaver.saveAs(blob, "orders.xlsx");
  };

  const searchBar = (text: string) => {
    if (text !== "") {
      setFiltered(true);
      text = text.toLowerCase();

      const filteredOrders = searchFilter(
        [...ordersData.in_progress!, ...ordersData.completed!],
        text
      );
      setAll(filteredOrders);

      const filteredDeployed = searchFilter([...ordersData.in_progress!], text);
      setInprog(filteredDeployed);

      const filteredComplete = searchFilter([...ordersData.completed!], text);
      setCompleted(filteredComplete);
    } else {
      setFiltered(false);
      let combinedOrders = [] as Order[];
      combinedOrders = combinedOrders.concat(
        data.in_progress!,
        data.completed!
      );
      setAll(combinedOrders.reverse());
      setInprog(data.in_progress!);
      setCompleted(data.completed!);
    }
  };

  const searchFilter = (objs: Order[], text: string) => {
    return objs.filter(
      (order) =>
        order.orderNo.toString().indexOf(text) > -1 ||
        order.full_name.toLowerCase().indexOf(text) > -1 ||
        order.address.country.toLowerCase().indexOf(text) > -1 ||
        order.address.subdivision.toLowerCase().indexOf(text) > -1 ||
        order.items.filter((item) => item.name.toLowerCase().indexOf(text) > -1)
          .length > 0
    );
  };

  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Header
          label="Search Orders by order number, name, item, location"
          textChange={searchBar}
        />
        <h2>
          Orders{" "}
          <IconButton onClick={download} id="export-orders-button">
            <FileDownloadIcon />
          </IconButton>
        </h2>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="orders tab"
          >
            <Tab label="All" {...a11yProps(0)} />
            <Tab label="In Progress" {...a11yProps(1)} />
            <Tab label="Completed" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0} prefix="orders">
          {!loading ? (
            <>
              {allOrders.length > 0 ? (
                <>
                  {allOrders?.map((order: Order, index) => {
                    return (
                      <OrderItem
                        {...order}
                        key={index}
                        clientui={clientData}
                        actualClient={
                          clientData === "spokeops" ? selectedClientData : ""
                        }
                        index={index}
                      />
                    );
                  })}
                </>
              ) : (
                <Typography textAlign="center">
                  {filtered ? "No orders found" : "There are no orders placed."}
                </Typography>
              )}
            </>
          ) : (
            <Box sx={style}>
              <CircularProgress />
            </Box>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={1} prefix="orders">
          {!loading ? (
            <>
              {inprog.length > 0 ? (
                <>
                  {inprog!?.length > 0 &&
                    inprog?.map((order, index) => {
                      return (
                        <OrderItem
                          {...order}
                          key={index}
                          clientui={clientData}
                          actualClient={
                            clientData === "spokeops" ? selectedClientData : ""
                          }
                          index={index}
                        />
                      );
                    })}
                </>
              ) : (
                <Typography textAlign="center">
                  {filtered ? "No orders found" : "There are no orders placed."}
                </Typography>
              )}
            </>
          ) : (
            <Box sx={style}>
              <CircularProgress />
            </Box>
          )}
        </TabPanel>
        <TabPanel value={tabValue} index={2} prefix="orders">
          {!loading ? (
            <>
              {completed.length > 0 ? (
                <>
                  {completed!?.length > 0 &&
                    completed?.map((order, index) => {
                      return (
                        <OrderItem
                          {...order}
                          key={index}
                          clientui={clientData}
                          actualClient={
                            clientData === "spokeops" ? selectedClientData : ""
                          }
                          index={index}
                        />
                      );
                    })}
                </>
              ) : (
                <Typography textAlign="center">
                  {filtered ? "No orders found" : "There are no orders placed."}
                </Typography>
              )}
            </>
          ) : (
            <Box sx={style}>
              <CircularProgress />
            </Box>
          )}
        </TabPanel>
      </Box>
    </>
  );
};

export default Orders;
