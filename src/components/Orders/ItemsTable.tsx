import React, { useEffect } from "react";
import {
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Link,
  useTheme,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch } from "react-redux";

import AppContainer from "../AppContainer/AppContainer";
import { Item } from "../../interfaces/orders";

import { searchBySerial } from "../../app/slices/inventorySlice";

interface ITProps {
  items: Item[];
  client: string;
  recipient_name: string;
  order_no: number;
}

const ItemsTable = (props: ITProps) => {
  const { items, client, recipient_name, order_no } = props;

  const dispatch = useDispatch();

  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {}, [items]);

  const isDarkTheme = useTheme().palette.mode === "dark";

  const getCourierHost = (courier: string, tracking_number: string) => {
    if (courier === "fedex") {
      return "https://www.fedex.com/fedextrack/?trknbr=" + tracking_number;
    } else if (courier === "ups") {
      return (
        "https://wwwapps.ups.com/tracking/tracking.cgi?tracknum=" +
        tracking_number
      );
    } else if (courier === "usps") {
      return (
        "https://tools.usps.com/go/TrackConfirmAction_input?strOrigTrackNum=" +
        tracking_number
      );
    } else if (courier === "dhl") {
      return (
        "http://www.dhl.com/en/express/tracking.html?AWB=" +
        tracking_number +
        "&brand=DHL"
      );
    } else if (courier === "correios") {
      return "";
    } else {
      return "";
    }
  };

  const formatPrice = (order_price: any) => {
    if (isNaN(order_price)) {
      return "$0.00";
    } else if (order_price.toString().includes(".")) {
      return "$" + order_price;
    } else {
      return "$" + order_price + ".00";
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: "7px" }}
      id="orders-items-table"
    >
      <Table
        size="small"
        aria-label="items-table"
        sx={{ backgroundColor: isDarkTheme ? "#616E82" : "#F8F8F8" }}
      >
        <TableHead id="orders-items-table-head">
          <TableRow>
            <TableCell width="30%" id="orders-items-item-col">
              <Typography fontWeight="bold">Item Name</Typography>
            </TableCell>
            <TableCell width="15%" id="orders-items-sn-col">
              <Typography fontWeight="bold">Serial Number</Typography>
            </TableCell>
            <TableCell width="10%" id="orders-items-quantity-col">
              <Typography fontWeight="bold">Quantity</Typography>
            </TableCell>
            <TableCell width="10%" id="orders-items-price-col">
              <Typography fontWeight="bold">Price</Typography>
            </TableCell>
            <TableCell width="20%" id="orders-items-tracking-col">
              <Typography fontWeight="bold">Tracking #</Typography>
            </TableCell>
            <TableCell width="15%" id="orders-items-status-col">
              <Typography fontWeight="bold">Delivery Status</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody id="orders-items-table-body">
          {items.length > 0 &&
            items.map((item: any, index: number) => {
              const { name, price, quantity } = item;
              return (
                <TableRow key={index}>
                  <TableCell width="30%">
                    <Typography>{name}</Typography>
                  </TableCell>
                  <TableCell width="15%">
                    <Typography>
                      <Link
                        onClick={() => {
                          dispatch(
                            searchBySerial({
                              device_name: name,
                              serial_no: item.serial_number,
                              name: recipient_name,
                              client: client,
                              order_no: order_no,
                            })
                          );
                          AppContainer.navigate(
                            "/inventory?sn=" + item.serial_number
                          );
                        }}
                        aria-label="Go to selected device on inventory tab"
                        color={isDarkTheme ? "primary.contrastText" : "primary"}
                      >
                        {item.serial_number}
                      </Link>
                    </Typography>
                  </TableCell>
                  <TableCell width="10%">
                    <Typography>{quantity}</Typography>
                  </TableCell>
                  <TableCell width="10%">
                    <Typography>
                      {typeof price === "string"
                        ? USDollar.format(
                            parseFloat((price as string).replace(",", ""))
                          )
                        : USDollar.format(price)}
                    </Typography>
                  </TableCell>
                  <TableCell width="20%">
                    {item.tracking_number.length > 0 &&
                    item.courier &&
                    getCourierHost(
                      item.courier.toLowerCase(),
                      item.tracking_number[0]
                    ) !== "" ? (
                      <Link
                        href={getCourierHost(
                          item.courier.toLowerCase(),
                          item.tracking_number[0]
                        )}
                        aria-label="Tracking link that'll open in a new page"
                        target="_blank"
                        color={isDarkTheme ? "primary.contrastText" : "primary"}
                      >
                        {item.tracking_number}
                      </Link>
                    ) : (
                      item.tracking_number
                    )}
                  </TableCell>
                  <TableCell width="15%">
                    <Stack direction="row" spacing={1}>
                      <Typography>{item.delivery_status}</Typography>
                      {item.delivery_status === "Delivered" && (
                        <CheckCircleIcon color="success" />
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemsTable;
