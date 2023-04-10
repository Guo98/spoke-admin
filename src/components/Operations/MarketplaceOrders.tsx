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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth0 } from "@auth0/auth0-react";
import { getAllMarketplace } from "../../services/ordersAPI";

interface MOProps {
  handleClose: Function;
}

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
              {orders.map((order) => (
                <TableRow>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MarketplaceOrders;
