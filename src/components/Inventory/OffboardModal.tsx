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
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

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
  const { client } = props;

  const { getAccessTokenSilently, user } = useAuth0();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [return_type, setRType] = useState("");
  const [selected_device, setSelectedDevice] = useState("");
  const [condition, setCondition] = useState("");
  const [serial_number, setSN] = useState("");
  const [activation, setActivation] = useState("");

  const [first_name, setFN] = useState("");
  const [last_name, setLN] = useState("");
  const [al1, setAl1] = useState("");
  const [al2, setAl2] = useState("");
  const [city, setCity] = useState("");
  const [prov, setProv] = useState("");
  const [country, setCountry] = useState("");
  const [postal_code, setPC] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPN] = useState("");
  const [shipping, setShipping] = useState("");
  const [notes, setNotes] = useState("");

  const [success, setSuccess] = useState(-1);

  const handleClose = () => {
    setOpen(false);
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
      device_name: props.device_name || selected_device,
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
      al1 === "" ||
      city === "" ||
      prov === "" ||
      postal_code === "" ||
      country === "" ||
      email === "" ||
      phone_number === "" ||
      shipping === "" ||
      return_type === ""
    );
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ borderRadius: "10px" }}
      >
        Offboard
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {!loading && success === -1 && (
            <>
              <Typography variant="h6" pb={2}>
                Return a Device
              </Typography>
              <Stack spacing={1}>
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
                    <MenuItem value="Offboarding">Offboarding</MenuItem>
                    <MenuItem value="Returning">Returning</MenuItem>
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
                  onChange={(text: string) => setSN(text)}
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
                <TextField
                  label="Address Line 1"
                  value={al1}
                  onChange={(text: string) => setAl1(text)}
                  fullWidth
                  required
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
                    required
                  />
                  <TextField
                    label="State/Province"
                    value={al1}
                    onChange={(text: string) => setProv(text)}
                    fullWidth
                    required
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Postal Code"
                    value={postal_code}
                    onChange={(text: string) => setPC(text)}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Country"
                    value={country}
                    onChange={(text: string) => setCountry(text)}
                    fullWidth
                    required
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Email"
                    value={email}
                    onChange={(text: string) => setEmail(text)}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Phone Number"
                    value={phone_number}
                    onChange={(text: string) => setPN(text)}
                    fullWidth
                    required
                  />
                </Stack>
                <FormControl
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  required
                >
                  <InputLabel id="shipping-select-label">Shipping</InputLabel>
                  <Select
                    labelId="shipping-select-label"
                    label="Shipping"
                    onChange={handleShippingChange}
                    required
                  >
                    <MenuItem value="Shipping">Standard</MenuItem>
                    <MenuItem value="2 Day">2 Day</MenuItem>
                    <MenuItem value="Overnight">Overnight</MenuItem>
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
