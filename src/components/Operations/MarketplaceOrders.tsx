import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  LinearProgress,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Collapse,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllMarketplace, postOrder } from "../../services/ordersAPI";
import { uploadFile } from "../../services/azureblob";

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
  };
}

const MarketRow = (props: RowProps) => {
  const { order } = props;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const { getAccessTokenSilently } = useAuth0();

  const updateStatus = async () => {
    const accessToken = await getAccessTokenSilently();

    if (status !== order.status) {
      const bodyObj = {
        client: order.client,
        id: order.id,
        status,
      };
      const updateRes = await postOrder(
        "updateMarketOrder",
        accessToken,
        bodyObj
      );
    }
  };

  const uploadFile3 = () => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(file);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file!);
    });
    // return Buffer.from(file, "base64");
  };

  const uploadFile2 = async () => {
    const accessToken = await getAccessTokenSilently();
    let formData = new FormData();
    formData.append("file", file!);

    const fileResp = await uploadFile(accessToken, formData);
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
          <Typography>{order.notes.device}</Typography>
        </TableCell>
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
                <Grid item xs={8}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      labelId="status-select-label"
                      label="Status"
                      value={status}
                      defaultValue={order.status}
                      onChange={handleChange}
                    >
                      <MenuItem value="Received">Received</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Button variant="contained" onClick={updateStatus}>
                    Update Status
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
                  />
                </Grid>
                <Grid item xs={4}>
                  <Button variant="contained" onClick={uploadFile2}>
                    Upload Quote
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

const MarketplaceOrders = (props: MOProps) => {
  const { handleClose } = props;

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const getOrders = async () => {
    const accessToken = await getAccessTokenSilently();

    const ordersRes = await getAllMarketplace(accessToken);

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
      {loading && <LinearProgress />}
      {!loading && orders.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Client</Typography>
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
                  <Typography fontWeight="bold">Notes</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <MarketRow order={order} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MarketplaceOrders;
