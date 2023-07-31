import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TableRow,
  TableCell,
  Collapse,
  Grid,
  IconButton,
  Button,
  Alert,
  Stack,
  Tooltip,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth0 } from "@auth0/auth0-react";
import { downloadFile } from "../../services/azureblob";
import { standardPost } from "../../services/standard";
import DenyModal from "./DenyModal";
import FormattedCell from "../common/FormattedCell";

interface QuoteProps {
  recipient_name: string;
  device_type: string;
  specs: string;
  date: string;
  status: string;
  quote?: string;
  quote_price?: string;
  client: string;
  id: string;
  address: string;
  approved?: boolean;
  setOrders: Function;
  order_type?: string;
  quantity?: number;
}

const QuoteRow = (props: QuoteProps) => {
  const {
    date,
    recipient_name,
    device_type,
    status,
    client,
    id,
    address,
    specs,
  } = props;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [denyOpen, setDenyOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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

    const postResp = await standardPost(
      accessToken,
      "updateMarketOrder",
      bodyObj
    );

    if (postResp.status && postResp.status !== "Successful") {
      setError(true);
    } else {
      await props.setOrders();
      if (!approved) {
        setDenyOpen(false);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          {(props.quote || props.quote_price) && (
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
        <FormattedCell
          text={recipient_name ? recipient_name : props.order_type!}
        />
        <FormattedCell
          text={
            (props.quantity && props.quantity > 1
              ? props.quantity + " x "
              : "") +
            device_type +
            (specs ? " " + specs : "")
          }
        />
        <TableCell>
          <Chip
            label={
              status === "Completed" || status === "In Progress"
                ? props.approved
                  ? "Approved"
                  : "Rejected"
                : status
            }
            color={
              status === "Completed" || status === "In Progress"
                ? props.approved
                  ? "success"
                  : "error"
                : "warning"
            }
          />
        </TableCell>
      </TableRow>
      {(props.quote || props.quote_price) && (
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
                      <Button
                        onClick={download}
                        variant="contained"
                        disabled={!props.quote}
                      >
                        <PictureAsPdfIcon sx={{ mr: 1 }} /> Quote
                      </Button>
                      {props.approved === undefined ||
                      props.approved === null ? (
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center normal"
                        >
                          <Tooltip title="Reject">
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
                          </Tooltip>
                          <Tooltip title="Approve">
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
                          </Tooltip>
                        </Stack>
                      ) : (
                        <Chip
                          label={
                            props.approved
                              ? "Request Approved"
                              : "Request Rejected"
                          }
                          color={props.approved ? "success" : "error"}
                        />
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
        loading={loading}
      />
    </>
  );
};

export default QuoteRow;
