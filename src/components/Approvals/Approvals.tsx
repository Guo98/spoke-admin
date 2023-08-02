import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Stack,
  LinearProgress,
  SelectChangeEvent,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../app/store";
import { standardGet } from "../../services/standard";
import Header from "../Header/Header";
import {
  setApprovals,
  updateApprovals,
  filterApprovals,
} from "../../app/slices/approvalsSlice";
import QuoteRow from "./QuoteRow";
import FormattedCell from "../common/FormattedCell";
import DateFilter from "../common/DateFilter";

const Approvals = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const client = useSelector((state: RootState) => state.client.data);
  const selectedClient = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const reduxData = useSelector(
    (state: RootState) => state.approvals.filteredData
  );
  const dateFilter = useSelector(
    (state: RootState) => state.approvals.dateFilter
  );

  const dispatch = useDispatch();

  let marketClient = client === "spokeops" ? selectedClient : client;

  const { getAccessTokenSilently } = useAuth0();

  const getOrders = async () => {
    const accessToken = await getAccessTokenSilently();

    const ordersRes = await standardGet(
      accessToken,
      "marketplaceorders/" + marketClient
    );

    if (ordersRes.status === "Successful") {
      dispatch(setApprovals(ordersRes.data));
      setLoading(false);
    } else {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reduxData.length === 0 && !loading && client !== "") {
      setLoading(true);
      getOrders().catch();
    }
  }, []);

  useEffect(() => {
    if (client !== "") {
      setLoading(true);
      getOrders().catch();
    }
  }, [client, selectedClient]);

  useEffect(() => {}, [dateFilter]);

  const handleTextChange = (text: string) => {
    dispatch(filterApprovals(text));
  };

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(updateApprovals(event.target.value));
  };

  return (
    <Box sx={{ width: "94%", paddingLeft: "3%" }}>
      <Header
        label={"Search Approvals by requested items, names"}
        textChange={handleTextChange}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        alignItems="center"
      >
        <h2>Approvals</h2>
        <DateFilter defaultValue={dateFilter} handleChange={handleChange} />
      </Stack>
      {loading && <LinearProgress />}
      {!loading && reduxData.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <FormattedCell text="Date Requested" bold={true} />
                <FormattedCell text="Recipient Name" bold={true} />
                <FormattedCell text="Requested Item" bold={true} />
                <FormattedCell text="Status" bold={true} />
              </TableRow>
            </TableHead>
            <TableBody>
              {reduxData.map((order: any) => (
                <QuoteRow {...order} setOrders={getOrders} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!loading && reduxData.length === 0 && (
        <Typography textAlign="center">
          No approvals{" "}
          {dateFilter === "30"
            ? "in the last 30 days"
            : dateFilter === "60"
            ? "in the last 60 days"
            : "pending"}
        </Typography>
      )}
    </Box>
  );
};

export default Approvals;
