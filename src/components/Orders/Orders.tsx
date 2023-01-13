import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ordersMock from "../../mockData/orders.json";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { updateOrders } from "../../app/slices/ordersSlice";
import { Order } from "../../interfaces/orders";
import OrderItem from "./OrderItem";
import "./Orders.css";

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
    id: `orders-tab-${index}`,
    "aria-controls": `orders-tabpanel-${index}`,
  };
}

const Orders = () => {
  const data = useSelector((state: RootState) => state.orders.data);
  const [tabValue, setTabValue] = useState(0);
  const [ordersData, setOrders] = useState(data);
  const [allOrders, setAll] = useState<Order[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateOrders(ordersMock));
  }, []);

  useEffect(() => {
    let combinedOrders = [] as Order[];
    setOrders(data);
    combinedOrders = combinedOrders.concat(data.in_progress!, data.completed!);
    setAll(combinedOrders);
  }, [data]);

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
        <TabPanel value={tabValue} index={0}>
          {allOrders?.map((order: Order) => {
            return (
              <OrderItem
                order_number={order.orderNo}
                first_name={order.firstName}
                last_name={order.lastName}
                city={order.address.city}
                country={order.address.country}
                items={order.items}
              />
            );
          })}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {ordersData?.in_progress!?.length > 0 &&
            ordersData.in_progress?.map((order) => {
              return (
                <OrderItem
                  order_number={order.orderNo}
                  first_name={order.firstName}
                  last_name={order.lastName}
                  city={order.address.city}
                  country={order.address.country}
                  items={order.items}
                />
              );
            })}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {ordersData?.completed!?.length > 0 &&
            ordersData.completed?.map((order) => {
              return (
                <OrderItem
                  order_number={order.orderNo}
                  first_name={order.firstName}
                  last_name={order.lastName}
                  city={order.address.city}
                  country={order.address.country}
                  items={order.items}
                />
              );
            })}
        </TabPanel>
      </Box>
    </>
  );
};

export default Orders;
