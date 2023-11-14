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

import OffboardModal from "../OffboardModal";
import { InventorySummary } from "../../../interfaces/inventory";

type Order = "asc" | "desc";

interface TableProps extends InventorySummary {
  client: string;
  searched_serial: string;
}

const Deployed = (props: TableProps) => {
  const { serial_numbers, name, location, image_source, id, searched_serial } =
    props;

  useEffect(() => {
    if (serial_numbers.length > 0) {
      setSorted(
        [...serial_numbers].sort((a, b) => {
          return (
            new Date(b.date_deployed!).getTime() -
            new Date(a.date_deployed!).getTime()
          );
        })
      );
    }
  }, [serial_numbers]);

  const [orderBy, setOrderBy] = useState("Date Deployed");
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
    } else if (cell === "Employee") {
      if (!isAsc) {
        setSorted(
          devices.sort((a, b) =>
            a.first_name! + " " + a.last_name! >
            b.first_name! + " " + b.last_name!
              ? 1
              : b.first_name! + " " + b.last_name! >
                a.first_name! + " " + a.last_name!
              ? -1
              : 0
          )
        );
      } else {
        setSorted(
          devices.sort((a, b) =>
            a.first_name! + " " + a.last_name! <
            b.first_name! + " " + b.last_name!
              ? 1
              : b.first_name! + " " + b.last_name! <
                a.first_name! + " " + a.last_name!
              ? -1
              : 0
          )
        );
      }
    } else if (cell === "Date Deployed") {
      if (!isAsc) {
        setSorted(
          devices.sort((a, b) => {
            return (
              new Date(b.date_deployed!).getTime() -
              new Date(a.date_deployed!).getTime()
            );
          })
        );
      } else {
        setSorted(
          devices.sort((a, b) => {
            return (
              new Date(a.date_deployed!).getTime() -
              new Date(b.date_deployed!).getTime()
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
                  key="Employee"
                  width="20%"
                  sortDirection={orderBy === "Employee" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "Employee"}
                    onClick={sortHandler("Employee")}
                    direction={orderBy === "Employee" ? order : "asc"}
                  >
                    <Typography fontWeight="bold">Employee</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key="Date Deployed"
                  width="20%"
                  sortDirection={orderBy === "Date Deployed" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "Date Deployed"}
                    onClick={sortHandler("Date Deployed")}
                    direction={orderBy === "Date Deployed" ? order : "asc"}
                  >
                    <Typography fontWeight="bold">Date Deployed</Typography>
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
                      <TableCell width="40%">
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
                        <Typography>
                          {item.first_name + " " + item.last_name}
                        </Typography>
                      </TableCell>
                      <TableCell width="40%">
                        <Typography>{item.date_deployed}</Typography>
                      </TableCell>
                      <TableCell width="20%">
                        <OffboardModal
                          client={props.client}
                          device_name={name}
                          serial_number={sn}
                          id={id}
                          first_name={item.first_name}
                          last_name={item.last_name}
                          email={item.email}
                          phone_number={item.phone_number}
                          address_line1={item.address?.al1}
                          address_line2={item.address?.al2}
                          city={item.address?.city}
                          state={item.address?.state}
                          postal_code={item.address?.postal_code}
                          country={item.address?.country_code}
                          manage_modal={false}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography textAlign="center">
          No Devices Currently Deployed
        </Typography>
      )}
    </>
  );
};

export default Deployed;
