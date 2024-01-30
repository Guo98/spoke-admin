import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

import { standardPost } from "../../services/standard";
import { cdw_parts_prices, customer_ids } from "../../utilities/cdw-mappings";
import { Order } from "../../interfaces/orders";
import LinearLoading from "../common/LinearLoading";
import { button_style } from "../../utilities/styles";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "85%", md: "50%" },
  bgcolor: "background.paper",
  borderRadius: "20px",
  p: 4,
};

const OrderLaptop = (props: Order) => {
  const { orderNo, items, firstName, lastName, address, client } = props;

  const [open, setOpen] = useState(false);
  const [laptop_name, setLaptopName] = useState("");
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(-1);

  const [updt_laptop, setUpdtLaptop] = useState("");
  const [updt_part_no, setUpdtPartNo] = useState("");
  const [updt_price, setUpdtPrice] = useState("");

  const [updt_fn, setUpdtFn] = useState(firstName || "");
  const [updt_ln, setUpdtLn] = useState(lastName || " ");
  const [updt_addr_line, setUpdtAL] = useState(address?.addressLine || "");
  const [updt_city, setUpdtCity] = useState(address?.city || "");
  const [updt_state, setUpdtState] = useState(address?.subdivision || "");
  const [updt_postal, setUpdtPostal] = useState(address?.postalCode || "");
  const [updt_country, setUpdtCountry] = useState(address?.country || "");

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (items.length > 0) {
      items.forEach((i) => {
        if (i.type === "laptop") {
          setLaptopName(i.name);
        }
      });
    }
  }, [items]);

  useEffect(() => {
    setUpdtLaptop(laptop_name);

    if (cdw_parts_prices[client] && cdw_parts_prices[client][laptop_name]) {
      setUpdtPartNo(cdw_parts_prices[client][laptop_name].cdw_part_no);
      setUpdtPrice(cdw_parts_prices[client][laptop_name].price);
    }
  }, [laptop_name]);

  const handleClose = () => {
    setOpen(false);
    setStatus(-1);
    setLoading(false);
  };

  const order_laptop = async () => {
    setLoading(true);
    setEdit(false);
    const accessToken = await getAccessTokenSilently();

    const body = {
      order_number: orderNo.toString(),
      cdw_part_number: updt_part_no,
      unit_price: updt_price,
      customer_id: customer_ids[client],
      first_name: updt_fn,
      last_name: updt_ln,
      customer_addr: {
        addressLine: updt_addr_line,
        city: updt_city,
        subdivision: updt_state,
        postalCode: updt_postal,
      },
      order_client: client,
      id: props.id,
      full_name_key: props.full_name,
    };

    const post_resp = await standardPost(accessToken, "placeorder/cdw", body);

    if (post_resp.status === "Successful") {
      setStatus(0);
    } else {
      setStatus(1);
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        sx={button_style}
        onClick={() => setOpen(true)}
      >
        Order Laptop
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography>Order #{orderNo}</Typography>
            {status !== -1 && (
              <Alert severity={status === 0 ? "success" : "error"}>
                {status === 0
                  ? "Order successfully placed with CDW"
                  : "Error in placing order with CDW"}
              </Alert>
            )}
            {loading && <LinearLoading />}
            <Divider textAlign="left">Device Info</Divider>
            <TextField
              label="Device"
              size="small"
              disabled={!edit}
              value={updt_laptop}
              onChange={(e) => setUpdtLaptop(e.target.value)}
            />
            <Stack direction="row" spacing={1}>
              <TextField
                label="CDW Part Number"
                size="small"
                disabled={!edit}
                value={updt_part_no}
                onChange={(e) => setUpdtPartNo(e.target.value)}
                fullWidth
              />
              <TextField
                label="CDW Price"
                size="small"
                disabled={!edit}
                value={updt_price}
                onChange={(e) => setUpdtPrice(e.target.value)}
                fullWidth
              />
            </Stack>
            <Divider textAlign="left">Customer Info</Divider>
            <Stack direction="row" spacing={1}>
              <TextField
                label="First Name"
                value={updt_fn}
                onChange={(e) => setUpdtFn(e.target.value)}
                fullWidth
                size="small"
                disabled={!edit}
              />
              <TextField
                label="Last Name"
                value={updt_ln}
                onChange={(e) => setUpdtLn(e.target.value)}
                fullWidth
                size="small"
                disabled={!edit}
              />
            </Stack>
            <TextField
              label="Street Address"
              value={updt_addr_line}
              onChange={(e) => setUpdtAL(e.target.value)}
              fullWidth
              size="small"
              disabled={!edit}
            />
            <Stack direction="row" spacing={1}>
              <TextField
                label="City"
                value={updt_city}
                onChange={(e) => setUpdtCity(e.target.value)}
                fullWidth
                size="small"
                disabled={!edit}
              />
              <TextField
                label="State"
                value={updt_state}
                onChange={(e) => setUpdtState(e.target.value)}
                fullWidth
                size="small"
                disabled={!edit}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField
                label="Postal Code"
                value={updt_postal}
                onChange={(e) => setUpdtPostal(e.target.value)}
                fullWidth
                size="small"
                disabled={!edit}
              />
              <TextField
                label="Country"
                value={updt_country}
                onChange={(e) => setUpdtCountry(e.target.value)}
                fullWidth
                size="small"
                disabled={!edit}
              />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                sx={{ borderRadius: "10px" }}
                onClick={() => setEdit(true)}
                size="small"
                fullWidth
              >
                Edit
              </Button>
              <Button
                variant="contained"
                sx={{ borderRadius: "10px" }}
                size="small"
                fullWidth
                onClick={order_laptop}
              >
                Order From CDW
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default OrderLaptop;
