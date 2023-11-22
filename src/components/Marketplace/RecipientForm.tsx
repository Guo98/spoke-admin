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
import { standardPost } from "../../services/standard";
import LinearLoading from "../common/LinearLoading";

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
  } = props;

  const { user, getAccessTokenSilently } = useAuth0();

  const [deployment_type, setDeploymentType] = useState("Drop Ship");
  const [return_box, setReturnBox] = useState(false);
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPN] = useState("");
  const [shipping, setShipping] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(-1);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (clear_deployment) {
      setDeploymentType("Drop Ship");
      setName("");
      setAddr("");
      setEmail("");
      setPN("");
      setShipping("");
      setNotes("");
      setQuantity(1);

      setClear(false);
    }
  }, [clear_deployment]);

  const handleDeploymentChange = (event: SelectChangeEvent) => {
    setDeploymentType(event.target.value);
  };

  const handleShippingChange = (event: SelectChangeEvent) => {
    setShipping(event.target.value);
  };

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleReturnChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setReturnBox(event.target.checked);
  };

  const fieldsFilled = () => {
    if (deployment_type === "Drop Ship") {
      return (
        name === "" ||
        addr === "" ||
        email === "" ||
        phone_number === "" ||
        shipping === "" ||
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
      return_device: return_box,
    };
    if (props.supplier !== "") {
      postBody.supplier = props.supplier;
    }
    if (deployment_type === "Buy and Hold") {
      postBody.order_type = "Hold in Inventory";
      postBody.quantity = quantity;
      postBody.notes.device = notes;
    } else {
      postBody.order_type = "Deploy Right Away";
      postBody.notes.recipient = notes;
      postBody.recipient_name = name;
      postBody.address = addr;
      postBody.email = email;
      postBody.phone_number = phone_number;
      postBody.shipping_rate = shipping;
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
          <Typography fontWeight="bold" variant="h6">
            Device Details
          </Typography>
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
                <Typography display="inline" component="span" fontWeight="bold">
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
            </Stack>
          </Stack>
          <Divider />
          <Typography fontWeight="bold">Select Deployment Type:</Typography>
          <FormControl fullWidth sx={textFieldStyle} required size="small">
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
          {deployment_type === "Drop Ship" && (
            <FormControlLabel
              control={
                <Checkbox onChange={handleReturnChecked} checked={return_box} />
              }
              label="Include Equipment Return Box"
            />
          )}
          {deployment_type === "Drop Ship" && (
            <>
              <Typography fontWeight="bold" variant="h6">
                Recipient Details
              </Typography>
              <TextField
                label="Full Name"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                label="Address"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
                required
              />
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <TextField
                  label="Email"
                  size="small"
                  sx={textFieldStyle}
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label="Phone Number"
                  size="small"
                  sx={textFieldStyle}
                  fullWidth
                  value={phone_number}
                  onChange={(e) => setPN(e.target.value)}
                  required
                />
              </Stack>
              <FormControl fullWidth sx={textFieldStyle} required size="small">
                <InputLabel id="shipping-select-label">
                  Shipping Rate
                </InputLabel>
                <Select
                  labelId="shipping-select-label"
                  id="shipping-select"
                  label="Shipping Rate"
                  onChange={handleShippingChange}
                  value={shipping}
                  required
                >
                  <MenuItem value="Standard">Standard</MenuItem>
                  {region === "United States" && (
                    <MenuItem value="2 Day">2 Day</MenuItem>
                  )}
                  {region === "United States" && (
                    <MenuItem value="Overnight">Overnight</MenuItem>
                  )}
                  {region !== "United States" && (
                    <MenuItem value="Expedited">Expedited</MenuItem>
                  )}
                </Select>
              </FormControl>
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
          {deployment_type === "Buy and Hold" && (
            <>
              <Typography fontWeight="bold" variant="h6">
                Buy and Hold Details
              </Typography>
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
            Request Quote
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
