import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  SelectChangeEvent,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Collapse,
  Box,
  Stack,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import LinearLoading from "../../common/LinearLoading";
import { clientsList } from "../../../utilities/mappings";
import { entityMappings } from "../../../app/utility/constants";

import { standardPost, standardDelete } from "../../../services/standard";
import { uploadFile, downloadFile } from "../../../services/azureblob";

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
    region?: string;
  };
  refresh: Function;
}

const MarketRow = (props: RowProps) => {
  const { order } = props;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState(order.quote_price);
  const [changeClient, setClient] = useState(order.client || "");
  const [selectEntity, setEntity] = useState("");
  const [replace, setReplace] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newReqEmail, setNewReqEmail] = useState(order.requestor_email);

  useEffect(() => {
    if (changeClient !== order.client) {
      setClient(order.client);
    }
  }, [order.client]);

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

  const updateMarketplaceOrder = async (reapprove: boolean = false) => {
    setLoading(true);
    let bodyObj: any = {
      id: order.id,
    };

    if (
      (changeClient !== "" && changeClient !== order.client) ||
      !order.client
    ) {
      bodyObj.updateClient = changeClient;
    } else {
      bodyObj.client = order.client;
      if (status !== order.status) {
        bodyObj.status = status;
      }
      if (
        (order.quote_price && price !== order.quote_price) ||
        !order.quote_price
      ) {
        bodyObj.price = price;
      }
      if (!order.entity || order.entity !== selectEntity) {
        bodyObj.entity = selectEntity;
      }
      if (!order.requestor_email || order.requestor_email !== newReqEmail) {
        bodyObj.requestor_email = newReqEmail;
      }
    }
    if (reapprove) {
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
    setLoading(false);
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

  const delete_approval = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const deleteResp = await standardDelete(
      accessToken,
      "marketplaceorders/" + order.client + "/" + order.id
    );

    if (deleteResp.status === "Successful") {
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
        <TableCell>
          <Typography>{order.region}</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit sx={{ pt: 2 }}>
            <Box sx={{ margin: 1 }}>
              {loading && <LinearLoading />}
              {order.notes.device && (
                <Typography sx={{ py: 2 }}>
                  Device Notes: {order.notes.device}
                </Typography>
              )}
              {order.notes.recipient && (
                <Typography sx={{ pb: 2 }}>
                  More Notes: {order.notes.recipient}
                </Typography>
              )}
              <Stack direction="column" spacing={2}>
                <Typography fontWeight="bold">Order Details:</Typography>
                <TextField
                  label="Requested By"
                  fullWidth
                  size="small"
                  defaultValue={order.requestor_email || ""}
                  onChange={(e) => setNewReqEmail(e.target.value)}
                />
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
                {order.client && entityMappings[order.client] && (
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
                )}
                <Button
                  variant="contained"
                  onClick={() => updateMarketplaceOrder()}
                  disabled={
                    order.status === status &&
                    order.quote_price === price &&
                    order.requestor_email === newReqEmail &&
                    order.client === changeClient
                  }
                >
                  Update Changes
                </Button>
              </Stack>
              <Typography pt={2} fontWeight="bold">
                Order Quote:
              </Typography>
              <Stack direction="row" spacing={2} pt={1}>
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
                {order.quote && replace ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setReplace(false);
                    }}
                  >
                    Replace
                  </Button>
                ) : (
                  <Button variant="contained" onClick={uploadFileOnOrder}>
                    Upload
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={download}
                  disabled={order.quote === undefined}
                >
                  View
                </Button>
              </Stack>
              <Typography fontWeight="bold" pt={2}>
                Other Actions:
              </Typography>
              <Stack direction="row" spacing={2} py={2} justifyContent="center">
                <Button
                  variant="contained"
                  onClick={delete_approval}
                  color="error"
                >
                  Delete Approval
                </Button>
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
                    onClick={() => updateMarketplaceOrder(true)}
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

export default MarketRow;
