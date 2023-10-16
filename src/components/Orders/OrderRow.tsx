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
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import ItemsTable from "./ItemsTable";

import { Order } from "../../interfaces/orders";

const OrderRow = (props: Order) => {
  const [open, setOpen] = useState(false);
  const [order_price, setOrderPrice] = useState(0);
  const [returned_laptop, setReturnedLaptop] = useState("");

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

  const getOrderType = () => {
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
      });

      setOrderPrice(total_price);
    }
    setOpen(false);
  }, [props.full_name]);

  return props.items ? (
    <>
      <TableRow sx={{ backgroundColor: open ? "primary.main" : "primary" }}>
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
          <Typography>{getOrderType()}</Typography>
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
                <Typography fontWeight="bold" fontSize="125%">
                  Employee Info:
                </Typography>
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
                <Typography fontWeight="bold" fontSize="125%">
                  Items:
                </Typography>
              </Stack>
              <ItemsTable items={props.items} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  ) : null;
};

export default OrderRow;
