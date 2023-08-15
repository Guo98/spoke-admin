import React, { useState } from "react";
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
} from "@mui/material";

interface RecipientProps {
  completeRecipientStep: Function;
  device_name: string;
  device_specs: string;
  device_url: string;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const RecipientForm = (props: RecipientProps) => {
  const { completeRecipientStep, device_name, device_specs, device_url } =
    props;

  const [deployment_type, setDeploymentType] = useState("Drop Ship");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [addr1, setAddr1] = useState("");
  const [addr2, setAddr2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal_code, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPN] = useState("");
  const [shipping, setShipping] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleDeploymentChange = (event: SelectChangeEvent) => {
    setDeploymentType(event.target.value);
  };

  const handleShippingChange = (event: SelectChangeEvent) => {
    setShipping(event.target.value);
  };

  const fieldsFilled = () => {
    if (deployment_type === "Drop Ship") {
      return (
        first_name === "" ||
        last_name === "" ||
        addr1 === "" ||
        city === "" ||
        state === "" ||
        postal_code === "" ||
        country === "" ||
        email === "" ||
        phone_number === "" ||
        shipping === ""
      );
    }
  };

  return (
    <>
      <Stack spacing={2} pt={2.5}>
        <FormControl fullWidth sx={textFieldStyle} required size="small">
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
        {deployment_type === "Drop Ship" && (
          <>
            <Typography fontWeight="bold" variant="h6">
              Recipient Details
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <TextField
                label="First Name"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <TextField
                label="Last Name"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Stack>
            <TextField
              label="Address Line 1"
              size="small"
              sx={textFieldStyle}
              fullWidth
              value={addr1}
              onChange={(e) => setAddr1(e.target.value)}
              required
            />
            <TextField
              label="Address Line 2"
              size="small"
              sx={textFieldStyle}
              fullWidth
              value={addr2}
              onChange={(e) => setAddr2(e.target.value)}
            />
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <TextField
                label="City"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <TextField
                label="State"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <TextField
                label="Postal Code"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={postal_code}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
              <TextField
                label="Country"
                size="small"
                sx={textFieldStyle}
                fullWidth
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Stack>
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
              <InputLabel id="shipping-select-label">Shipping Rate</InputLabel>
              <Select
                labelId="shipping-select-label"
                id="shipping-select"
                label="Shipping Rate"
                onChange={handleShippingChange}
                value={shipping}
                required
              >
                <MenuItem value="Standard">Standard</MenuItem>
                <MenuItem value="2 Day">2 Day</MenuItem>
                <MenuItem value="Overnight">Overnight</MenuItem>
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
        <Button
          variant="contained"
          sx={{ borderRadius: "10px" }}
          disabled={fieldsFilled()}
        >
          Request Quote
        </Button>
      </Stack>
    </>
  );
};

export default RecipientForm;
