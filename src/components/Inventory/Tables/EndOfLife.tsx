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
  const { serial_numbers, id, refresh } = props;

  const { getAccessTokenSilently } = useAuth0();

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const marketClient =
    clientData === "spokeops" ? selectedClientData : clientData;

  const [orderBy, setOrderBy] = useState("End of Service Date");
  const [order, setOrder] = useState<Order>("asc");
  const [loading, setLoading] = useState(false);
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
    } else if (cell === "End of Service Date") {
      if (!isAsc) {
        setSorted(
          devices.sort((a, b) => {
            return (
              new Date(b.eol_date!).getTime() - new Date(a.eol_date!).getTime()
            );
          })
        );
      } else {
        setSorted(
          devices.sort((a, b) => {
            return (
              new Date(a.eol_date!).getTime() - new Date(b.eol_date!).getTime()
            );
          })
        );
      }
    }
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
      {sorted_serials.length > 0 ? (
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
                <TableCell width="20%">
                  <Typography fontWeight="bold">Condition</Typography>
                </TableCell>
                <TableCell key="Grade">
                  <Typography fontWeight="bold">Grade</Typography>
                </TableCell>
                <TableCell
                  key="End of Service Date"
                  sortDirection={
                    orderBy === "End of Service Date" ? order : false
                  }
                >
                  <TableSortLabel
                    active={orderBy === "End of Service Date"}
                    onClick={sortHandler("End of Service Date")}
                    direction={
                      orderBy === "End of Service Date" ? order : "asc"
                    }
                  >
                    <Typography fontWeight="bold">
                      End of Service Date
                    </Typography>
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
