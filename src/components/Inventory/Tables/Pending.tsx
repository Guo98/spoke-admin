import React, { useState } from "react";
import {
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableSortLabel,
  Paper,
  Button,
} from "@mui/material";

import AddToStock from "../AddModalBoxes/AddToStock";
import { InventorySummary } from "../../../interfaces/inventory";

type Order = "asc" | "desc";

interface TableProps extends InventorySummary {
  clientData?: string;
  searched_serial: string;
}

const Pending = (props: TableProps) => {
  const { serial_numbers, name, location, image_source, id, searched_serial } =
    props;

  const [orderBy, setOrderBy] = useState("Date Requested");
  const [order, setOrder] = useState<Order>("asc");
  const [sorted_serials, setSorted] = useState(serial_numbers);

  const sortHandler = (cell: string) => (event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === cell && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cell);

    let devices = [...serial_numbers];
    if (cell === "Serial Number") {
      if (!isAsc) {
        setSorted(
          devices.sort((a, b) => (a.sn > b.sn ? 1 : b.sn > a.sn ? -1 : 0))
        );
      } else {
        setSorted(
          devices.sort((a, b) => (a.sn < b.sn ? 1 : b.sn < a.sn ? -1 : 0))
        );
      }
    } else if (cell === "Status") {
      if (!isAsc) {
        setSorted(
          devices.sort((a, b) =>
            a.status > b.status ? 1 : b.status > a.status ? -1 : 0
          )
        );
      } else {
        setSorted(
          devices.sort((a, b) =>
            a.status < b.status ? 1 : b.status < a.status ? -1 : 0
          )
        );
      }
    } else if (cell === "Date Requested") {
      if (!isAsc) {
        setSorted(
          devices.sort((a, b) => {
            return (
              new Date(b.date_requested!).getTime() -
              new Date(a.date_requested!).getTime()
            );
          })
        );
      } else {
        setSorted(
          devices.sort((a, b) => {
            return (
              new Date(a.date_requested!).getTime() -
              new Date(b.date_requested!).getTime()
            );
          })
        );
      }
    }
  };

  return (
    <>
      {serial_numbers.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
          <Table aria-label="device-table">
            <TableHead>
              <TableRow>
                <TableCell
                  key="SerialNumber"
                  width="25%"
                  sortDirection={orderBy === "Serial Number" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "Serial Number"}
                    onClick={sortHandler("Serial Number")}
                    direction={orderBy === "Serial Number" ? order : "asc"}
                  >
                    <Typography fontWeight="bold">Serial Number</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key="Status"
                  width="20%"
                  sortDirection={orderBy === "Status" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "Status"}
                    onClick={sortHandler("Status")}
                    direction={orderBy === "Status" ? order : "asc"}
                  >
                    <Typography fontWeight="bold">Status</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell width="15%">
                  <Typography fontWeight="bold">Quantity</Typography>
                </TableCell>
                <TableCell key="Date Requested" width="20%">
                  <TableSortLabel
                    active={orderBy === "Date Requested"}
                    onClick={sortHandler("Date Requested")}
                    direction={orderBy === "Date Requested" ? order : "asc"}
                  >
                    <Typography fontWeight="bold">Date Requested</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell key="Action" width="20%">
                  <Typography fontWeight="bold">Action</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted_serials.length > 0 &&
                sorted_serials.map((item: any, index: number) => {
                  const { sn, condition } = item;
                  return (
                    <TableRow key={index}>
                      <TableCell width="25%">
                        <Typography
                          color={
                            searched_serial !== "" && searched_serial === sn
                              ? "#AEDD6B"
                              : ""
                          }
                        >
                          {sn}
                        </Typography>
                      </TableCell>
                      <TableCell width="20%">
                        <Typography>{item.status}</Typography>
                      </TableCell>
                      <TableCell width="15%">
                        <Typography>{item.quantity || 1}</Typography>
                      </TableCell>
                      <TableCell width="20%">
                        <Typography>{item.date_requested}</Typography>
                      </TableCell>
                      <TableCell width="20%">
                        <Button
                          href={
                            "https://withspoke.aftership.com/" +
                            item.tracking_number
                          }
                          target="_blank"
                        >
                          Track
                        </Button>
                        {props.clientData === "spokeops" && item.quantity && (
                          <AddToStock
                            quantity={item.quantity!}
                            device_name={name}
                            device_location={location}
                            status={item.sn}
                            date_requested={item.date_requested!}
                            new_device={props.new_device}
                            id={id}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography textAlign="center">No Devices Pending</Typography>
      )}
    </>
  );
};

export default Pending;
