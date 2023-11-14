import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Collapse,
  MenuItem,
  Select,
  SelectChangeEvent,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAuth0 } from "@auth0/auth0-react";
import {
  standardPost,
  standardGet,
  standardDelete,
} from "../../../services/standard";
import { uploadFile, downloadFile } from "../../../services/azureblob";
import { clientsList } from "../../../utilities/mappings";
import { entityMappings } from "../../../app/utility/constants";
import LinearLoading from "../../common/LinearLoading";
import MarketRow from "./MarketRow";

interface MOProps {
  handleClose: Function;
}

const MarketplaceOrders = (props: MOProps) => {
  const { handleClose } = props;

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [filtered_orders, setFilteredOrders] = useState<any[]>([]);

  const [clients, setClients] = useState<string[]>([]);
  const [client_filter, setClientFilter] = useState("");
  const [error, setError] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const getOrders = async () => {
    const accessToken = await getAccessTokenSilently();

    const ordersRes = await standardGet(accessToken, "marketplaceorders");

    if (ordersRes.status === "Successful") {
      setOrders(ordersRes.data.reverse());
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orders.length === 0 && !loading) {
      setLoading(true);
      getOrders().catch();
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const orders_clients = orders.map((o) => o.client);

      setClients([...new Set(orders_clients)]);
    }
  }, [orders]);

  const filter_client = (client: string) => {
    setClientFilter(client);

    setFilteredOrders(orders.filter((o) => o.client === client));
  };

  return (
    <Box>
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography>
            <h3>Marketplace Orders</h3>
          </Typography>{" "}
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography>Client Filter:</Typography>
        <Stack direction="row" spacing={2}>
          {clients.length > 0 &&
            clients.map((c) => (
              <Chip
                label={c}
                clickable
                variant={c === client_filter ? "filled" : "outlined"}
                onClick={() => filter_client(c)}
                onDelete={
                  c === client_filter
                    ? () => {
                        setClientFilter("");
                        setFilteredOrders([]);
                      }
                    : undefined
                }
              />
            ))}
        </Stack>
      </Stack>
      {loading && <LinearLoading />}
      {!loading && orders.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Client</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Recipient Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Date Requested</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Type</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Specs</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Color</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Request Type</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Region</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {client_filter === ""
                ? orders.map((order, index) => (
                    <MarketRow order={order} refresh={getOrders} />
                  ))
                : filtered_orders.map((order, index) => (
                    <MarketRow order={order} refresh={getOrders} />
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MarketplaceOrders;
