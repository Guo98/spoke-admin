import React, { useEffect, useState } from "react";
import {
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// @ts-ignore
import isEmail from "validator/lib/isEmail";

import { textfield_style } from "../../utilities/styles";
import {
  setFirstName,
  setLastName,
  setAddressLine1,
  setAddressLine2,
  setCity,
  setShipping,
  setState,
  setPostal,
  setCountry,
  setEmail,
  setPhone,
} from "../../app/slices/recipientSlice";
import { RootState } from "../../app/store";

interface RFProps {
  address_required: boolean;
  deployable_region?: string;
}

const RecipientForm = (props: RFProps) => {
  const { address_required } = props;

  const [shipping_opts, setShippingOpts] = useState(["Standard", "Expedited"]);
  const [valid_email, setValidEmail] = useState(true);
  const [disable_country, setDisableCountry] = useState(false);

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

  const dispatch = useDispatch();

  useEffect(() => {
    if (props.deployable_region) {
      if (
        props.deployable_region === "United States" ||
        props.deployable_region.toLowerCase().includes("united states") ||
        props.deployable_region.toLowerCase().includes("usa") ||
        props.deployable_region.toLowerCase() === "us"
      ) {
        dispatch(setCountry("US"));
        setShippingOpts(["Standard", "2 Day", "Overnight"]);
        setDisableCountry(true);
      } else if (
        props.deployable_region === "United Kingdom" ||
        props.deployable_region.toLowerCase().includes("united kingdom") ||
        props.deployable_region.toLowerCase() === "uk"
      ) {
        dispatch(setCountry("UK"));
        setDisableCountry(true);
      }
    }
  }, [props.deployable_region]);

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(setShipping(event.target.value));
  };

  return (
    <Stack spacing={2}>
      <Divider textAlign="left">Recipient Details</Divider>
      <Stack direction="row" spacing={1}>
        <TextField
          sx={textfield_style}
          label="First Name"
          size="small"
          fullWidth
          required
          value={fn_redux}
          onChange={(e) => dispatch(setFirstName(e.target.value))}
        />
        <TextField
          sx={textfield_style}
          label="Last Name"
          size="small"
          fullWidth
          required
          value={ln_redux}
          onChange={(e) => dispatch(setLastName(e.target.value))}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <TextField
          sx={textfield_style}
          label="Email"
          size="small"
          fullWidth
          required
          value={email_redux}
          onChange={(e) => {
            dispatch(setEmail(e.target.value));
            if (!isEmail(e.target.value) && e.target.value !== "") {
              setValidEmail(false);
            } else {
              setValidEmail(true);
            }
          }}
          error={!valid_email}
          helperText={!valid_email ? "Invalid email" : ""}
        />
        <TextField
          sx={textfield_style}
          label="Phone Number"
          size="small"
          fullWidth
          required
          value={phone_redux}
          onChange={(e) => dispatch(setPhone(e.target.value))}
        />
      </Stack>
      <TextField
        sx={textfield_style}
        label="Address Line 1"
        size="small"
        required={address_required}
        value={adl1_redux}
        onChange={(e) => dispatch(setAddressLine1(e.target.value))}
      />
      <TextField
        sx={textfield_style}
        label="Address Line 2"
        size="small"
        value={adl2_redux}
        onChange={(e) => dispatch(setAddressLine2(e.target.value))}
      />
      <Stack direction="row" spacing={1}>
        <TextField
          sx={textfield_style}
          label="City"
          size="small"
          fullWidth
          required={address_required}
          value={city_redux}
          onChange={(e) => dispatch(setCity(e.target.value))}
        />
        <TextField
          sx={textfield_style}
          label="State/Province"
          size="small"
          fullWidth
          required={address_required}
          value={state_redux}
          onChange={(e) => dispatch(setState(e.target.value))}
        />
      </Stack>
      <Stack direction="row" spacing={1}>
        <TextField
          sx={textfield_style}
          label="Postal Code"
          size="small"
          fullWidth
          required={address_required}
          value={postal_redux}
          onChange={(e) => dispatch(setPostal(e.target.value))}
        />
        <TextField
          sx={textfield_style}
          label="Country"
          size="small"
          fullWidth
          required={address_required}
          value={country_redux}
          disabled={disable_country}
          onChange={(e) => dispatch(setCountry(e.target.value))}
        />
      </Stack>
      <FormControl fullWidth sx={textfield_style} required size="small">
        <InputLabel id="shipping-select-label">Shipping Rate</InputLabel>
        <Select
          labelId="shipping-select-label"
          id="shipping-select"
          label="Shipping Rate"
          onChange={handleChange}
          value={shipping_redux}
          required
        >
          {shipping_opts.map((s) => (
            <MenuItem value={s}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export default RecipientForm;
