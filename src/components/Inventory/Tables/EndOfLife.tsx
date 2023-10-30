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
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";

import SmallLinearLoading from "../../common/SmallLinearLoading";

import { RootState } from "../../../app/store";
import { standardPatch } from "../../../services/standard";

import { InventorySummary } from "../../../interfaces/inventory";

type Order = "asc" | "desc";

interface TableProps extends InventorySummary {
  tableSort: Function;
  refresh: Function;
}

const EndOfLife = (props: TableProps) => {
  const { serial_numbers, tableSort, id, refresh } = props;

  const { getAccessTokenSilently } = useAuth0();

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const marketClient =
    clientData === "spokeops" ? selectedClientData : clientData;

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [loading, setLoading] = useState(false);

  const sortHandler = (cell: string) => (event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === cell && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cell);
  };

  const change_condition = async (serial_number: string) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const body = {
      client: marketClient,
      device_id: id,
      serial_number,
      updated_condition: "End of Life",
      device_index: 0,
    };

    const postResp = await standardPatch(accessToken, "inventory", body);

    if (postResp.status === "Successful") {
      await refresh();
    }
    setLoading(false);
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
                <TableCell key="End of Service Date">
                  <Typography fontWeight="bold">End of Service Date</Typography>
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
                      <TableCell>
                        <Typography>{sn}</Typography>
                      </TableCell>
                      <TableCell width="20%">
                        <Typography>{condition}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{item.grade}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{item.eol_date}</Typography>
                      </TableCell>
                      <TableCell width="20%">
                        {!loading ? (
                          <Button
                            onClick={async () => await change_condition(sn)}
                            disabled={condition === "End of Life"}
                          >
                            Mark As End Of Life
                          </Button>
                        ) : (
                          <SmallLinearLoading />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography textAlign="center">No End of Service Devices</Typography>
      )}
    </>
  );
};

export default EndOfLife;
