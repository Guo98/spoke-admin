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
  tableSort: Function;
  clientData?: string;
}

const Pending = (props: TableProps) => {
  const { serial_numbers, tableSort, name, location, image_source, id } = props;

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState<Order>("asc");

  const sortHandler = (cell: string) => (event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === cell && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cell);
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
                  key="Condition"
                  width="20%"
                  sortDirection={orderBy === "Condition" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "Condition"}
                    onClick={sortHandler("Condition")}
                    direction={orderBy === "Condition" ? order : "asc"}
                  >
                    <Typography fontWeight="bold">Status</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key="Grade"
                  width="15%"
                  sortDirection={orderBy === "Grade" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "Grade"}
                    onClick={sortHandler("Grade")}
                    direction={orderBy === "Grade" ? order : "asc"}
                  >
                    <Typography fontWeight="bold">Quantity</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell key="Date" width="20%">
                  <Typography fontWeight="bold">Date Requested</Typography>
                </TableCell>
                <TableCell key="Action" width="20%">
                  <Typography fontWeight="bold">Action</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serial_numbers.length > 0 &&
                tableSort().map((item: any, index: number) => {
                  const { sn, condition } = item;
                  return (
                    <TableRow key={index}>
                      <TableCell width="25%">
                        <Typography>{sn}</Typography>
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
