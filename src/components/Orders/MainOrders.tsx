import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Chip,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as FileSaver from "file-saver";
import { Buffer } from "buffer";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useLocation } from "react-router-dom";

import { standardGet, standardPost } from "../../services/standard";
import { RootState } from "../../app/store";
import { roleMapping } from "../../utilities/mappings";
import {
  setOrders,
  filterEntity,
  filterType,
  resetOrders,
  filterOrders,
} from "../../app/slices/ordersSlice";
import { Order } from "../../interfaces/orders";

import Header from "../Header/Header";
import OrderRow from "./OrderRow";
import LinearLoading from "../common/LinearLoading";
import useWindowDimensions from "../common/WindowDimensions";
import ExpandTable from "../common/ExpandTable";

const sortOrder: any = {
  Completed: 3,
  Complete: 3,
  Shipped: 2,
  Incomplete: 1,
};

const sortOrders = (a: Order, b: Order) => {
  if (sortOrder[a.shipping_status] < sortOrder[b.shipping_status]) return -1;
  if (sortOrder[a.shipping_status] > sortOrder[b.shipping_status]) return 1;

  if (a.orderNo > b.orderNo) return -1;
  if (a.orderNo < b.orderNo) return 1;
};

const a11yProps = (index: number) => {
  return {
    id: `orders-tab-${index}`,
    "aria-controls": `orders-tabpanel-${index}`,
  };
};

const MainOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [client, setClient] = useState("");
  const [loading, setLoading] = useState(false);
  const [all_orders, setAllOrders] = useState<Order[]>([]);
  const [tab_index, setTabIndex] = useState(0);

  const [search_serial, setSearchSerial] = useState("");

  const [rows_per_page, setRowsPerPage] = useState(25);
  const [no_of_expands, setNoExpands] = useState(1);

  const [slack_loading, setSlackLoading] = useState(false);
  const [slack_status, setSlackStatus] = useState(-1);

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const selectedEntity = useSelector(
    (state: RootState) => state.client.selectedEntity
  );
  const roles = useSelector((state: RootState) => state.client.roles);

  const data = useSelector((state: RootState) => state.orders.orders_data);

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (searchParams.get("sn")) {
      setSearchSerial(searchParams.get("sn")!);
    } else if (searchParams.get("code")) {
      authorizeSlack(searchParams.get("code")!).catch();
    } else {
      setSearchSerial("");
      searchFilter("");
      setTabIndex(0);
    }
  }, [searchParams, location.pathname]);

  useEffect(() => {
    if (search_serial !== "") {
      dispatch(filterOrders(search_serial));
    } else {
      dispatch(resetOrders());
    }
  }, [search_serial]);

  useEffect(() => {
    if (client !== "" && search_serial === "") {
      getOrders().catch();
    }
  }, [client]);

  useEffect(() => {
    setClient(clientData === "spokeops" ? selectedClientData : clientData);
  }, [clientData, selectedClientData]);

  useEffect(() => {
    let combinedOrders = [] as Order[];
    combinedOrders = combinedOrders.concat(data.in_progress!, data.completed!);
    setAllOrders(
      // @ts-ignore
      combinedOrders.sort(sortOrders)
    );
  }, [data]);

  useEffect(() => {
    dispatch(filterEntity(selectedEntity));
  }, [selectedEntity]);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setNoExpands(1);
  };

  const handleExpandCollapse = (expand: boolean) => {
    if (expand) {
      setNoExpands(no_of_expands + 1);
    } else if (no_of_expands !== 1) {
      setNoExpands(no_of_expands - 1);
    }
  };

  const authorizeSlack = async (auth_code: string) => {
    setSlackLoading(true);
    const access_token = await getAccessTokenSilently();

    const slack_resp = await standardPost(access_token, "slack/authorize", {
      code: auth_code,
    });

    if (slack_resp.status === "Successful") {
      setSlackStatus(0);
    } else {
      setSlackStatus(1);
    }
    setSlackLoading(false);
  };

  const getOrders = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    let route = "orders/" + client;

    if (roles?.length > 0 && roles[0] !== "admin") {
      route = route + "/" + roleMapping[roles[0]];
    }

    const orders_resp = await standardGet(accessToken, route);

    dispatch(setOrders(orders_resp.data));
    if (selectedEntity !== "") {
      dispatch(filterEntity(selectedEntity));
    }
    setLoading(false);
  };

  const download = async () => {
    const accessToken = await getAccessTokenSilently();

    let route = `downloadorders/${client}`;

    if (selectedEntity !== "") {
      route = route + `/${selectedEntity}`;
    }
    const downloadResult = await standardGet(accessToken, route);

    const blob = new Blob([new Buffer(downloadResult.data)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    FileSaver.saveAs(blob, "orders.xlsx");
  };

  const searchFilter = (search_term: string) => {
    setTabIndex(0);
    if (search_term !== "") {
      dispatch(filterOrders(search_term));
    } else {
      dispatch(resetOrders());
      if (search_serial !== "") {
        searchParams.delete("sn");
        setSearchParams(searchParams);
        setSearchSerial("");
      }
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    if (newValue === 0) {
      dispatch(resetOrders());
    } else if (newValue === 1) {
      dispatch(filterType("Deployments"));
    } else if (newValue === 2) {
      dispatch(filterType("Returns"));
    }
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Stack spacing={2} px={3}>
        <Header
          textChange={searchFilter}
          label="Search Orders by order number, name, item, serial number, location"
          search_value={search_serial}
        />
        <Stack
          direction="row"
          mt={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1}>
            <Typography
              component="h2"
              variant="h5"
              fontWeight="bold"
              id="orders-header"
            >
              Orders
            </Typography>
            <IconButton onClick={download} id="export-orders-button">
              <FileDownloadIcon />
            </IconButton>
          </Stack>
        </Stack>
        {loading && <LinearLoading />}
        {slack_loading && <Alert severity="info">Adding...</Alert>}
        {!slack_loading && slack_status === 0 && (
          <Alert severity="success">
            Successfully added slack bot to your workspace!
          </Alert>
        )}
        {!slack_loading && slack_status === 1 && (
          <Alert severity="error">
            Error in adding slack bot to your workspace...
          </Alert>
        )}
      </Stack>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab_index}
          onChange={handleTabChange}
          aria-label="orders tab"
        >
          <Tab label="All" {...a11yProps(0)} id="orders-all" />
          <Tab label="Deployments" {...a11yProps(1)} id="orders-deployments" />
          <Tab label="Returns" {...a11yProps(2)} id="orders-returns" />
        </Tabs>
      </Box>
      {all_orders.length > 0 && (
        <>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: "10px", mt: 3 }}
            id="orders-table-container"
          >
            <Table aria-label="orders-table" stickyHeader>
              <TableHead>
                <TableRow id="orders-table-header-row">
                  <TableCell id="orders-collapsible-col" />
                  <TableCell width="15%" id="orders-number-col">
                    <Typography fontWeight="bold">Order Number</Typography>
                  </TableCell>
                  <TableCell width="15%" id="orders-date-col">
                    <Typography fontWeight="bold">Order Date</Typography>
                  </TableCell>
                  <TableCell width="20%" id="orders-name-col">
                    <Typography fontWeight="bold">Recipient Name</Typography>
                  </TableCell>
                  <TableCell width="20%" id="orders-type-col">
                    <Typography fontWeight="bold">Device Type</Typography>
                  </TableCell>
                  <TableCell width="15%" id="orders-price-col">
                    <Typography fontWeight="bold">Price</Typography>
                  </TableCell>
                  <TableCell width="15%" id="orders-status-col">
                    <Typography fontWeight="bold">Status</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody id="orders-table-body">
                {all_orders
                  .slice(0, no_of_expands * rows_per_page)
                  .map((order, index) => {
                    return (
                      <OrderRow
                        {...order}
                        selected_tab={tab_index}
                        parent_client={clientData}
                        selected_client={client}
                        single_row={all_orders.length === 1}
                        index={index}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <ExpandTable
            count={all_orders.length}
            rowsPerPage={25}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onExpandCollapse={handleExpandCollapse}
            expands={no_of_expands}
          />
        </>
      )}
    </Box>
  );
};

export default MainOrders;
