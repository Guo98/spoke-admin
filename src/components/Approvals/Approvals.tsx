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
  Alert,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DownloadIcon from "@mui/icons-material/Download";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { getAllMarketplace, postOrder } from "../../services/ordersAPI";
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
  quote?: string;
  quote_price?: string;
  client: string;
  id: string;
  address: string;
  approved?: boolean;
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
  const { date, recipient_name, device_type, status, client, id, address } =
    props;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const download = async () => {
    const accessToken = await getAccessTokenSilently();
    const docResponse = await downloadFile(accessToken, props.quote!);

    const fileBytes = docResponse.byteStream;
    const arr = new Uint8Array(fileBytes.data);
    const pdf = new Blob([arr], {
      type: "application/pdf;charset=utf-8",
    });

    const url = URL.createObjectURL(pdf);

    window.open(url);
  };

  const approve_deny = async (approved: boolean) => {
    const accessToken = await getAccessTokenSilently();

    const bodyObj = {
      client: client,
      id: id,
      approved,
      recipient_name,
      recipient_address: address,
      item_name: device_type,
    };

    const postResp = await postOrder("updateMarketOrder", accessToken, bodyObj);

    if (postResp.status && postResp.status !== "Successful") {
      setError(true);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {props.quote && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                setOpen(!open);
                setError(false);
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <FormattedCell text={date} />
        <FormattedCell text={recipient_name} />
        <FormattedCell text={device_type} />
        <FormattedCell text={status} />
      </TableRow>
      {props.quote && (
        <TableRow>
          <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit component={Paper}>
              <Box sx={{ margin: 1 }}>
                {error && (
                  <Alert severity="error" sx={{ marginBottom: 1 }}>
                    There was an error in responding to the market order.
                  </Alert>
                )}
                <Grid
                  container
                  spacing={3}
                  justifyContent="space-between"
                  sx={{ display: "flex" }}
                >
                  <Grid item xs={9}>
                    {props.quote_price && (
                      <>
                        <Typography
                          display="inline"
                          component="span"
                          fontWeight="bold"
                        >
                          Quoted Price:
                        </Typography>
                        <Typography display="inline" component="span">
                          {" "}
                          {props.quote_price}
                        </Typography>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {props.approved === undefined && (
                      <Button
                        color="success"
                        variant="contained"
                        sx={{ minWidth: "100px" }}
                        onClick={() => approve_deny(true)}
                      >
                        Approve
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  spacing={3}
                  sx={{ display: "flex", paddingTop: "20px" }}
                >
                  <Grid item xs={9}>
                    <Button onClick={download} variant="contained">
                      <DownloadIcon /> View Quote
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    {props.approved === undefined && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ minWidth: "100px" }}
                        onClick={() => approve_deny(false)}
                      >
                        Deny
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
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
