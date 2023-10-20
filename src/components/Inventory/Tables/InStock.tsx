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
} from "@mui/material";

import AssignModal from "../AssignModal";
import { InventorySummary } from "../../../interfaces/inventory";

type Order = "asc" | "desc";

interface TableProps extends InventorySummary {
  tableSort: Function;
}

const InStock = (props: TableProps) => {
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
                  width="40%"
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
                <TableCell
                  key="Grade"
                  width="40%"
                  sortDirection={orderBy === "Grade" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "Grade"}
                    onClick={sortHandler("Grade")}
                    direction={orderBy === "Grade" ? order : "asc"}
                  >
                    <Typography fontWeight="bold">Grade</Typography>
                  </TableSortLabel>
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
                      <TableCell width="40%">
                        <Typography>{sn}</Typography>
                      </TableCell>
                      <TableCell width="20%">
                        <Typography>{condition}</Typography>
                      </TableCell>
                      <TableCell width="40%">
                        <Typography>
                          {condition === "Used" && item.grade}
                        </Typography>
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
