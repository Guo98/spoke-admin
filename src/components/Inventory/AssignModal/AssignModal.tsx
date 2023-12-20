import React, { useState, ChangeEvent, useEffect } from "react";
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
  Stepper,
  Step,
  StepLabel,
  StepIconProps,
  IconButton,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LaptopIcon from "@mui/icons-material/Laptop";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useSelector, useDispatch } from "react-redux";
// @ts-ignore
import isEmail from "validator/lib/isEmail";

import ReturnInfo from "./ReturnInfo";
import ConfirmationBox from "./ConfirmationBox";
import { ColorConnector, ColorIconRoot } from "../../common/StepperUtils";
import AddOns from "../../common/AddOns/AddOns";

import { InventorySummary } from "../../../interfaces/inventory";
import { RootState } from "../../../app/store";
import {
  deviceLocationMappings,
  locationMappings,
} from "../../../utilities/mappings";
import { button_style } from "../../../utilities/styles";

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

function ColorStepIcon(props: StepIconProps) {
  // Add active to ownerstate if want deployment filled on form
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <LaptopIcon />,
    2: <AddShoppingCartIcon />,
    3: <LocalShippingIcon />,
  };

  return (
    <ColorIconRoot ownerState={{ completed }} className={className}>
      {icons[String(props.icon)]}
    </ColorIconRoot>
  );
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

  const [assign_device_name, setAssignDeviceName] = useState(device_name || "");
  const [assign_device_loc, setAssignDeviceLoc] = useState(
    device_location || ""
  );

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

  //stepper
  const [active_step, setActiveStep] = useState(0);
  const [step_1, setStep1] = useState(true);
  const [step_2, setStep2] = useState(false);
  const [step_3, setStep3] = useState(false);

  useEffect(() => {
    if (active_step === 0) {
      setStep2(false);
      setStep3(false);
    } else if (active_step === 1) {
      setStep3(false);
    }
  }, [active_step]);

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
    setSuccess(-1);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setShipping(event.target.value as string);
  };

  const handleDeviceChange = (event: SelectChangeEvent) => {
    setSD(event.target.value as string);
    setAssignDeviceName(
      props.devices![parseInt(event.target.value as string)]?.name
    );
    setAssignDeviceLoc(
      props.devices![parseInt(event.target.value as string)]?.location
    );
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
    if (assign_device_loc) {
      const lc_location = assign_device_loc.toLowerCase();
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
        } else {
          setActiveStep(2);
          setStep3(true);
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
        } else {
          setActiveStep(2);
          setStep3(true);
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
        } else {
          setActiveStep(2);
          setStep3(true);
        }
      }
    }
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
        <Box sx={style}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {active_step !== 0 && (
              <IconButton
                onClick={() => {
                  if (active_step === 2) {
                    if (step_2) {
                      setActiveStep(active_step - 1);
                    } else {
                      setActiveStep(0);
                    }
                  } else {
                    setActiveStep(active_step - 1);
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h3"
              sx={{ fontWeight: "bold" }}
            >
              New Deployment
            </Typography>
            {/* <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChecked}
                      checked={return_device}
                    />
                  }
                  label="Include Equipment Return Box"
                /> */}
          </Stack>
          <Stepper
            activeStep={active_step}
            sx={{ paddingTop: "10px" }}
            connector={<ColorConnector />}
          >
            <Step key="Device" completed={step_1}>
              <StepLabel StepIconComponent={ColorStepIcon}>
                <Typography>Device</Typography>
              </StepLabel>
            </Step>
            <Step completed={step_2}>
              <StepLabel StepIconComponent={ColorStepIcon}>
                <Typography>Add Ons</Typography>
              </StepLabel>
            </Step>
            <Step completed={step_3}>
              <StepLabel StepIconComponent={ColorStepIcon}>
                <Typography>Confirmation</Typography>
              </StepLabel>
            </Step>
          </Stepper>
          {active_step === 0 && (
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
                    {assign_device_loc &&
                    assign_device_loc.toLowerCase().includes("us") ? (
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
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#054ffe",
                    borderRadius: "10px",
                  }}
                  disabled={can_submit()}
                  onClick={() => {
                    setStep2(true);
                    setActiveStep(1);
                  }}
                >
                  Add Ons
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#054ffe",
                    borderRadius: "10px",
                  }}
                  onClick={() => {
                    deploy();
                  }}
                  disabled={can_submit()}
                >
                  {return_device ? "Continue to Return Info" : "Submit"}
                </Button>
              </Stack>
            </Stack>
          )}
          {active_step === 1 && (
            <>
              <AddOns
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
                return_box={return_device}
                handleReturnChecked={setReturnDevice}
              />
              <Button
                sx={{ ...button_style, mt: 2 }}
                fullWidth
                variant="contained"
                onClick={() => {
                  setActiveStep(2);
                  setStep3(true);
                }}
              >
                Submit
              </Button>
            </>
          )}
          {active_step === 2 && (
            <ConfirmationBox
              first_name={firstname}
              last_name={lastname}
              device_name={assign_device_name}
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
              returning={return_device}
              client={
                clientData === "spokeops" ? selectedClientData : clientData
              }
              id={
                manage_modal
                  ? props.devices![parseInt(selectedDevice)]?.id
                  : props.id
              }
              device_location={assign_device_loc}
              warehouse={props.warehouse}
              ret_activation={ret_activation}
              ret_condition={ret_condition}
              ret_device_name={ret_device_name}
              ret_note={ret_note}
              ret_sn={ret_sn}
            />
          )}
        </Box>
        {/* /* {return_device && success === -1 && page === 1 && (
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
          */}
      </Modal>
    </>
  );
};

export default AssignModal;
