import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import { getAllOrders } from "../../services/ordersAPI";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { updateOrders } from "../../app/slices/ordersSlice";
import { Order } from "../../interfaces/orders";
import OrderItem from "./OrderItem";
import TabPanel from "../common/TabPanel";
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

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const ordersResult = await getAllOrders(accessToken);
      dispatch(updateOrders(ordersResult.data));
    };

    fetchData().catch(console.error);
  }, []);

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
      setAll(combinedOrders);
    }
  }, [loading]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
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
              {allOrders?.map((order: Order) => {
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
              {ordersData?.in_progress!?.length > 0 &&
                ordersData.in_progress?.map((order) => {
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
              {ordersData?.completed!?.length > 0 &&
                ordersData.completed?.map((order) => {
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
