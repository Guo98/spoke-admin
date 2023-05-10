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
  Collapse,
  Grid,
  IconButton,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { getAllMarketplace } from "../../services/ordersAPI";
import { downloadFile } from "../../services/azureblob";
import Header from "../Header/Header";

interface FormattedProps {
  text: string;
  bold?: boolean;
}

interface QuoteProps {
  recipient_name: string;
  device_type: string;
  date: string;
  status: string;
}

const FormattedCell = (props: FormattedProps) => {
  return (
    <TableCell>
      <Typography fontWeight={props.bold ? "bold" : ""}>
        {props.text}
      </Typography>
    </TableCell>
  );
};

const QuoteRow = (props: QuoteProps) => {
  const { date, recipient_name, device_type, status } = props;
  const [open, setOpen] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const download = async () => {
    const accessToken = await getAccessTokenSilently();
    const docResponse = await downloadFile(accessToken);

    const fileBytes = docResponse.byteStream;
    const arr = new Uint8Array(fileBytes.data);
    const pdf = new Blob([arr], {
      type: "application/pdf;charset=utf-8",
    });

    const url = URL.createObjectURL(pdf);

    window.open(url);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <FormattedCell text={date} />
        <FormattedCell text={recipient_name} />
        <FormattedCell text={device_type} />
        <FormattedCell text={status} />
      </TableRow>
      <TableRow>
        <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                spacing={2}
                sx={{ display: "flex" }}
              >
                <Grid item xs={4}>
                  <Button onClick={download}>View Quote</Button>
                </Grid>
                <Grid item xs={4}>
                  <Button color="success" variant="contained">
                    Approve
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button variant="outlined" color="secondary">
                    Deny
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const Approvals = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState(false);

  const client = useSelector((state: RootState) => state.client.data);
  const selectedClient = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  let marketClient = client === "spokeops" ? selectedClient : client;

  const { getAccessTokenSilently } = useAuth0();

  const getOrders = async () => {
    const accessToken = await getAccessTokenSilently();

    const ordersRes = await getAllMarketplace(accessToken, marketClient);

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

  const handleTextChange = () => {};

  return (
    <Box sx={{ width: "94%", paddingLeft: "3%" }}>
      <Header
        label={"Search for requests, names"}
        textChange={handleTextChange}
      />
      <Typography>
        <h2>Approvals</h2>
      </Typography>
      {!loading && orders.length > 0 && (
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
              {orders.map((order) => (
                <QuoteRow {...order} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Approvals;
