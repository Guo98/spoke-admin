import React, { useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Stack,
  Box,
  SelectChangeEvent,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { manageLaptop } from "../../services/inventoryAPI";
import ConfirmationBody from "./ConfirmationBody";

interface OffboardProps {
  manageType: string;
  name?: {
    first_name: string;
    last_name: string;
  };
  address?: {
    al1: string;
    al2?: string;
    city: string;
    state: string;
    postal_code: string;
    country_code: string;
  };
  device_name?: string;
  serial_number?: string;
  device_location?: string;
  email?: string;
  phone_number?: string;
  type: string;
  device_names?: string[];
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const rightTextFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  float: "right",
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

const OffboardBody = (props: OffboardProps) => {
  const {
    manageType,
    name,
    address,
    device_name,
    device_location,
    serial_number,
    email,
    phone_number,
    type,
  } = props;

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const [disabled, setDisabled] = useState(type !== "general");
  const [fn, setFn] = useState(name?.first_name || "");
  const [ln, setLn] = useState(name?.last_name || "");
  const [al1, setAl1] = useState(address?.al1 || "");
  const [al2, setAl2] = useState(address?.al2 || "");
  const [city, setCity] = useState(address?.city || "");
  const [state, setState] = useState(address?.state || "");
  const [postal_code, setPC] = useState(address?.postal_code || "");
  const [country, setCountry] = useState(address?.country_code || "");
  const [updatedemail, setEmail] = useState(email);
  const [pn, setPn] = useState(phone_number);
  const [note, setNote] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDeviceName, setSelectedDeviceName] = useState("");
  const [otherName, setOtherName] = useState("");

  const { getAccessTokenSilently, user } = useAuth0();

  const offboardLaptop = async () => {
    const client = clientData === "spokeops" ? selectedClientData : clientData;
    const accessToken = await getAccessTokenSilently();
    const bodyObj = {
      client: client,
      type: manageType,
      device_location: device_location,
      device_name:
        type === "general"
          ? selectedDeviceName !== "Other"
            ? selectedDeviceName
            : otherName
          : device_name,
      serial_number: serial_number,
      recipient_name: fn + " " + ln,
      recipient_email: updatedemail,
      item:
        type === "general"
          ? selectedDeviceName !== "Other"
            ? selectedDeviceName
            : otherName
          : device_name,
      shipping_address:
        al1 +
        ", " +
        (al2 ? al2 + ", " : "") +
        city +
        ", " +
        state +
        " " +
        postal_code +
        ", " +
        country,
      phone_num: pn,
      requestor_email: user?.email,
      note: note,
      requestor_name: user?.name,
    };

    const offboardResult = await manageLaptop(
      accessToken,
      bodyObj,
      "offboarding"
    );

    if (offboardResult.status === "Success") {
      setSuccess(true);
    }

    setConfirmation(true);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedDeviceName(event.target.value);
  };

  return (
    <>
      {!confirmation ? (
        <Box sx={style}>
          <h4>{manageType} Details</h4>
          <Stack spacing={2}>
            {type === "general" && (
              <FormControl fullWidth sx={textFieldStyle} size="small" required>
                <InputLabel id="manage-type-label">
                  Which device do you want to {manageType.toLowerCase()}?
                </InputLabel>
                <Select
                  labelId="manage-type-label"
                  id="manage-select-standard"
                  value={selectedDeviceName}
                  onChange={handleChange}
                  label={`Which device do you want to ${manageType.toLowerCase()}?`}
                >
                  {props.device_names!.length > 0 &&
                    props.device_names!.map((devName) => {
                      return <MenuItem value={devName}>{devName}</MenuItem>;
                    })}
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            )}
            {selectedDeviceName === "Other" && (
              <TextField
                label="Device Name"
                value={otherName}
                disabled={disabled}
                fullWidth
                sx={textFieldStyle}
                size="small"
                onChange={(event) => setOtherName(event.target.value)}
                required
              />
            )}
            <Grid
              container
              spacing={3}
              sx={{
                marginLeft: type === "general" ? "-23px !important" : "",
                marginTop: type === "general" ? "0px !important" : "",
              }}
            >
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  value={fn}
                  disabled={disabled}
                  fullWidth
                  sx={textFieldStyle}
                  size="small"
                  onChange={(event) => setFn(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  value={ln}
                  disabled={disabled}
                  fullWidth
                  sx={rightTextFieldStyle}
                  size="small"
                  onChange={(event) => setLn(event.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <TextField
              label="Address Line 1"
              value={al1}
              disabled={disabled}
              fullWidth
              sx={textFieldStyle}
              size="small"
              onChange={(event) => setAl1(event.target.value)}
              required
            />
            <TextField
              label="Address Line 2"
              value={al2}
              disabled={disabled}
              fullWidth
              sx={textFieldStyle}
              size="small"
              onChange={(event) => setAl2(event.target.value)}
            />
            <Grid
              container
              spacing={3}
              sx={{
                marginLeft: "-23px !important",
                marginTop: "0px !important",
              }}
            >
              <Grid item xs={6}>
                <TextField
                  label="City"
                  value={city}
                  disabled={disabled}
                  fullWidth
                  sx={textFieldStyle}
                  size="small"
                  onChange={(event) => setCity(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="State/Province"
                  value={state}
                  disabled={disabled}
                  fullWidth
                  sx={textFieldStyle}
                  size="small"
                  onChange={(event) => setState(event.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={3}
              sx={{
                marginLeft: "-23px !important",
                marginTop: "0px !important",
              }}
            >
              <Grid item xs={6}>
                <TextField
                  label="Postal Code"
                  value={postal_code}
                  disabled={disabled}
                  fullWidth
                  sx={textFieldStyle}
                  size="small"
                  onChange={(event) => setPC(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Country"
                  value={country}
                  disabled={disabled}
                  fullWidth
                  sx={textFieldStyle}
                  size="small"
                  onChange={(event) => setCountry(event.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={3}
              sx={{
                marginLeft: "-23px !important",
                marginTop: "0px !important",
              }}
            >
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  value={updatedemail}
                  disabled={disabled}
                  fullWidth
                  sx={textFieldStyle}
                  size="small"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone Number"
                  value={pn}
                  disabled={disabled}
                  fullWidth
                  sx={textFieldStyle}
                  size="small"
                  onChange={(event) => setPn(event.target.value)}
                  required
                />
              </Grid>
            </Grid>
            <TextField
              label="Note"
              value={note}
              fullWidth
              sx={textFieldStyle}
              size="small"
              onChange={(event) => setNote(event.target.value)}
            />
            <Grid
              container
              justifyContent="space-evenly"
              sx={{
                marginLeft: "-23px !important",
                marginTop: "0px !important",
              }}
              spacing={3}
            >
              {type !== "general" && (
                <Grid item xs={6}>
                  <Button
                    onClick={() => setDisabled(false)}
                    sx={{
                      backgroundColor: "white",
                      color: "#054ffe",
                      borderRadius: "10px",
                      ":hover": {
                        backgroundColor: "white",
                      },
                    }}
                    variant="contained"
                    fullWidth
                  >
                    Edit
                  </Button>
                </Grid>
              )}
              <Grid item xs={type !== "general" ? 6 : 12}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#054ffe",
                    borderRadius: "10px",
                  }}
                  fullWidth
                  onClick={() => offboardLaptop()}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      ) : (
        <ConfirmationBody
          conType={manageType}
          name={fn + " " + ln}
          success={success}
        />
      )}
    </>
  );
};

export default OffboardBody;
