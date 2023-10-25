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
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as FileSaver from "file-saver";
import { Buffer } from "buffer";
import { useSelector, useDispatch } from "react-redux";

import { standardGet } from "../../services/standard";
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
  const [client, setClient] = useState("");
  const [loading, setLoading] = useState(false);
  const [all_orders, setAllOrders] = useState<Order[]>([]);
  const [tab_index, setTabIndex] = useState(0);

  const [rows_per_page, setRowsPerPage] = useState(15);
  const [no_of_expands, setNoExpands] = useState(1);

  const { height, width } = useWindowDimensions();

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
    if (client !== "") {
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
    if (search_term !== "") {
      dispatch(filterOrders(search_term));
    } else {
      dispatch(resetOrders());
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    if (newValue === 0) {
      dispatch(resetOrders());
    } else if (newValue == 1) {
      dispatch(filterType("Deployments"));
    } else if (newValue == 2) {
      dispatch(filterType("Returns"));
    }
  };

  const tab_text = () => {
    if (tab_index === 0) {
      return "Order Type";
    } else if (tab_index === 1) {
      return "Device Type";
    } else if (tab_index === 2) {
      return "Returned Device";
    }
  };

  return (
    <Box sx={{ width: "100%", height: height, overflow: "hidden" }}>
      <Stack spacing={2} px={3}>
        <Header
          textChange={searchFilter}
          label="Search Orders by order number, name, item, location"
        />
        <Stack
          direction="row"
          mt={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1}>
            <Typography component="h2" variant="h5" fontWeight="bold">
              Orders Overview
            </Typography>
            <IconButton onClick={download} id="export-orders-button">
              <FileDownloadIcon />
            </IconButton>
          </Stack>
        </Stack>
        {loading && <LinearLoading />}
      </Stack>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab_index}
          onChange={handleTabChange}
          aria-label="orders tab"
        >
          <Tab label="All" {...a11yProps(0)} />
          <Tab label="Deployments" {...a11yProps(1)} />
          <Tab label="Returns" {...a11yProps(2)} />
        </Tabs>
      </Box>
      {all_orders.length > 0 && (
        <>
          <TableContainer
            component={Paper}
            sx={{ borderRadius: "10px", mt: 3, maxHeight: "80%" }}
          >
            <Table aria-label="orders-table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell width="15%">
                    <Typography fontWeight="bold">Order Number</Typography>
                  </TableCell>
                  <TableCell width="15%">
                    <Typography fontWeight="bold">Order Date</Typography>
                  </TableCell>
                  <TableCell width="20%">
                    <Typography fontWeight="bold">Recipient Name</Typography>
                  </TableCell>
                  <TableCell width="20%">
                    <Typography fontWeight="bold">{tab_text()}</Typography>
                  </TableCell>
                  <TableCell width="15%">
                    <Typography fontWeight="bold">Price</Typography>
                  </TableCell>
                  <TableCell width="15%">
                    <Typography fontWeight="bold">Status</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {all_orders
                  .slice(0, no_of_expands * rows_per_page)
                  .map((order) => {
                    return <OrderRow {...order} selected_tab={tab_index} />;
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <ExpandTable
            rowOptions={[15, 25, 100]}
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
