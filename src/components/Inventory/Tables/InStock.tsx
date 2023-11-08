import React, { useState, useEffect } from "react";
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
} from "@mui/material";

import AssignModal from "../AssignModal";
import { InventorySummary } from "../../../interfaces/inventory";

type Order = "asc" | "desc";

interface TableProps extends InventorySummary {
  tableSort: Function;
  searched_serial: string;
}

const InStock = (props: TableProps) => {
  const {
    serial_numbers,
    tableSort,
    name,
    location,
    image_source,
    id,
    searched_serial,
  } = props;

  const [orderBy, setOrderBy] = useState("Serial Number");
  const [order, setOrder] = useState<Order>("asc");
  const [sorted_serials, setSorted] = useState(serial_numbers);

  useEffect(() => {
    if (serial_numbers.length > 0) {
      setSorted(
        [...serial_numbers].sort((a, b) =>
          a.sn < b.sn ? 1 : b.sn < a.sn ? -1 : 0
        )
      );
    }
  }, [serial_numbers]);

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
    } else if (cell === "Condition") {
      if (!isAsc) {
        setSorted(
          devices.sort((a, b) =>
            a.condition! > b.condition!
              ? 1
              : b.condition! > a.condition!
              ? -1
              : 0
          )
        );
      } else {
        setSorted(
          devices.sort((a, b) =>
            a.condition! < b.condition!
              ? 1
              : b.condition! < a.condition!
              ? -1
              : 0
          )
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
                  width="35%"
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
                    <Typography fontWeight="bold">Condition</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell key="Grade" width="20%">
                  <Typography fontWeight="bold">Grade</Typography>
                </TableCell>
                <TableCell key="Warehouse" width="25%">
                  <Typography fontWeight="bold">Warehouse</Typography>
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
                      <TableCell width="35%">
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
                        <Typography>{condition}</Typography>
                      </TableCell>
                      <TableCell width="20%">
                        <Typography>
                          {condition === "Used" && item.grade}
                        </Typography>
                      </TableCell>
                      <TableCell width="25%">
                        <Typography>{item.warehouse}</Typography>
                      </TableCell>
                      <TableCell width="20%">
                        <AssignModal
                          serial_number={sn}
                          device_name={name}
                          device_location={location}
                          image_source={image_source}
                          type="individual"
                          id={id}
                          disabled={
                            item.condition !== "Used" &&
                            item.condition !== "New"
                          }
                          warehouse={item.warehouse}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography textAlign="center">Out of Stock</Typography>
      )}
    </>
  );
};

export default InStock;
