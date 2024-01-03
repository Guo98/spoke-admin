import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import LinearLoading from "../../common/LinearLoading";

import { standardPost, standardGet } from "../../../services/standard";
import { setInventory } from "../../../app/slices/inventorySlice";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "85%", md: "50%" },
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

interface ConfirmationProps {
  first_name: string;
  last_name: string;
  device_name: string;
  serial_number: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  email: string;
  phone_number: string;
  note: string;
  shipping: string;
  image_source: string | undefined;
  returning: boolean;
  client: string;
  id: string | undefined;
  warehouse: string | undefined;
  device_location: string;
  ret_device_name?: string;
  ret_sn?: string;
  ret_condition?: string;
  ret_activation?: string;
  ret_note?: string;
  addons: string[];
}

const ConfirmationBox = (props: ConfirmationProps) => {
  const { client } = props;

  const { getAccessTokenSilently, user } = useAuth0();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(-1);

  useEffect(() => {}, [props.device_name]);

  const deploy = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    let deployObj: any = {
      client: client,
      first_name: props.first_name,
      last_name: props.last_name,
      address: {
        al1: props.address_line1,
        al2: props.address_line2,
        city: props.city,
        state: props.state,
        postal_code: props.zipCode,
        country_code: props.country,
      },
      email: props.email,
      phone_number: props.phone_number,
      device_name: props.device_name,
      serial_number: props.serial_number,
      device_location: props.device_location,
      shipping: props.shipping,
      requestor_email: user?.email,
      requestor_name: user?.name,
      id: props.id,
      warehouse: props.warehouse,
      return_device: props.returning,
    };

    if (props.returning) {
      deployObj.return_device = true;
      deployObj.return_info = {
        device_name: props.ret_device_name,
        serial_number: props.ret_sn,
        note: props.ret_note,
        condition: props.ret_condition,
        activation_key: props.ret_activation,
      };
    }

    if (props.addons.length > 0) {
      deployObj.addons = props.addons;
    }

    const deployResult = await standardPost(
      accessToken,
      "deployLaptop",
      deployObj
    );

    if (deployResult.status === "Success") {
      setSuccess(0);
      const inventoryResult = await standardGet(
        accessToken,
        `inventory/${client}`
      );
      dispatch(setInventory(inventoryResult.data));
    } else {
      setSuccess(1);
    }
    setLoading(false);
  };

  return (
    <Stack spacing={2} pt={2}>
      {loading && <LinearLoading />}
      {success !== -1 && (
        <Alert severity={success === 0 ? "success" : "error"}>
          {success === 0
            ? "Thank you for your order! You'll receive a confirmation email with your order details."
            : "There was an error submitting your order. Please try again later."}
        </Alert>
      )}
      <Divider textAlign="left">Device Info</Divider>
      {props.device_name && (
        <div>
          <Typography display="inline" component="span" fontWeight="bold">
            Device:{" "}
          </Typography>
          <Typography display="inline" component="span">
            {props.device_name}
          </Typography>
        </div>
      )}
      {props.serial_number && (
        <div>
          <Typography display="inline" component="span" fontWeight="bold">
            Serial Number:{" "}
          </Typography>
          <Typography display="inline" component="span">
            {props.serial_number}
          </Typography>
        </div>
      )}
      <Divider textAlign="left">Recipient Info</Divider>
      {props.first_name && (
        <div>
          <Typography display="inline" component="span" fontWeight="bold">
            Name:{" "}
          </Typography>
          <Typography display="inline" component="span">
            {props.first_name} {props.last_name}
          </Typography>
        </div>
      )}
      {props.address_line1 && (
        <div>
          <Typography display="inline" component="span" fontWeight="bold">
            Shipping Address:{" "}
          </Typography>
          <Typography display="inline" component="span">
            {props.address_line1},{" "}
            {props.address_line2 ? props.address_line2 + ", " : ""}
            {props.city}, {props.state} {props.zipCode}, {props.country}
          </Typography>
        </div>
      )}
      {props.email && (
        <div>
          <Typography display="inline" component="span" fontWeight="bold">
            Email:{" "}
          </Typography>
          <Typography display="inline" component="span">
            {props.email}
          </Typography>
        </div>
      )}
      {props.phone_number && (
        <div>
          <Typography display="inline" component="span" fontWeight="bold">
            Phone Number:{" "}
          </Typography>
          <Typography display="inline" component="span">
            {props.phone_number}
          </Typography>
        </div>
      )}
      {props.returning && (
        <>
          <Divider textAlign="left">Return Info:</Divider>
          <div>
            <Typography display="inline" component="span" fontWeight="bold">
              Returning Device:{" "}
            </Typography>
            <Typography display="inline" component="span">
              {props.ret_device_name}
            </Typography>
          </div>
          <div>
            <Typography display="inline" component="span" fontWeight="bold">
              Return Serial Number:{" "}
            </Typography>
            <Typography display="inline" component="span">
              {props.ret_sn}
            </Typography>
          </div>
          <div>
            <Typography display="inline" component="span" fontWeight="bold">
              Condition:{" "}
            </Typography>
            <Typography display="inline" component="span">
              {props.ret_condition}
            </Typography>
          </div>
          <div>
            <Typography display="inline" component="span" fontWeight="bold">
              Activation Key:{" "}
            </Typography>
            <Typography display="inline" component="span">
              {props.ret_activation}
            </Typography>
          </div>
        </>
      )}
      <Button
        variant="contained"
        sx={{ backgroundColor: "#054ffe", borderRadius: "10px" }}
        onClick={deploy}
        disabled={success !== -1}
      >
        Deploy
      </Button>
    </Stack>
  );
};

export default ConfirmationBox;
