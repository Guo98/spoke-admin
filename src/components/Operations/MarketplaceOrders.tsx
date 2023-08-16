import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Grid,
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAuth0 } from "@auth0/auth0-react";
import { standardPost, standardGet } from "../../services/standard";
import { uploadFile, downloadFile } from "../../services/azureblob";
import { clientsList } from "../../utilities/mappings";
import { entityMappings } from "../../app/utility/constants";
import LinearLoading from "../common/LinearLoading";

interface MOProps {
  handleClose: Function;
}

interface RowProps {
  order: {
    client: string;
    date: string;
    device_type: string;
    specs: string;
    color: string;
    order_type: string;
    notes: {
      device?: string;
      recipient?: string;
    };
    status: string;
    id: string;
    quote?: string;
    quote_price?: string;
    approved?: boolean | null;
    requestor_email?: string;
    email_sent?: boolean;
    recipient_name?: string;
    entity?: string;
  };
  refresh: Function;
}

const MarketRow = (props: RowProps) => {
  const { order } = props;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [changeClient, setClient] = useState("");
  const [selectEntity, setEntity] = useState("");
  const [replace, setReplace] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newReqEmail, setNewReqEmail] = useState(order.requestor_email);

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handleClientChange = (event: SelectChangeEvent) => {
    setClient(event.target.value);
  };

  const handleEntityChange = (event: SelectChangeEvent) => {
    setEntity(event.target.value);
  };

  const { getAccessTokenSilently } = useAuth0();

  const updateMarketplaceOrder = async (
    updateStatus: boolean = false,
    updatePrice: boolean = false,
    updateClient: boolean = false,
    updateEntity: boolean = false,
    updateEmail: boolean = false,
    reapprove: boolean = false
  ) => {
    let bodyObj: any = {
      id: order.id,
    };
    if (updateStatus) {
      bodyObj.client = order.client;
      if (status !== order.status) {
        bodyObj.status = status;
      }
    } else if (updatePrice) {
      bodyObj.client = order.client;
      if (
        (order.quote_price && price !== order.quote_price) ||
        !order.quote_price
      ) {
        bodyObj.price = price;
      }
    } else if (updateClient) {
      bodyObj.updateClient = changeClient;
    } else if (updateEntity) {
      bodyObj.client = order.client;
      if (!order.entity || order.entity !== selectEntity)
        bodyObj.entity = selectEntity;
    } else if (updateEmail) {
      bodyObj.client = order.client;
      if (!order.requestor_email || order.requestor_email !== newReqEmail) {
        bodyObj.requestor_email = newReqEmail;
      }
    } else if (reapprove) {
      bodyObj.client = order.client;
      bodyObj.approved = null;
    }

    const accessToken = await getAccessTokenSilently();

    const updateRes = await standardPost(
      accessToken,
      "marketplaceorders",
      bodyObj
    );

    if (updateRes.status === "Successful") {
      await props.refresh();
    }
  };

  const uploadFileOnOrder = async () => {
    setLoading(true);
    setReplace(true);
    const accessToken = await getAccessTokenSilently();
    let formData = new FormData();
    formData.append("file", file!);
    formData.append("order_id", order.id);
    formData.append("client", order.client);
    const fileResp = await uploadFile(accessToken, formData);

    if (fileResp.status === "Success") {
      await props.refresh();
    }
    setLoading(false);
  };

  const download = async () => {
    const accessToken = await getAccessTokenSilently();
    const docResponse = await downloadFile(accessToken, order.quote!);

    const fileBytes = docResponse.byteStream;
    const arr = new Uint8Array(fileBytes.data);
    const pdf = new Blob([arr], {
      type: "application/pdf;charset=utf-8",
    });

    const url = URL.createObjectURL(pdf);

    window.open(url);
  };

  const sendApprovalEmail = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    const emailResp = await standardPost(
      accessToken,
      "sendemail/approvalemail",
      order
    );

    if (emailResp.status === "Successful") {
      await props.refresh();
    }
    setLoading(false);
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
        <TableCell>
          <Typography>{order.client}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{order.recipient_name}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{order.date}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{order.device_type}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{order.specs}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{order.color}</Typography>
        </TableCell>
        <TableCell>
          <Typography>{order.order_type}</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {loading && <LinearLoading />}
              <Stack
                direction="row"
                spacing={2}
                sx={{ pb: 2, pt: 2 }}
                justifyContent="space-evenly"
              >
                <TextField
                  label="Requested By"
                  fullWidth
                  size="small"
                  defaultValue={order.requestor_email || ""}
                  onChange={(e) => setNewReqEmail(e.target.value)}
                />
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={() =>
                    updateMarketplaceOrder(false, false, false, false, true)
                  }
                >
                  Update Email
                </Button>
              </Stack>
              {order.notes.device && (
                <Typography sx={{ pb: 2 }}>
                  Device Notes: {order.notes.device}
                </Typography>
              )}
              {order.notes.recipient && (
                <Typography sx={{ pb: 2 }}>
                  More Notes: {order.notes.recipient}
                </Typography>
              )}
              {!order.client && (
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  sx={{ display: "flex", mb: 2 }}
                >
                  <Grid item xs={8}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="client-select-label">Client</InputLabel>
                      <Select
                        labelId="client-select-label"
                        label="Client"
                        value={changeClient}
                        onChange={handleClientChange}
                      >
                        {clientsList.map((c) => (
                          <MenuItem value={c}>{c}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      onClick={() => updateMarketplaceOrder(false, false, true)}
                    >
                      Update Client
                    </Button>
                  </Grid>
                </Grid>
              )}
              {order.client && entityMappings[order.client] && (
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  sx={{ display: "flex", mb: 2 }}
                >
                  <Grid item xs={8}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="entity-select-label">Entity</InputLabel>
                      <Select
                        labelId="entity-select-label"
                        label="Entity"
                        value={selectEntity}
                        onChange={handleEntityChange}
                      >
                        {entityMappings[order.client].map((c: string) => (
                          <MenuItem value={c}>{c}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        updateMarketplaceOrder(false, false, false, true)
                      }
                    >
                      Update Entity
                    </Button>
                  </Grid>
                </Grid>
              )}
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                spacing={2}
                sx={{ display: "flex" }}
              >
                <Grid item xs={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      label="Status"
                      value={status}
                      defaultValue={order.status}
                      onChange={handleChange}
                    >
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    onClick={() => updateMarketplaceOrder(true, false, false)}
                  >
                    Update Status
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel htmlFor="outlined-adornment-amount">
                      Price
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                      label="Price"
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                      defaultValue={order.quote_price}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    onClick={() => updateMarketplaceOrder(false, true, false)}
                    disabled={order.approved === true}
                  >
                    Update Price
                  </Button>
                </Grid>
              </Grid>
              <Grid container sx={{ paddingTop: "20px" }} spacing={2}>
                <Grid item xs={8}>
                  <TextField
                    size="small"
                    fullWidth
                    label="File Path"
                    type="file"
                    name="file"
                    inputProps={{ accept: "application/pdf" }}
                    onChange={(e) => {
                      setFile(
                        (
                          (e.target as HTMLInputElement).files as FileList
                        )[0] as File
                      );
                    }}
                    disabled={order.quote !== undefined && replace}
                  />
                </Grid>
                <Grid item xs={2}>
                  {order.quote && replace ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setReplace(false);
                      }}
                    >
                      Replace Quote
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={uploadFileOnOrder}>
                      Upload Quote
                    </Button>
                  )}
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    onClick={download}
                    disabled={order.quote === undefined}
                  >
                    View Quote
                  </Button>
                </Grid>
              </Grid>
              <Stack direction="row" sx={{ mt: "20px" }} spacing={2}>
                {(order.quote || order.quote_price) && (
                  <Button variant="contained" onClick={sendApprovalEmail}>
                    {order.email_sent
                      ? "Send Approval Email Again"
                      : "Send Approval Email"}
                  </Button>
                )}
                {order.approved !== undefined && !order.approved && (
                  <Button
                    variant="contained"
                    disabled={
                      order.approved === undefined || order.approved === null
                    }
                    onClick={() =>
                      updateMarketplaceOrder(
                        false,
                        false,
                        false,
                        false,
                        false,
                        true
                      )
                    }
                  >
                    Reopen Approval
                  </Button>
                )}
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const MarketplaceOrders = (props: MOProps) => {
  const { handleClose } = props;

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
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

  return (
    <Box>
      <Grid container direction="row">
        <Grid item xs={11} sx={{ paddingLeft: "15px" }}>
          <Typography>
            <h3>Marketplace Orders</h3>
          </Typography>
        </Grid>
        <Grid item xs={1} sx={{ paddingTop: "10px", paddingLeft: "20px" }}>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
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
