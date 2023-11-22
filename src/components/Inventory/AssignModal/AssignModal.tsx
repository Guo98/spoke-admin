import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useSelector, useDispatch } from "react-redux";
// @ts-ignore
import isEmail from "validator/lib/isEmail";

import ReturnInfo from "./ReturnInfo";
import ConfirmationBox from "./ConfirmationBox";

import { InventorySummary } from "../../../interfaces/inventory";
import { RootState } from "../../../app/store";
import {
  deviceLocationMappings,
  locationMappings,
} from "../../../utilities/mappings";

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

const rightTextFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  float: "right",
};

interface AssignProps {
  serial_number?: string;
  device_name?: string;
  device_location?: string;
  image_source?: string | undefined;
  devices?: InventorySummary[];
  manageOpen?: boolean;
  handleParentClose?: Function;
  disabled: boolean;
  id?: string;
  warehouse?: string;
  manage_modal: boolean;
}

interface ValidateAddress {
  address_line1: string;
  address_line2?: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
}

const AssignModal = (props: AssignProps) => {
  const {
    serial_number,
    device_name,
    device_location,
    image_source,
    manage_modal,
  } = props;

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const [open, setOpen] = useState(
    props.manageOpen !== undefined ? props.manageOpen : false
  );

  const [success, setSuccess] = useState(-1);
  const [page, setPage] = useState(0);

  const [shipping, setShipping] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const [email, setEmail] = useState("");
  const [valid_email, setValidEmail] = useState(true);
  const [phonenumber, setPhonenumber] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [selectedDevice, setSD] = useState("");

  //new address fields
  const [ad1, setAd1] = useState("");
  const [ad2, setAd2] = useState("");
  const [city, setCity] = useState("");
  const [pc, setPC] = useState("");
  const [country, setCountry] = useState("");
  const [prov, setProv] = useState("");
  const [country_err, setCountryErr] = useState("");

  // return info
  const [return_device, setReturnDevice] = useState(false);
  const [ret_device_name, setRetDeviceName] = useState("");
  const [ret_sn, setRetSN] = useState("");
  const [ret_condition, setRetCondition] = useState("");
  const [ret_activation, setRetActivation] = useState("");
  const [ret_note, setRetNote] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setShipping("");
    setSD("");
    setError("");
    setAd1("");
    setAd2("");
    setCity("");
    setPC("");
    setCountry("");
    setProv("");
    setCountryErr("");
    setFirstname("");
    setLastname("");
    setEmail("");
    setPhonenumber("");
    setReturnDevice(false);
    setPage(0);
    setSuccess(-1);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setShipping(event.target.value as string);
  };

  const handleDeviceChange = (event: SelectChangeEvent) => {
    setSD(event.target.value as string);
  };

  const can_submit = () => {
    return (
      firstname === "" ||
      lastname === "" ||
      ad1 === "" ||
      city === "" ||
      prov === "" ||
      pc === "" ||
      country === "" ||
      phonenumber === "" ||
      email === "" ||
      shipping === ""
    );
  };

  const deploy = async () => {
    if (device_location) {
      const lc_location = device_location.toLowerCase();
      if (
        lc_location.includes("usa") ||
        lc_location.includes("united states") ||
        lc_location === "us"
      ) {
        if (
          !country.toLowerCase().includes("us") &&
          !country.toLowerCase().includes("united states")
        ) {
          setCountryErr("This device is only deployable within the US.");
          return;
        }
      } else if (
        lc_location === "uk" ||
        lc_location.includes("united kingdom") ||
        lc_location.includes("uk")
      ) {
        if (
          !country.toLowerCase().includes("uk") &&
          !country.toLowerCase().includes("united kingdom")
        ) {
          setCountryErr("This device is only deployable within the UK.");
          return;
        }
      } else {
        if (
          country.toLowerCase().includes("uk") ||
          country.toLowerCase().includes("united kingdom") ||
          country.toLowerCase().includes("us") ||
          country.toLowerCase().includes("united states")
        ) {
          setCountryErr("This device is not deployable to this region.");
          return;
        }
      }
    }
  };

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setReturnDevice(event.target.checked);
  };

  return (
    <>
      {!manage_modal ? (
        <Button
          variant="contained"
          sx={{
            borderRadius: "10px",
            alignItems: "center",
          }}
          onClick={handleOpen}
          disabled={props.disabled}
        >
          Assign
        </Button>
      ) : (
        <Button
          variant="contained"
          sx={{ height: "50%", width: "25%" }}
          onClick={handleOpen}
        >
          <Stack spacing={1} alignItems="center" p={2}>
            <LocalShippingIcon />
            <Typography>Deploy</Typography>
          </Stack>
        </Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          {page === 0 && success === -1 && (
            <Box sx={style}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignContent="space-evenly"
              >
                <Typography
                  id="modal-modal-title"
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: "bold", paddingBottom: "15px" }}
                >
                  New Deployment
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChecked}
                      checked={return_device}
                    />
                  }
                  label="Include Equipment Return Box"
                />
              </Stack>
              <Stack spacing={2}>
                <Divider textAlign="left">Device Info</Divider>
                {device_name && (
                  <div>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
                      Device:{" "}
                    </Typography>
                    <Typography display="inline" component="span">
                      {device_name}
                    </Typography>
                  </div>
                )}
                {serial_number && (
                  <div>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
                      Serial Number:{" "}
                    </Typography>
                    <Typography display="inline" component="span">
                      {serial_number}
                    </Typography>
                  </div>
                )}
                {manage_modal && (
                  <div>
                    <FormControl
                      fullWidth
                      sx={textFieldStyle}
                      required
                      size="small"
                    >
                      <InputLabel id="demo-simple-select-label">
                        Device to Deploy
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Device to Deploy"
                        onChange={handleDeviceChange}
                        value={selectedDevice}
                        required
                        fullWidth
                      >
                        {props.devices!.length > 0 &&
                          props.devices?.map((dev, index) => {
                            if (dev.serial_numbers.length > 0) {
                              return (
                                <MenuItem value={index}>
                                  <Typography display="inline" component="span">
                                    {dev.name + ","}
                                  </Typography>
                                  <Typography
                                    fontStyle="italic"
                                    sx={{ paddingLeft: "5px" }}
                                    display="inline"
                                    component="span"
                                  >
                                    {dev.location}
                                  </Typography>
                                </MenuItem>
                              );
                            }
                          })}
                      </Select>
                    </FormControl>
                  </div>
                )}
                <Divider textAlign="left">Recipient Info</Divider>
                <Stack direction="row" spacing={2}>
                  <TextField
                    required
                    id="standard-fn"
                    label="First Name"
                    value={firstname}
                    onChange={(event) => setFirstname(event.target.value)}
                    size="small"
                    sx={textFieldStyle}
                    fullWidth
                  />
                  <TextField
                    required
                    id="standard-ln"
                    label="Last Name"
                    value={lastname}
                    sx={rightTextFieldStyle}
                    onChange={(event) => setLastname(event.target.value)}
                    size="small"
                    fullWidth
                  />
                </Stack>
                <div>
                  <TextField
                    required
                    id="standard-address"
                    label="Address Line 1"
                    value={ad1}
                    fullWidth
                    onChange={(event) => setAd1(event.target.value)}
                    size="small"
                    sx={textFieldStyle}
                  />
                </div>
                <div>
                  <TextField
                    id="standard-address"
                    label="Address Line 2"
                    value={ad2}
                    fullWidth
                    onChange={(event) => setAd2(event.target.value)}
                    size="small"
                    sx={textFieldStyle}
                  />
                </div>
                <Stack direction="row" spacing={2}>
                  <TextField
                    required
                    id="standard-city"
                    label="City"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    size="small"
                    sx={textFieldStyle}
                    fullWidth
                  />
                  <TextField
                    required
                    id="standard-state"
                    label="State/Province"
                    value={prov}
                    sx={rightTextFieldStyle}
                    onChange={(event) => setProv(event.target.value)}
                    size="small"
                    fullWidth
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    required
                    id="standard-postal-code"
                    label="Postal Code"
                    value={pc}
                    onChange={(event) => setPC(event.target.value)}
                    size="small"
                    sx={textFieldStyle}
                    fullWidth
                  />
                  <TextField
                    required
                    id="standard-country"
                    label="Country"
                    value={country}
                    sx={rightTextFieldStyle}
                    onChange={(event) => setCountry(event.target.value)}
                    size="small"
                    fullWidth
                    error={country_err !== ""}
                    helperText={country_err}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    required
                    id="standard-email"
                    type="email"
                    label="Email"
                    value={email}
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
                    size="small"
                    sx={textFieldStyle}
                    fullWidth
                    error={!valid_email}
                    helperText={!valid_email ? "Invalid email" : ""}
                  />
                  <TextField
                    required
                    id="standard-phonenumber"
                    label="Phone Number"
                    value={phonenumber}
                    sx={rightTextFieldStyle}
                    onChange={(event) => setPhonenumber(event.target.value)}
                    size="small"
                    fullWidth
                  />
                </Stack>
                <div>
                  <FormControl
                    fullWidth
                    sx={textFieldStyle}
                    required
                    size="small"
                  >
                    <InputLabel id="demo-simple-select-label">
                      Shipping
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={shipping}
                      label="Shipping"
                      onChange={handleChange}
                      required
                    >
                      {device_location &&
                      device_location.toLowerCase().includes("us") ? (
                        ["Overnight", "2 Day"].map((s) => (
                          <MenuItem value={s}>{s}</MenuItem>
                        ))
                      ) : (
                        <MenuItem value="Expedited">Expedited</MenuItem>
                      )}
                      <MenuItem value="Standard">Standard</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <TextField
                    id="standard-note"
                    label="Note"
                    value={note}
                    fullWidth
                    sx={textFieldStyle}
                    size="small"
                    onChange={(event) => setNote(event.target.value)}
                  />
                </div>
                <div>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: "#054ffe",
                      borderRadius: "10px",
                    }}
                    onClick={async () => {
                      if (!return_device) {
                        await deploy();
                      } else {
                        setPage(1);
                      }
                    }}
                    disabled={can_submit()}
                  >
                    {return_device ? "Continue to Return Info" : "Submit"}
                  </Button>
                </div>
              </Stack>
            </Box>
          )}
          {return_device && success === -1 && page === 1 && (
            <ReturnInfo
              back={setPage}
              device_name={ret_device_name}
              setRetDeviceName={setRetDeviceName}
              serial_number={ret_sn}
              setRetSN={setRetSN}
              condition={ret_condition}
              setRetCondition={setRetCondition}
              activation_key={ret_activation}
              setRetActivation={setRetActivation}
              note={ret_note}
              setRetNote={setRetNote}
              deploy={deploy}
            />
          )}
          {success === 0 && (
            <ConfirmationBox
              first_name={firstname}
              last_name={lastname}
              device_name={
                manage_modal
                  ? props.devices![parseInt(selectedDevice)]?.name
                  : device_name!
              }
              address_line1={ad1}
              address_line2={ad2}
              city={city}
              state={prov}
              zipCode={pc}
              country={country}
              serial_number={
                manage_modal
                  ? props.devices![parseInt(selectedDevice)]?.serial_numbers[0]
                      .sn
                  : serial_number!
              }
              email={email}
              phone_number={phonenumber}
              note={note}
              shipping={shipping}
              image_source={
                manage_modal
                  ? props.devices![parseInt(selectedDevice)]?.image_source
                  : image_source
              }
              back={setPage}
              returning={return_device}
              client={
                clientData === "spokeops" ? selectedClientData : clientData
              }
              id={
                manage_modal
                  ? props.devices![parseInt(selectedDevice)]?.id
                  : props.id
              }
              device_location={
                manage_modal
                  ? props.devices![parseInt(selectedDevice)]?.location
                  : device_location!
              }
              warehouse={props.warehouse}
              ret_activation={ret_activation}
              ret_condition={ret_condition}
              ret_device_name={ret_device_name}
              ret_note={ret_note}
              ret_sn={ret_sn}
            />
          )}
        </>
      </Modal>
    </>
  );
};

export default AssignModal;