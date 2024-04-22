import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Stack,
  Typography,
  Button,
  Divider,
  Select,
  InputLabel,
  SelectChangeEvent,
  MenuItem,
  FormControl,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import RecipientForm from "../common/RecipientForm";

import { RootState } from "../../app/store";
import { textfield_style, button_style } from "../../utilities/styles";
import { standardPost } from "../../services/standard";
import { resetInfo } from "../../app/slices/recipientSlice";
import LinearLoading from "../common/LinearLoading";
import { ScrapedStockInfo } from "../../interfaces/marketplace";

interface RecipientFormPageProps {
  setPage: Function;
  addons: string[];
  device_name: string;
  device_specs: string;
  device_location: string;
  device_url: string;
  supplier?: string;
  ret_device_name: string;
  ret_sn: string;
  ret_note: string;
  ret_condition: string;
  ret_activation: string;
  color: string;
  scraped_info: ScrapedStockInfo | null;
  accessories_only: boolean;
}

const RecipientFormPage = (props: RecipientFormPageProps) => {
  const {
    setPage,
    device_name,
    device_specs,
    device_location,
    device_url,
    addons,
    scraped_info,
    accessories_only,
  } = props;

  const dispatch = useDispatch();

  const { user, getAccessTokenSilently } = useAuth0();

  const [deployment_type, setDeploymentType] = useState("");

  //buy and hold states
  const [quantity, setQuantity] = useState(0);

  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [request_status, setRequestStatus] = useState(-1);

  // redux states
  const client_data = useSelector((state: RootState) => state.client.data);
  const selected_client = useSelector(
    (state: RootState) => state.client.selectedClient
  );
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

  const handleDeploymentChange = (event: SelectChangeEvent) => {
    setDeploymentType(event.target.value);
  };

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const sendMarketplaceRequest = async () => {
    setLoading(true);
    const access_token = await getAccessTokenSilently();
    let postBody: any = {
      requestor_email: user?.email,
      client: client_data === "spokeops" ? selected_client : client_data,
      notes: {},
    };

    if (!accessories_only) {
      postBody = {
        ...postBody,
        region: device_location,
        device_type: device_name,
        specs: device_specs,
        color: props.color,
        ref_url: device_url,
      };
    }

    if (scraped_info !== null) {
      postBody.ai_specs = scraped_info.scraped_specs;
      postBody.ref_url = scraped_info.device_url;
    }

    if (props.supplier !== "") {
      postBody.supplier = props.supplier;
    }

    if (deployment_type === "Buy and Hold") {
      postBody.order_type = "Hold in Inventory";
      postBody.quantity = quantity;
      postBody.notes.device = notes;
    } else {
      let adl = adl1_redux;

      if (adl2_redux !== "") {
        adl = adl + ", " + adl2_redux;
      }
      postBody.recipient_name = fn_redux + " " + ln_redux;
      postBody.first_name = fn_redux;
      postBody.last_name = ln_redux;
      postBody.address_obj = {
        al1: adl1_redux,
        al2: adl2_redux,
        city: city_redux,
        state: state_redux,
        postal_code: postal_redux,
        country_code: country_redux,
      };
      postBody.order_type = "Deploy Right Away";
      postBody.address =
        adl +
        ", " +
        city_redux +
        ", " +
        state_redux +
        " " +
        postal_redux +
        ", " +
        country_redux;

      if (props.addons) {
        postBody.addons = props.addons;
        if (props.addons.includes("Include Return Box")) {
          postBody.return_device = true;
          postBody.return_info = {
            device_name: props.ret_device_name,
            serial_number: props.ret_sn,
            note: props.ret_note,
            condition: props.ret_condition,
            activation_key: props.ret_activation,
          };
        }
      }

      postBody.notes.recipient = notes;
      postBody.email = email_redux;
      postBody.phone_number = phone_redux;
      postBody.shipping_rate = shipping_redux;
    }
    const newPurchaseResp = await standardPost(
      access_token,
      "newPurchase",
      postBody
    );

    if (newPurchaseResp.status === "Successful") {
      setRequestStatus(0);
    } else {
      setRequestStatus(1);
    }

    setLoading(false);
  };

  const canSubmitForm = () => {
    if (
      !checked ||
      fn_redux === "" ||
      ln_redux === "" ||
      email_redux === "" ||
      phone_redux === "" ||
      adl1_redux === "" ||
      city_redux === "" ||
      state_redux === "" ||
      postal_redux === "" ||
      country_redux === "" ||
      shipping_redux === "" ||
      loading ||
      request_status === 0
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (addons.length > 0) {
      setDeploymentType("Drop Ship");
    }
  }, [addons]);

  return (
    <Stack spacing={2}>
      {request_status !== -1 && (
        <Alert severity={request_status === 0 ? "success" : "error"}>
          {request_status === 0
            ? "Your request has been submitted! Thank you for your order."
            : "There has been an error with your request. Please try again later."}
        </Alert>
      )}
      {loading && <LinearLoading />}
      <Divider textAlign="left">
        <Typography>Deployment Type</Typography>
      </Divider>
      <FormControl
        fullWidth
        sx={textfield_style}
        required
        size="small"
        disabled={addons && addons.length > 0}
      >
        <InputLabel id="deployment-select-label">Deployment Type</InputLabel>
        <Select
          labelId="deployment-select-label"
          id="deployment-select"
          label="Deployment Type"
          onChange={handleDeploymentChange}
          value={deployment_type}
          required
        >
          <MenuItem value="Drop Ship">Drop Ship</MenuItem>
          <MenuItem value="Buy and Hold">Buy and Hold</MenuItem>
        </Select>
      </FormControl>
      {deployment_type === "Buy and Hold" && (
        <>
          <Divider textAlign="left" sx={{ fontWeight: "bold" }}>
            Buy and Hold Details
          </Divider>
          <TextField
            label="Quantity"
            size="small"
            sx={textfield_style}
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            required
            type="number"
            id="bh-quantity"
          />
        </>
      )}
      {deployment_type === "Drop Ship" && (
        <RecipientForm address_required deployable_region={device_location} />
      )}
      {deployment_type !== "" && (
        <TextField
          label="Notes"
          size="small"
          sx={textfield_style}
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          id="bh-notes"
        />
      )}
      <Divider />
      <FormControlLabel
        control={
          <Checkbox
            id="marketplace-modal-checkbox"
            onChange={handleChecked}
            checked={checked}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label={
          <Typography>
            By checking this box, I agree to have Spoke generate a quote on my
            behalf. *
          </Typography>
        }
      />
      <Stack direction="row" justifyContent="space-between">
        <Button
          onClick={() => {
            if (request_status !== -1) {
              dispatch(resetInfo());
              setPage(0);
            } else if (addons && addons.length > 0) {
              setPage(2);
            } else {
              setPage(1);
            }
          }}
        >
          Back
        </Button>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            sx={{ ...button_style, px: 10 }}
            disabled={canSubmitForm()}
            onClick={sendMarketplaceRequest}
          >
            Request Quote
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default RecipientFormPage;
