import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Stack,
  Button,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";

import { resetInfo } from "../../app/slices/recipientSlice";
import { RootState } from "../../app/store";
import { standardPost } from "../../services/standard";
import LinearLoading from "../common/LinearLoading";
import { default as RF } from "../common/RecipientForm";

import { customer_ids } from "../../utilities/cdw-mappings";

interface RecipientProps {
  completeRecipientStep: Function;
  device_name: string;
  device_specs: string;
  device_url: string;
  client: string;
  setParentLoading: Function;
  region: string;
  image_source: string;
  price: string;
  stock_level: string;
  clear_deployment: boolean;
  setClear: Function;
  ai_specs: string;
  supplier?: string;
  request_type: string;
  cdw_part_no: string;
  addons?: string[];
  item_type: string;
  ret_device_name?: string;
  ret_sn?: string;
  ret_condition?: string;
  ret_note?: string;
  ret_activation?: string;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const RecipientForm = (props: RecipientProps) => {
  const {
    completeRecipientStep,
    device_name,
    device_specs,
    device_url,
    client,
    setParentLoading,
    region,
    image_source,
    price,
    stock_level,
    clear_deployment,
    setClear,
    ai_specs,
    request_type,
    cdw_part_no,
    item_type,
  } = props;

  const dispatch = useDispatch();

  const { user, getAccessTokenSilently } = useAuth0();

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

  const [deployment_type, setDeploymentType] = useState("Drop Ship");

  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(-1);
  const [checked, setChecked] = useState(false);

  const [cdw_status, setCDWStatus] = useState(-1);

  useEffect(() => {
    if (clear_deployment) {
      setDeploymentType("Drop Ship");

      setNotes("");
      setQuantity(1);
      dispatch(resetInfo());
      setClear(false);
    }
  }, [clear_deployment]);

  const handleDeploymentChange = (event: SelectChangeEvent) => {
    setDeploymentType(event.target.value);
  };

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const fieldsFilled = () => {
    if (
      (deployment_type === "Drop Ship" && request_type === "quote") ||
      request_type === "buy"
    ) {
      return (
        fn_redux === "" ||
        ln_redux === "" ||
        adl1_redux === "" ||
        city_redux === "" ||
        state_redux === "" ||
        postal_redux === "" ||
        email_redux === "" ||
        phone_redux === "" ||
        shipping_redux === "" ||
        !checked
      );
    } else {
      return !checked;
    }
  };

  const sendMarketplaceRequest = async () => {
    completeRecipientStep();
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    let postBody: any = {
      requestor_email: user?.email,
      client,
      device_type: device_name,
      specs: device_specs,
      color: "Default",
      ref_url: device_url,
      notes: {},
      region,
      ai_specs: ai_specs,
    };
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
      if (request_type === "buy") {
        postBody.order_type = "Buy Directly from CDW";
        postBody.address =
          adl +
          ", " +
          city_redux +
          ", " +
          state_redux +
          " " +
          postal_redux +
          ", US";
        postBody.approved = true;
        postBody.cdw_part_no = cdw_part_no;
        postBody.cdw_address = {
          addressLine: adl,
          city: city_redux,
          subdivision: state_redux,
          postalCode: postal_redux,
        };
        postBody.cdw_name = {
          first_name: fn_redux,
          last_name: ln_redux,
        };
        // postBody.customer_id = "15004983";
        postBody.customer_id = customer_ids[client];
        postBody.unit_price = price.replace("$", "").replace(",", "");
      } else {
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
      }

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
      accessToken,
      "newPurchase",
      postBody
    );

    if (newPurchaseResp.status === "Successful") {
      setStatus(0);
    } else {
      setStatus(1);
    }

    setLoading(false);
    setParentLoading(false);
  };

  return (
    <>
      {!loading && status === -1 && (
        <Stack spacing={2} pt={2.5}>
          <Divider textAlign="left" sx={{ fontWeight: "bold" }}>
            Order Details
          </Divider>
          {item_type !== "Accessories" && (
            <Stack direction="row" spacing={2}>
              {image_source && (
                <img
                  src={image_source}
                  alt="Laptop picture"
                  style={{ maxHeight: 200, maxWidth: 200 }}
                />
              )}
              <Stack justifyContent="center" spacing={1}>
                <Typography fontWeight="bold">{device_name}</Typography>
                <div>
                  <Typography
                    display="inline"
                    component="span"
                    fontWeight="bold"
                  >
                    Specs:{" "}
                  </Typography>
                  <Typography display="inline" component="span">
                    {device_specs}
                  </Typography>
                </div>
                {stock_level && (
                  <div>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
                      Stock Level:{" "}
                    </Typography>
                    <Typography
                      display="inline"
                      component="span"
                      color={stock_level === "In Stock" ? "greenyellow" : "red"}
                    >
                      {stock_level}
                    </Typography>
                  </div>
                )}
                {price && (
                  <div>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
                      Estimated Price:{" "}
                    </Typography>
                    <Typography display="inline" component="span">
                      {price}
                    </Typography>
                  </div>
                )}
                {cdw_part_no && (
                  <div>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
                      CDW Part Number:{" "}
                    </Typography>
                    <Typography display="inline" component="span">
                      {cdw_part_no}
                    </Typography>
                  </div>
                )}
              </Stack>
            </Stack>
          )}
          {props.addons && props.addons.length > 0 && (
            <Stack spacing={1}>
              <Typography fontWeight="bold">Accessories: </Typography>
              <ul>
                {props.addons &&
                  props.addons.map((i) => (
                    <li>
                      {i.includes("yubikey")
                        ? i.replace("yubikey", "2 x Yubikey 5C NFC")
                        : i}
                    </li>
                  ))}
              </ul>
            </Stack>
          )}
          {item_type !== "Accessories" && (
            <Divider textAlign="left" sx={{ fontWeight: "bold" }}>
              Deployment Type
            </Divider>
          )}
          {request_type === "quote" && (
            <FormControl
              fullWidth
              sx={textFieldStyle}
              required
              size="small"
              disabled={props.addons && props.addons.length > 0}
            >
              <InputLabel id="deployment-select-label">
                Deployment Type
              </InputLabel>
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
          )}
          {request_type === "buy" && (
            <Typography>Order from CDW immediately</Typography>
          )}
          {deployment_type === "Buy and Hold" && (
            <>
              <Divider textAlign="left" sx={{ fontWeight: "bold" }}>
                Buy and Hold Details
              </Divider>
              <TextField
                label="Quantity"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required
                type="number"
              />
              <TextField
                label="Notes"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </>
          )}
          {(item_type === "Accessories" ||
            deployment_type === "Drop Ship" ||
            request_type === "buy") && (
            <>
              <RF address_required={true} deployable_region={region} />
              <TextField
                label="Notes"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </>
          )}
          <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
          <FormControlLabel
            control={<Checkbox required onChange={handleChecked} />}
            label={
              <div>
                By checking this box, I agree to have Spoke generate a quote on
                my behalf.
              </div>
            }
          />
          <Button
            variant="contained"
            sx={{ borderRadius: "10px" }}
            disabled={fieldsFilled()}
            onClick={sendMarketplaceRequest}
          >
            {request_type === "buy" ? "Buy Now" : "Request Quote"}
          </Button>
        </Stack>
      )}
      {loading && <LinearLoading sx={{ mt: 3 }} />}
      {status === 0 && (
        <>
          <Typography variant="h6" component="h4" textAlign="center" pt={3}>
            Your request has been submitted!
          </Typography>
          <div className="center">
            <CheckCircleIcon
              sx={{ color: "#06BE08", height: "10%", width: "10%" }}
            />
          </div>
          <Typography textAlign="center">Thank you for your order!</Typography>
        </>
      )}
      {status === 1 && (
        <>
          <Typography variant="h6" component="h4" textAlign="center" pt={3}>
            There has been an error with your request
          </Typography>
          <div className="center">
            <ErrorIcon sx={{ height: "10%", width: "10%", color: "red" }} />
          </div>
          <Typography textAlign="center">Please try again later.</Typography>
        </>
      )}
    </>
  );
};

export default RecipientForm;
