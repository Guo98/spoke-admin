import React, { useState, useEffect } from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Collapse,
  IconButton,
  Box,
  Chip,
  Stack,
  useTheme,
  Divider,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import ItemsTable from "./ItemsTable";
import OperationsManage from "./OperationsManage";
import OrderLaptop from "./OrderLaptop";
import DeleteModal from "../Operations/DeleteModal";

import { Order } from "../../interfaces/orders";

interface OrderRowProps extends Order {
  selected_tab: number;
}

const OrderRow = (props: OrderRowProps) => {
  const { selected_tab } = props;

  const [open, setOpen] = useState(false);
  const [order_price, setOrderPrice] = useState(0);
  const [returned_laptop, setReturnedLaptop] = useState("");
  const [deployed_laptop, setDeployedLaptop] = useState("");

  const isDarkTheme = useTheme().palette.mode === "dark";

  const anyTrackingNumbers = () => {
    const { items } = props;
    let anyTrackingNumbers = "";
    for (let i = 0; i < items.length; i++) {
      if (
        items[i].tracking_number &&
        items[i].tracking_number !== "" &&
        items[i].tracking_number[0] !== "" &&
        items[i].tracking_number[0] !== " "
      ) {
        anyTrackingNumbers = items[i].tracking_number[0];
        break;
      }
    }

    return anyTrackingNumbers;
  };

  const formatPrice = () => {
    if (isNaN(order_price)) {
      return "$0.00";
    } else if (order_price.toString().includes(".")) {
      return "$" + order_price;
    } else {
      return "$" + order_price + ".00";
    }
  };

  const getOrderTypeOrName = () => {
    if (selected_tab === 0) {
      for (let item of props.items) {
        if (item.name.includes("Return")) {
          return (
            <Chip
              label={"Returning"}
              sx={{
                width: "125px",
                backgroundColor: "#FFE3B2",
                color: "#690C00",
              }}
            />
          );
        } else if (item.name.includes("Offboard")) {
          return (
            <Chip
              label={"Offboarding"}
              sx={{
                width: "125px",
                backgroundColor: "#FFC28C",
                color: "#690C00",
              }}
            />
          );
        } else if (item.type === "laptop") {
          return (
            <Chip
              label={"Deployment"}
              sx={{
                width: "125px",
                backgroundColor: "#E1FFBB",
                color: "#2B4B02",
              }}
            />
          );
        }
      }
    } else if (selected_tab === 1) {
      return deployed_laptop;
    } else if (selected_tab === 2) {
      return returned_laptop;
    }
  };

  const getStatus = () => {
    const { shipping_status } = props;
    if (anyTrackingNumbers() === "" && shipping_status === "Incomplete") {
      return (
        <Chip
          label={"Order Received"}
          sx={{
            width: "125px",
            backgroundColor: "#FFF8EF",
            color: "#DC282A",
          }}
        />
      );
    } else if (
      shipping_status === "Shipped" ||
      shipping_status === "Incomplete"
    ) {
      return (
        <Chip
          label={"Shipped"}
          sx={{
            width: "125px",
            backgroundColor: "#ECE7F1",
            color: "#6A37E8",
          }}
        />
      );
    } else if (
      shipping_status === "Completed" ||
      shipping_status === "Complete"
    ) {
      return (
        <Chip
          label={"Completed"}
          sx={{
            width: "125px",
            backgroundColor: "#E8FDFF",
            color: "#025DFE",
          }}
        />
      );
    }
  };

  useEffect(() => {
    if (props.items) {
      let total_price = 0;

      props.items.forEach((i) => {
        total_price += parseFloat(i.price.toString());

        if (i.type === "laptop") {
          setDeployedLaptop(i.name);
        }
      });

      setOrderPrice(total_price);

      if (props.items[0].laptop_name) {
        setReturnedLaptop(props.items[0].laptop_name);
      }
    }
    setOpen(false);
  }, [props.full_name]);

  return props.items ? (
    <>
      <TableRow
        sx={{
          backgroundColor: open
            ? isDarkTheme
              ? "#616E82"
              : "#F8F8F8"
            : "primary",
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell width="15%">
          <Typography>{props.orderNo}</Typography>
        </TableCell>
        <TableCell width="15%">
          <Typography>
            {new Date(props.date).toLocaleDateString("en-us")}
          </Typography>
        </TableCell>
        <TableCell width="20%">
          <Typography>{props.full_name}</Typography>
        </TableCell>
        <TableCell width="20%">
          <Typography>{getOrderTypeOrName()}</Typography>
        </TableCell>
        <TableCell width="15%">
          <Typography>{formatPrice()}</Typography>
        </TableCell>
        <TableCell width="15%">{getStatus()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ mx: 5, my: 1 }}>
              <Stack spacing={1} mb={2}>
                <Divider
                  textAlign="left"
                  sx={{ fontSize: "115%", fontWeight: "bold" }}
                >
                  Employee Info
                </Divider>
                <div>
                  <Typography
                    fontWeight="bold"
                    display="inline"
                    component="span"
                  >
                    Recipient Name:
                  </Typography>
                  <Typography display="inline" component="span">
                    {" " + props.full_name}
                  </Typography>
                </div>
                <div>
                  <Typography
                    fontWeight="bold"
                    display="inline"
                    component="span"
                  >
                    Email:
                  </Typography>
                  <Typography display="inline" component="span">
                    {" " + props.email}
                  </Typography>
                </div>
                {props.address && (
                  <div>
                    <Typography
                      fontWeight="bold"
                      display="inline"
                      component="span"
                    >
                      Location:
                    </Typography>
                    <Typography display="inline" component="span">
                      {" " + props.address.subdivision}, {props.address.country}
                    </Typography>
                  </div>
                )}
                {returned_laptop && (
                  <div>
                    <Typography
                      fontWeight="bold"
                      display="inline"
                      component="span"
                    >
                      Returned Device:
                    </Typography>
                    <Typography display="inline" component="span">
                      {" " + returned_laptop}
                    </Typography>
                  </div>
                )}
                <Divider
                  textAlign="left"
                  sx={{ fontSize: "115%", fontWeight: "bold" }}
                >
                  Items
                </Divider>
                <ItemsTable items={props.items} />
                <Stack direction="row" spacing={1}>
                  <OperationsManage {...props} />
                  {deployed_laptop !== "" &&
                    props.shipping_status !== "Complete" &&
                    props.shipping_status !== "Completed" &&
                    props.shipping_status !== "Shipped" && (
                      <OrderLaptop {...props} />
                    )}
                  <DeleteModal
                    id={props.id}
                    client={props.client}
                    full_name={props.full_name}
                  />
                </Stack>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  ) : null;
};

export default OrderRow;
