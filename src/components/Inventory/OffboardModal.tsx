import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Stack,
  Divider,
  Autocomplete,
  TextField as TF,
  Alert,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
// @ts-ignore
import isEmail from "validator/lib/isEmail";

import { standardPost } from "../../services/standard";

import TextField from "../common/TextField";
import SmallLinearLoading from "../common/SmallLinearLoading";

interface OffboardProps {
  client: string;
  device_location?: string;
  device_name?: string;
  serial_number?: string;
  id?: string;
  all_devices?: string[];
  type?: string;
  first_name?: string;
  last_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  email?: string;
  phone_number?: string;
  manage_modal: boolean;
}

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

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const OffboardModal = (props: OffboardProps) => {
  const { client, manage_modal } = props;

  const { getAccessTokenSilently, user } = useAuth0();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [return_type, setRType] = useState("");
  const [selected_device, setSelectedDevice] = useState("");
  const [condition, setCondition] = useState("");
  const [serial_number, setSN] = useState(props.serial_number || "");
  const [activation, setActivation] = useState("");

  const [first_name, setFN] = useState(props.first_name || "");
  const [last_name, setLN] = useState(props.last_name || "");
  const [al1, setAl1] = useState(props.address_line1 || "");
  const [al2, setAl2] = useState(props.address_line2 || "");
  const [city, setCity] = useState(props.city || "");
  const [prov, setProv] = useState(props.state || "");
  const [country, setCountry] = useState(props.country || "");
  const [postal_code, setPC] = useState(props.postal_code || "");
  const [email, setEmail] = useState(props.email || "");
  const [valid_email, setValidEmail] = useState(true);

  const [phone_number, setPN] = useState(props.phone_number || "");
  const [shipping, setShipping] = useState("");
  const [notes, setNotes] = useState("");

  const [success, setSuccess] = useState(-1);

  const handleClose = () => {
    setOpen(false);
    // reset all state
    setRType("");
    setSelectedDevice("");
    setCondition("");
    setSN("");
    setActivation("");
    setFN("");
    setLN("");
    setAl1("");
    setAl2("");
    setCity("");
    setProv("");
    setCountry("");
    setPC("");
    setEmail("");
    setPN("");
    setShipping("");
    setNotes("");
    setSuccess(-1);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setRType(event.target.value);
  };

  const handleShippingChange = (event: SelectChangeEvent) => {
    setShipping(event.target.value);
  };

  const submit_offboard = async () => {
    setLoading(true);

    const accessToken = await getAccessTokenSilently();

    let bodyObj: any = {
      client: client,
      type: return_type,
      device_location: props.device_location,
      device_name:
        selected_device !== ""
          ? selected_device
          : props.device_name
          ? props.device_name
          : "",
      serial_number: props.serial_number || serial_number,
      device_condition: condition,
      recipient_name: first_name + " " + last_name,
      recipient_email: email,
      item: props.device_name || selected_device,
      shipping_address:
        al1 +
        ", " +
        (al2 ? al2 + ", " : "") +
        city +
        ", " +
        prov +
        " " +
        postal_code +
        ", " +
        country,
      phone_num: phone_number,
      requestor_email: user?.email,
      note: notes,
      requestor_name: user?.name,
      id: props.id,
      shipping,
      no_address: al1 === "",
    };

    if (activation !== "") {
      bodyObj.activation_key = activation;
    }

    const offboardResult = await standardPost(
      accessToken,
      "offboarding",
      bodyObj
    );

    if (offboardResult.status === "Success") {
      setSuccess(0);
    } else {
      setSuccess(1);
    }

    setLoading(false);
  };

  const required_fields = () => {
    return (
      first_name === "" ||
      last_name === "" ||
      email === "" ||
      return_type === ""
    );
  };

  const is_in_us = () => {
    const country_text = country.toLowerCase();
    return (
      country_text === "us" ||
      country_text === "usa" ||
      country_text === "united states"
    );
  };

  return (
    <>
      {manage_modal ? (
        <Button
          variant="contained"
          sx={{ height: "50%", width: "25%" }}
          onClick={() => setOpen(true)}
        >
          <Stack spacing={1} alignItems="center" p={2}>
            <KeyboardReturnIcon />
            <Typography>Return</Typography>
          </Stack>
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ borderRadius: "10px" }}
        >
          Offboard
        </Button>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {!loading && (
            <>
              <Typography variant="h6" pb={2}>
                Return a Device
              </Typography>
              <Stack spacing={1}>
                {success === 0 && (
                  <Alert severity="success">
                    Offboard successfully requested!
                  </Alert>
                )}
                {success === 1 && (
                  <Alert severity="error">
                    Error in requesting offboard. Please reach out to the Spoke
                    team for support.
                  </Alert>
                )}
                <Divider textAlign="left">Device Info</Divider>
                <FormControl
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  required
                >
                  <InputLabel id="return-select-label">Return Type</InputLabel>
                  <Select
                    labelId="return-select-label"
                    label="Return Type"
                    onChange={handleTypeChange}
                    required
                  >
                    <MenuItem value="Offboard">Offboarding</MenuItem>
                    <MenuItem value="Return">Returning</MenuItem>
                  </Select>
                </FormControl>
                {props.device_name && (
                  <TextField
                    disabled
                    defaultValue={props.device_name}
                    fullWidth
                    label="Device Name"
                    value={props.device_name}
                    onChange={(text: string) => setSelectedDevice(text)}
                  />
                )}
                {props.all_devices && props.all_devices.length > 0 && (
                  <Autocomplete
                    freeSolo
                    options={[...props.all_devices]}
                    renderInput={(params) => (
                      <TF
                        {...params}
                        label="Device to Return"
                        size="small"
                        sx={textFieldStyle}
                      />
                    )}
                  />
                )}
                <TextField
                  label="Device Condition"
                  value={condition}
                  onChange={(text: string) => setCondition(text)}
                />
                <TextField
                  label="Serial Number"
                  value={serial_number}
                  defaultValue={props.serial_number}
                  onChange={(text: string) => setSN(text)}
                  disabled={props.serial_number !== undefined}
                />
                <TextField
                  label="Activation Key"
                  value={activation}
                  onChange={(text: string) => setActivation(text)}
                />
                <Divider textAlign="left">Shipping Info</Divider>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="First Name"
                    value={first_name}
                    onChange={(text: string) => setFN(text)}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Last Name"
                    value={last_name}
                    onChange={(text: string) => setLN(text)}
                    fullWidth
                    required
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TF
                    label="Email"
                    value={email}
                    sx={textFieldStyle}
                    size="small"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (
                        !isEmail(event.target.value) &&
                        event.target.value !== ""
                      ) {
                        setValidEmail(false);
                      } else {
                        setValidEmail(true);
                      }
                    }}
                    fullWidth
                    required
                    error={!valid_email}
                    helperText={!valid_email ? "Invalid email" : ""}
                  />
                  <TextField
                    label="Phone Number"
                    value={phone_number}
                    onChange={(text: string) => setPN(text)}
                    fullWidth
                  />
                </Stack>
                <TextField
                  label="Address Line 1"
                  value={al1}
                  onChange={(text: string) => setAl1(text)}
                  fullWidth
                />
                <TextField
                  label="Address Line 2"
                  value={al2}
                  onChange={(text: string) => setAl2(text)}
                  fullWidth
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="City/Town"
                    value={city}
                    onChange={(text: string) => setCity(text)}
                    fullWidth
                  />
                  <TextField
                    label="State/Province"
                    value={prov}
                    onChange={(text: string) => setProv(text)}
                    fullWidth
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Postal Code"
                    value={postal_code}
                    onChange={(text: string) => setPC(text)}
                    fullWidth
                  />
                  <TextField
                    label="Country"
                    value={country}
                    onChange={(text: string) => setCountry(text)}
                    fullWidth
                  />
                </Stack>
                <FormControl fullWidth size="small" sx={textFieldStyle}>
                  <InputLabel id="shipping-select-label">Shipping</InputLabel>
                  <Select
                    labelId="shipping-select-label"
                    label="Shipping"
                    onChange={handleShippingChange}
                    required
                  >
                    <MenuItem value="Shipping">Standard</MenuItem>
                    {is_in_us() && <MenuItem value="2 Day">2 Day</MenuItem>}
                    {is_in_us() && (
                      <MenuItem value="Overnight">Overnight</MenuItem>
                    )}
                    {!is_in_us() && (
                      <MenuItem value="Expedited">Expedited</MenuItem>
                    )}
                  </Select>
                </FormControl>
                <TextField
                  label="Notes"
                  value={notes}
                  onChange={(text: string) => setNotes(text)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  sx={{ borderRadius: "10px" }}
                  disabled={required_fields()}
                  onClick={submit_offboard}
                >
                  Submit
                </Button>
              </Stack>
            </>
          )}
          {loading && <SmallLinearLoading />}
        </Box>
      </Modal>
    </>
  );
};

export default OffboardModal;
