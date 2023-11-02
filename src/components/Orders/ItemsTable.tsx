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

import AppContainer from "../AppContainer/AppContainer";
import { Item } from "../../interfaces/orders";

interface ITProps {
  items: Item[];
}

const ItemsTable = (props: ITProps) => {
  const { items } = props;

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
    <TableContainer component={Paper} sx={{ borderRadius: "7px" }}>
      <Table
        size="small"
        aria-label="items-table"
        sx={{ backgroundColor: isDarkTheme ? "#616E82" : "#F8F8F8" }}
      >
        <TableHead>
          <TableRow>
            <TableCell width="30%">
              <Typography fontWeight="bold">Item Name</Typography>
            </TableCell>
            <TableCell width="15%">
              <Typography fontWeight="bold">Serial Number</Typography>
            </TableCell>
            <TableCell width="10%">
              <Typography fontWeight="bold">Quantity</Typography>
            </TableCell>
            <TableCell width="10%">
              <Typography fontWeight="bold">Price</Typography>
            </TableCell>
            <TableCell width="20%">
              <Typography fontWeight="bold">Tracking #</Typography>
            </TableCell>
            <TableCell width="15%">
              <Typography fontWeight="bold">Delivery Status</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
                        onClick={() =>
                          AppContainer.navigate(
                            "/inventory?sn=" + item.serial_number
                          )
                        }
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
