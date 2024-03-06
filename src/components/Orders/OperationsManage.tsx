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
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
  Stack,
  Alert,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import SendIcon from "@mui/icons-material/Send";

import { setOrders } from "../../app/slices/ordersSlice";
import { setInventory } from "../../app/slices/inventorySlice";
import {
  standardGet,
  standardPost,
  standardPut,
} from "../../services/standard";
import { RootState } from "../../app/store";
import { Order } from "../../interfaces/orders";

import { button_style } from "../../utilities/styles";
import LinearLoading from "../common/LinearLoading";

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

  const inventory_ids = useSelector(
    (state: RootState) => state.inventory.device_ids
  );

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [updateShippingStatus, setShippingStatus] = useState(shipping_status);
  const [loading, setLoading] = useState(false);
  const [laptopIndex, setLaptopIndex] = useState(-1);

  const [selected_inv, setSelectedInv] = useState("");
  const [in_inv, setInInv] = useState(false);

  const [changed_items, setItems] = useState(items);

  const [inv_update, setInvUpdate] = useState(-1);

  const [aftership_status, setAftershipStatus] = useState(1);

  useEffect(() => {
    const laptopFilter = items.findIndex(
      (item) =>
        item.type === "laptop" ||
        item.name.toLowerCase().includes("mac mini") ||
        item.name.toLowerCase().includes("iphone") ||
        item.name.toLowerCase().includes("pixel")
    );
    if (laptopFilter > -1) {
      setLaptopIndex(laptopFilter);
      if (inventory_ids.length < 1) {
        getInventory().catch();
      } else if (items[laptopFilter].serial_number) {
        const sn_index = inventory_ids.findIndex(
          (inv) =>
            inv.serial_numbers.findIndex(
              (s) => s === items[laptopFilter].serial_number
            ) > -1
        );

        if (sn_index > -1) {
          setSelectedInv(inventory_ids[sn_index].id);
          setInInv(true);
        }
      }
    }
  }, [items]);

  useEffect(() => {
    setItems(items);
  }, [items]);

  useEffect(() => {
    getInventory().catch();
  }, [selectedClient]);

  useEffect(() => {
    if (laptopIndex > -1 && items[laptopIndex].serial_number) {
      const sn_index = inventory_ids.findIndex(
        (inv) =>
          inv.serial_numbers.findIndex(
            (s) => s === items[laptopIndex].serial_number
          ) > -1
      );

      if (sn_index > -1) {
        setSelectedInv(inventory_ids[sn_index].id);
        setInInv(true);
      }
    }
  }, [inventory_ids]);

  const handleClose = () => {
    setOpen(false);
    setEdit(false);
  };

  const { getAccessTokenSilently } = useAuth0();

  const getInventory = async () => {
    const accessToken = await getAccessTokenSilently();

    const inventory_resp = await standardGet(
      accessToken,
      "inventory/" + selectedClient
    );

    if (inventory_resp.data.length > 0) {
      dispatch(setInventory(inventory_resp.data));
    }
  };

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
          "orders/" +
          (props.client === "Public" || props.client === "Mock"
            ? "public"
            : props.client);
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
        "orders/" + (props.client === "Public" || props.client === "Mock")
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

  const handleInvChange = (event: SelectChangeEvent) => {
    setSelectedInv(event.target.value);
  };

  const addToInventory = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const body = {
      client: selectedClient,
      device_id: selected_inv,
      new_devices: [
        {
          sn: changed_items[laptopIndex].serial_number,
          first_name: firstName,
          last_name: lastName,
          full_name: firstName + " " + lastName,
          condition: "New",
          status: "Shipping",
          price: changed_items[laptopIndex].price,
          user_history: [firstName + " " + lastName],
          purchase_date: props.date,
        },
      ],
    };

    const post_resp = await standardPut(accessToken, "inventory", body);

    if (post_resp.status === "Successful") {
      setInvUpdate(0);
      let route =
        "orders/" + (props.client === "Public" || props.client === "Mock")
          ? "public"
          : props.client;
      const ordersResult = await standardGet(accessToken, route);
      dispatch(setOrders(ordersResult.data));
    } else {
      setInvUpdate(1);
    }
    setLoading(false);
  };

  const createAftershipTracking = async (
    item_name: string,
    tracking_number: string
  ) => {
    setLoading(true);
    const access_token = await getAccessTokenSilently();

    const body = {
      order_no: props.orderNo,
      item_name,
      customer_name: props.full_name,
      tracking_number,
      recipient_email: props.email,
      client: props.client,
    };

    const post_resp = await standardPost(
      access_token,
      "orders/createshipment",
      body
    );

    if (post_resp.status === "Successful") {
      setAftershipStatus(0);
    } else {
      setAftershipStatus(-1);
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        variant="contained"
        sx={button_style}
        onClick={() => setOpen(true)}
        fullWidth
        size="small"
      >
        Manage
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography component="h4" textAlign="center">
              Manage Order
            </Typography>
            {loading && <LinearLoading />}
            {aftership_status === 0 && (
              <Alert severity="success">
                Aftership email successfully created!
              </Alert>
            )}
            {aftership_status === -1 && (
              <Alert severity="error">Error in creating aftership email.</Alert>
            )}
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
                        Spoke Fee
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
                    <TableCell>
                      <Typography fontWeight="bold" align="right">
                        Action
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => {
                    return (
                      <TableRow hover>
                        <TableCell>
                          {edit ? (
                            <TextField
                              size="small"
                              defaultValue={item.name}
                              onChange={(event) => {
                                setItems((prevState) => {
                                  let newItems = JSON.parse(
                                    JSON.stringify(prevState)
                                  );
                                  newItems[index].name = event.target.value;

                                  return newItems;
                                });
                              }}
                            />
                          ) : (
                            <Typography>{item.name}</Typography>
                          )}
                        </TableCell>
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
                              defaultValue={item.spoke_fee}
                              onChange={(event) => {
                                setItems((prevState) => {
                                  let newItems = JSON.parse(
                                    JSON.stringify(prevState)
                                  );
                                  newItems[index].spoke_fee = parseFloat(
                                    event.target.value.replace(",", "")
                                  );

                                  return newItems;
                                });
                              }}
                            />
                          ) : (
                            <Typography>
                              $
                              {item.spoke_fee
                                ? item.spoke_fee.toString().indexOf(".") > -1
                                  ? item.spoke_fee
                                  : item.spoke_fee + ".00"
                                : ""}
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
                        <TableCell align="right">
                          <Button
                            onClick={async () =>
                              await createAftershipTracking(
                                item.name,
                                item.tracking_number[0]
                              )
                            }
                            disabled={item.tracking_number === ""}
                          >
                            <Tooltip title="Create Aftership Tracking">
                              <SendIcon />
                            </Tooltip>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {laptopIndex !== -1 && (
              <>
                <Divider textAlign="left">Device Info</Divider>
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
                <Stack direction="row" spacing={2}>
                  <FormControl
                    fullWidth
                    size="small"
                    disabled={!edit || in_inv}
                  >
                    <InputLabel>Add to Inventory</InputLabel>
                    <Select
                      labelId="add-select-label"
                      id="add-simple-select"
                      value={selected_inv}
                      label="Add to Inventory"
                      onChange={(e) => handleInvChange(e)}
                    >
                      {inventory_ids.length > 0 &&
                        inventory_ids.map((inv) => (
                          <MenuItem value={inv.id}>
                            {inv.name}, {inv.location}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    disabled={in_inv}
                    onClick={addToInventory}
                    sx={button_style}
                  >
                    Add
                  </Button>
                </Stack>
              </>
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
            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setEdit(true)}
                disabled={edit || loading}
                sx={button_style}
              >
                Edit
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={saveTrackingNumbers}
                disabled={!edit || loading}
                sx={button_style}
              >
                Save
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={completeOrder}
                disabled={loading}
                sx={button_style}
              >
                Update Status
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default OperationsManage;
