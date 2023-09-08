import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import { setOrders } from "../../app/slices/ordersSlice";
import { standardGet, standardPost } from "../../services/standard";
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
  width: "75%",
};

interface OperationsOrder extends Order {}

const OperationsManage = (props: OperationsOrder) => {
  const { items, shipping_status, firstName, lastName } = props;
  const dispatch = useDispatch();

  const selectedClient = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [updateShippingStatus, setShippingStatus] = useState(shipping_status);
  const [loading, setLoading] = useState(false);
  const [laptopIndex, setLaptopIndex] = useState(-1);

  const [changed_items, setItems] = useState(items);

  useEffect(() => {
    const laptopFilter = items.findIndex(
      (item) =>
        item.type === "laptop" || item.name.toLowerCase().includes("mac mini")
    );
    if (laptopFilter > -1) {
      setLaptopIndex(laptopFilter);
    }
  }, [items]);

  useEffect(() => {}, [changed_items]);

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
  };

  const { getAccessTokenSilently } = useAuth0();

  const saveTrackingNumbers = async () => {
    setLoading(true);
    if (JSON.stringify(changed_items) !== JSON.stringify(items)) {
      const accessToken = await getAccessTokenSilently();
      const bodyObj = {
        client: selectedClient,
        full_name: firstName + " " + lastName,
        items: changed_items,
        order_id: props.id,
        status: shipping_status,
      };

      const postOrderResp = await standardPost(
        accessToken,
        "updateTrackingNumber",
        bodyObj
      );

      if (postOrderResp.status === "Success") {
        let route =
          "orders/" + props.client === "Public" || props.client === "Mock"
            ? "public"
            : props.client;
        const ordersResult = await standardGet(accessToken, route);
        dispatch(setOrders(ordersResult.data));
      }
    }
    setLoading(false);
    setEdit(false);
  };

  const completeOrder = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const bodyObj = { ...props };

    bodyObj.shipping_status = updateShippingStatus;

    const completeOrderResp = await standardPost(
      accessToken,
      "completeOrder",
      bodyObj
    );

    if (completeOrderResp.status === "Success") {
      let route =
        "orders/" + props.client === "Public" || props.client === "Mock"
          ? "public"
          : props.client;
      const ordersResult = await standardGet(accessToken, route);
      dispatch(setOrders(ordersResult.data));
    }
    setLoading(false);
  };

  const handleChange = (event: SelectChangeEvent, index: number) => {
    setItems((prevState) => {
      let newItems = JSON.parse(JSON.stringify(prevState));
      newItems[index].courier = event.target.value;

      return newItems;
    });
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setShippingStatus(event.target.value);
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          borderRadius: "999em 999em 999em 999em",
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
          <TableContainer
            component={Paper}
            sx={{ borderRadius: "10px", mt: 2 }}
          >
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
                  <TableCell>
                    <Typography fontWeight="bold" align="right">
                      Courier
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
                            onChange={(event) => {
                              setItems((prevState) => {
                                let newItems = JSON.parse(
                                  JSON.stringify(prevState)
                                );
                                newItems[index].price = event.target.value;

                                return newItems;
                              });
                            }}
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
                      <TableCell align="right">
                        {edit ? (
                          <TextField
                            size="small"
                            defaultValue={
                              item.tracking_number === ""
                                ? ""
                                : item.tracking_number[0]
                            }
                            onChange={(event) => {
                              setItems((prevState) => {
                                let newItems = JSON.parse(
                                  JSON.stringify(prevState)
                                );
                                newItems[index].tracking_number = [
                                  event.target.value,
                                ];

                                return newItems;
                              });
                            }}
                          />
                        ) : (
                          item.tracking_number
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {edit ? (
                          <>
                            <FormControl fullWidth size="small">
                              <Select
                                id="courier-simple-select"
                                value={changed_items[index].courier}
                                onChange={(e) => handleChange(e, index)}
                              >
                                <MenuItem value="UPS">UPS</MenuItem>
                                <MenuItem value="Fedex">Fedex</MenuItem>
                                <MenuItem value="USPS">USPS</MenuItem>
                                <MenuItem value="DHL">DHL</MenuItem>
                                <MenuItem value="Correios">Correios</MenuItem>
                              </Select>
                            </FormControl>
                          </>
                        ) : (
                          item.courier
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {laptopIndex !== -1 && (
            <TextField
              sx={{ mt: 2 }}
              label="Device Serial Number"
              fullWidth
              size="small"
              onChange={(e) => {
                setItems((prevState) => {
                  let newItems = JSON.parse(JSON.stringify(prevState));
                  newItems[laptopIndex].serial_number = e.target.value;

                  return newItems;
                });
              }}
              defaultValue={
                (changed_items[laptopIndex] &&
                  changed_items[laptopIndex].serial_number) ||
                ""
              }
              disabled={!edit}
            />
          )}
          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel>Shipping Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={shipping_status}
              value={updateShippingStatus}
              label="Shipping Status"
              onChange={(e) => handleStatusChange(e)}
            >
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Incomplete">Incomplete</MenuItem>
            </Select>
          </FormControl>
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
                disabled={edit || loading}
              >
                Edit
              </Button>
            </Grid>
            <Grid item md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={saveTrackingNumbers}
                disabled={!edit || loading}
              >
                Save
              </Button>
            </Grid>
            <Grid item md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={completeOrder}
                disabled={loading}
              >
                Update Status
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default OperationsManage;
