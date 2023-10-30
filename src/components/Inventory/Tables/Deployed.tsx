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

import ManageModal from "../ManageModal";
import OffboardModal from "../OffboardModal";
import { InventorySummary } from "../../../interfaces/inventory";

type Order = "asc" | "desc";

interface TableProps extends InventorySummary {
  tableSort: Function;
  client: string;
}

const Deployed = (props: TableProps) => {
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
                    <Typography fontWeight="bold">Employee</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key="Grade"
                  width="20%"
                  sortDirection={orderBy === "Grade" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "Grade"}
                    onClick={sortHandler("Grade")}
                    direction={orderBy === "Grade" ? order : "asc"}
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
              {serial_numbers.length > 0 &&
                tableSort().map((item: any, index: number) => {
                  const { sn, condition } = item;
                  return (
                    <TableRow key={index}>
                      <TableCell width="40%">
                        <Typography>{sn}</Typography>
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
                        {/* <ManageModal
                          name={{
                            first_name: item.first_name!,
                            last_name: item.last_name!,
                          }}
                          address={item.address!}
                          email={item.email!}
                          serial_number={item.sn}
                          device_name={name}
                          device_location={location}
                          phone_number={item.phone_number!}
                          type="individual"
                          id={id}
                        /> */}
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
