import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "react-router-dom";
import { getAllOrders } from "../../services/ordersAPI";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { updateOrders } from "../../app/slices/ordersSlice";
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
  const [tabValue, setTabValue] = useState(0);
  const [ordersData, setOrders] = useState(data);
  const [allOrders, setAll] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [inprog, setInprog] = useState<Order[]>([]);
  const [completed, setCompleted] = useState<Order[]>([]);

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

  useEffect(() => {
    const fetchData = async (client: string) => {
      const accessToken = await getAccessTokenSilently();
      const ordersResult = await getAllOrders(accessToken, client);
      dispatch(updateOrders(ordersResult.data));
    };
    const encodedClient = localStorage.getItem("spokeclient");

    if (encodedClient) {
      fetchData(atob(encodedClient)).catch(console.error);
    }
  }, [loading]);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setLoading(false);
    }
  }, [data]);

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
  }, [loading]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const searchBar = (text: string) => {
    if (text !== "") {
      text = text.toLowerCase();
      switch (tabValue as number) {
        case 0:
          const filteredOrders = searchFilter(
            [...ordersData.in_progress!, ...ordersData.completed!],
            text
          );
          setAll(filteredOrders);
          break;
        case 1:
          const filteredDeployed = searchFilter(
            [...ordersData.in_progress!],
            text
          );
          setInprog(filteredDeployed);
          break;
        case 2:
          const filteredComplete = searchFilter(
            [...ordersData.completed!],
            text
          );
          setCompleted(filteredComplete);
          break;
      }
    } else {
      switch (tabValue as number) {
        case 0:
          let combinedOrders = [] as Order[];
          combinedOrders = combinedOrders.concat(
            data.in_progress!,
            data.completed!
          );
          setAll(combinedOrders.reverse());
          break;
        case 1:
          setInprog(data.in_progress!);
          break;
        case 2:
          setCompleted(data.completed!);
          break;
      }
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
        <h2>Orders</h2>
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
              {allOrders?.map((order: Order, index) => {
                return (
                  <OrderItem
                    order_number={order.orderNo}
                    first_name={order.firstName}
                    last_name={order.lastName}
                    city={order.address.city}
                    country={order.address.country}
                    state={order.address.subdivision}
                    items={order.items}
                    email={order.email}
                    key={index}
                    shipping_status={order.shipping_status}
                  />
                );
              })}
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
              {inprog!?.length > 0 &&
                inprog?.map((order, index) => {
                  return (
                    <OrderItem
                      order_number={order.orderNo}
                      first_name={order.firstName}
                      last_name={order.lastName}
                      city={order.address.city}
                      state={order.address.subdivision}
                      country={order.address.country}
                      items={order.items}
                      email={order.email}
                      key={index}
                      shipping_status={order.shipping_status}
                    />
                  );
                })}
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
              {completed!?.length > 0 &&
                completed?.map((order, index) => {
                  return (
                    <OrderItem
                      order_number={order.orderNo}
                      first_name={order.firstName}
                      last_name={order.lastName}
                      city={order.address.city}
                      country={order.address.country}
                      state={order.address.subdivision}
                      items={order.items}
                      email={order.email}
                      key={index}
                      shipping_status={order.shipping_status}
                    />
                  );
                })}
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
