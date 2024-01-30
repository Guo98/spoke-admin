import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Stack,
  Button,
  Alert,
  IconButton,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import LinearLoading from "../../common/LinearLoading";
import RecipientForm from "../../common/RecipientForm";

import { standardPost, standardGet } from "../../../services/standard";
import { RootState } from "../../../app/store";
import { setInventory } from "../../../app/slices/inventorySlice";
import { button_style, textfield_style } from "../../../utilities/styles";

interface ConfirmationProps {
  device_name: string;
  serial_number: string;
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
  const { client, device_location } = props;

  const { getAccessTokenSilently, user } = useAuth0();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(-1);
  const [note, setNote] = useState("");

  const fn_redux = useSelector(
    (state: RootState) => state.recipient.first_name
  );
  const ln_redux = useSelector((state: RootState) => state.recipient.last_name);

  const adl1_redux = useSelector(
    (state: RootState) => state.recipient.address_line1
  );
  const adl2_redux = useSelector(
    (state: RootState) => state.recipient.address_line2
  );
  const city_redux = useSelector((state: RootState) => state.recipient.city);
  const state_redux = useSelector((state: RootState) => state.recipient.state);
  const postal_redux = useSelector(
    (state: RootState) => state.recipient.postal
  );
  const country_redux = useSelector(
    (state: RootState) => state.recipient.country
  );

  const email_redux = useSelector((state: RootState) => state.recipient.email);
  const phone_redux = useSelector((state: RootState) => state.recipient.phone);
  const shipping_redux = useSelector(
    (state: RootState) => state.recipient.shipping
  );

  useEffect(() => {}, [props.device_name]);

  const deploy = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    let deployObj: any = {
      client: client,
      first_name: fn_redux,
      last_name: ln_redux,
      address: {
        al1: adl1_redux,
        al2: adl2_redux,
        city: city_redux,
        state: state_redux,
        postal_code: postal_redux,
        country_code: country_redux,
      },
      email: email_redux,
      phone_number: phone_redux,
      device_name: props.device_name,
      serial_number: props.serial_number,
      device_location,
      shipping: shipping_redux,
      requestor_email: user?.email,
      requestor_name: user?.name,
      id: props.id,
      warehouse: props.warehouse,
      note,
      return_device: props.returning,
    };

    if (props.addons.length > 0) {
      deployObj.addons = props.addons;

      if (props.addons.includes("Include Return Box")) {
        deployObj.return_device = true;
        deployObj.return_info = {
          device_name: props.ret_device_name,
          serial_number: props.ret_sn,
          note: props.ret_note,
          condition: props.ret_condition,
          activation_key: props.ret_activation,
        };
      }
    }

    const deployResult = await standardPost(
      accessToken,
      "deployLaptop",
      deployObj
    );

    if (deployResult.status === "Success") {
      setSuccess(0);
      // // const inventoryResult = await standardGet(
      // //   accessToken,
      // //   `inventory/${client}`
      // // );
      // // dispatch(setInventory(inventoryResult.data));
    } else {
      setSuccess(1);
    }
    setLoading(false);
  };

  const fieldsFilled = () => {
    return (
      fn_redux === "" ||
      ln_redux === "" ||
      adl1_redux === "" ||
      city_redux === "" ||
      state_redux === "" ||
      postal_redux === "" ||
      email_redux === "" ||
      phone_redux === "" ||
      shipping_redux === ""
    );
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
      <Divider textAlign="left">Deployment Info</Divider>
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
      {props.addons.length > 0 && (
        <>
          <Typography fontWeight="bold">Accessories:</Typography>
          <ul>
            {props.addons.map((i) => (
              <li>
                <Typography>
                  {i.includes("yubikey")
                    ? i.replace("yubikey", "2 x Yubikey 5C NFC")
                    : i}
                </Typography>
              </li>
            ))}
          </ul>
        </>
      )}
      <RecipientForm address_required deployable_region={device_location} />
      <TextField
        sx={textfield_style}
        fullWidth
        size="small"
        label="Note"
        onChange={(e) => setNote(e.target.value)}
      />
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
        sx={button_style}
        onClick={deploy}
        disabled={success !== -1 || fieldsFilled()}
      >
        Deploy
      </Button>
    </Stack>
  );
};

export default ConfirmationBox;
