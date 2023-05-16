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
  Stack,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { getAllMarketplace, postOrder } from "../../services/ordersAPI";
import { downloadFile } from "../../services/azureblob";
import Header from "../Header/Header";
import DenyModal from "./DenyModal";

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
  setOrders: Function;
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
  const [denyOpen, setDenyOpen] = useState(false);

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

  const handleModalClose = () => {
    setDenyOpen(false);
  };

  const approve_deny = async (approved: boolean, reason: string = "") => {
    const accessToken = await getAccessTokenSilently();

    const bodyObj = {
      client: client,
      id: id,
      approved,
      recipient_name,
      recipient_address: address,
      item_name: device_type,
      reason,
    };

    const postResp = await postOrder("updateMarketOrder", accessToken, bodyObj);

    if (postResp.status && postResp.status !== "Successful") {
      setError(true);
    } else {
      await props.setOrders();
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
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ marginY: 1, marginX: "8%" }}>
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
                        <Typography fontWeight="bold">Quoted Price:</Typography>
                        <Typography
                          fontSize="300%"
                          display="inline"
                          component="span"
                        >
                          $
                          {props.quote_price.indexOf(".") > -1
                            ? props.quote_price.split(".")[0]
                            : props.quote_price}
                        </Typography>
                        <Typography component="span" display="inline">
                          {props.quote_price.indexOf(".") > -1
                            ? props.quote_price.split(".")[1]
                            : ".00"}
                        </Typography>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    <Stack
                      direction="column"
                      spacing={2}
                      alignItems="center normal"
                    >
                      <Button onClick={download} variant="contained">
                        <PictureAsPdfIcon sx={{ mr: 1 }} /> Quote
                      </Button>
                      {props.approved === undefined ? (
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center normal"
                        >
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: "999em 999em 999em 999em",
                              backgroundColor: "#cc0000",
                            }}
                            onClick={() => setDenyOpen(true)}
                            fullWidth
                            color="secondary"
                          >
                            <CloseIcon />
                          </Button>
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: "999em 999em 999em 999em",
                              backgroundColor: "#388e3c",
                            }}
                            onClick={() => approve_deny(true)}
                            fullWidth
                            color="success"
                          >
                            <DoneIcon />
                          </Button>
                        </Stack>
                      ) : (
                        <Typography>
                          {props.approved
                            ? "Request Approved"
                            : "Request Rejected"}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
      <DenyModal
        open={denyOpen}
        handleClose={handleModalClose}
        handleDeny={approve_deny}
      />
    </>
  );
};

const Approvals = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [dntOrders, setDntOrders] = useState<any[]>([]);
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
      setDntOrders(ordersRes.data.reverse());
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

  const handleTextChange = (text: string) => {
    const lowerCaseText = text.toLowerCase();

    if (text !== "") {
      const filteredOrders = orders.filter(
        (ord) =>
          ord.recipient_name.toLowerCase().indexOf(lowerCaseText) > -1 ||
          ord.device_type.toLowerCase().indexOf(lowerCaseText) > -1
      );

      if (filteredOrders.length > 0) {
        setOrders(filteredOrders);
      }
    } else {
      setOrders(dntOrders);
    }
  };

  return (
    <Box sx={{ width: "94%", paddingLeft: "3%" }}>
      <Header
        label={"Search for Approvals by requested items, names"}
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
                <QuoteRow {...order} setOrders={getOrders} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Approvals;
