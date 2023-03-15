import React, { useState } from "react";
import {
  Modal,
  Button,
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Typography,
  Grid,
  TextField,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import { updateOrders } from "../../app/slices/ordersSlice";
import { postOrder, getAllOrders } from "../../services/ordersAPI";
import { RootState } from "../../app/store";
import { Order } from "../../interfaces/orders";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};

interface OperationsOrder extends Order {}

const OperationsManage = (props: OperationsOrder) => {
  const { items, shipping_status, firstName, lastName } = props;
  const dispatch = useDispatch();

  const selectedClient = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  let tempItems = JSON.parse(JSON.stringify(items));
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
  };

  const { getAccessTokenSilently } = useAuth0();

  const saveTrackingNumbers = async () => {
    if (JSON.stringify(tempItems) !== JSON.stringify(items)) {
      const accessToken = await getAccessTokenSilently();
      const bodyObj = {
        client: selectedClient,
        full_name: firstName + " " + lastName,
        items: tempItems,
        order_id: props.id,
        status: shipping_status,
      };
      const postOrderResp = await postOrder(
        "updateTrackingNumber",
        accessToken,
        bodyObj
      );

      if (postOrderResp.status === "Success") {
        const ordersResult = await getAllOrders(
          accessToken,
          props.client === "Public" || props.client === "Mock"
            ? "public"
            : props.client
        );
        dispatch(updateOrders(ordersResult.data));
      }
    }

    setEdit(false);
  };

  const completeOrder = async () => {
    const accessToken = await getAccessTokenSilently();
    const bodyObj = { ...props };
    if (
      bodyObj.shipping_status === "Completed" ||
      bodyObj.shipping_status === "Complete"
    ) {
      bodyObj.shipping_status = "Incomplete";
    } else {
      bodyObj.shipping_status = "Complete";
    }

    const completeOrderResp = await postOrder(
      "completeOrder",
      accessToken,
      bodyObj
    );

    if (completeOrderResp.status === "Success") {
      const ordersResult = await getAllOrders(
        accessToken,
        props.client === "Mock" || props.client === "Public"
          ? "public"
          : props.client
      );
      dispatch(updateOrders(ordersResult.data));
    }
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          borderRadius: "999em 999em 999em 999em",
          height: "32px",
          width: "116px",
          textTransform: "none",
        }}
        onClick={() => setOpen(true)}
      >
        Manage
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography component="h4" textAlign="center">
            Manage Order
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
            <Table aria-label="items table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight="bold">Item</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Quantity</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" align="right">
                      Price
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold" align="right">
                      Tracking #
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => {
                  return (
                    <TableRow hover>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity || 1}</TableCell>
                      <TableCell align="right">
                        {edit ? (
                          <TextField
                            size="small"
                            defaultValue={item.price}
                            onChange={(event) =>
                              (tempItems[index].price = event.target.value)
                            }
                          />
                        ) : (
                          <Typography>
                            $
                            {item.price.toString().indexOf(".") > -1
                              ? item.price
                              : item.price + ".00"}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {edit ? (
                          <TextField
                            size="small"
                            defaultValue={
                              item.tracking_number === ""
                                ? ""
                                : item.tracking_number[0]
                            }
                            onChange={(event) =>
                              (tempItems[index].tracking_number = [
                                event.target.value,
                              ])
                            }
                          />
                        ) : (
                          item.tracking_number
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid
            container
            spacing={2}
            alignItems="center"
            direction="row"
            justifyContent="space-evenly"
            sx={{ paddingTop: 2 }}
          >
            <Grid item md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setEdit(true)}
                disabled={edit}
              >
                Edit
              </Button>
            </Grid>
            <Grid item md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={saveTrackingNumbers}
                disabled={!edit}
              >
                Save
              </Button>
            </Grid>
            <Grid item md={4}>
              <Button fullWidth variant="contained" onClick={completeOrder}>
                {shipping_status === "Completed" ||
                shipping_status === "Complete"
                  ? "Mark Shipped"
                  : "Mark Complete"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default OperationsManage;
