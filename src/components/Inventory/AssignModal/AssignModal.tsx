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

import ConfirmationBox from "./ConfirmationBox";
import { ColorConnector, ColorIconRoot } from "../../common/StepperUtils";
import AccessoriesSelection from "../../Marketplace/DeviceSelection/AccessoriesSelection";

import { InventorySummary } from "../../../interfaces/inventory";
import { RootState } from "../../../app/store";
import { standardGet } from "../../../services/standard";
import { setInventory } from "../../../app/slices/inventorySlice";
import { button_style } from "../../../utilities/styles";
import { resetInfo } from "../../../app/slices/recipientSlice";

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

  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

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

  const [error, setError] = useState("");
  const [selectedDevice, setSD] = useState("");
  const [country_err, setCountryErr] = useState("");

  // return info
  const [return_device, setReturnDevice] = useState(false);
  const [ret_device_name, setRetDeviceName] = useState("");
  const [ret_sn, setRetSN] = useState("");
  const [ret_condition, setRetCondition] = useState("");
  const [ret_activation, setRetActivation] = useState("");
  const [ret_note, setRetNote] = useState("");

  //addons
  const [addons, setAddons] = useState<string[]>([]);

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

  useEffect(() => {
    if (device_name) {
      setAssignDeviceName(device_name);
    }
  }, [device_name]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
    setSD("");
    setError("");
    //setAssignDeviceLoc("");
    //setAssignDeviceName("");
    setCountryErr("");
    setReturnDevice(false);
    setSuccess(-1);
    dispatch(resetInfo());
    setActiveStep(0);
    if (active_step === 2) {
      const access_token = await getAccessTokenSilently();
      const inventoryResult = await standardGet(
        access_token,
        `inventory/${
          clientData === "spokeops" ? selectedClientData : clientData
        }`
      );
      dispatch(setInventory(inventoryResult.data));
    }
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

  const deploy = async () => {
    setActiveStep(2);
    setStep3(true);
  };

  const addAddons = (addl_items: string[]) => {
    setAddons(addl_items);
    setActiveStep(2);
    setStep3(true);
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
          id="inventory-manage-assign"
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
        <Box sx={style} id="assign-modal">
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
                id="assign-modal-back"
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
          </Stack>
          <Stepper
            activeStep={active_step}
            sx={{ paddingTop: "10px" }}
            connector={<ColorConnector />}
            id="assign-stepper"
          >
            <Step key="Device" completed={step_1}>
              <StepLabel StepIconComponent={ColorStepIcon}>
                <Typography>Device</Typography>
              </StepLabel>
            </Step>
            <Step completed={step_2}>
              <StepLabel StepIconComponent={ColorStepIcon}>
                <Typography>Accessories</Typography>
              </StepLabel>
            </Step>
            <Step completed={step_3}>
              <StepLabel StepIconComponent={ColorStepIcon}>
                <Typography>Deployment</Typography>
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
                  <Typography
                    display="inline"
                    component="span"
                    id="assign-modal-device-name"
                  >
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
                  <Typography
                    display="inline"
                    component="span"
                    id="assign-modal-sn"
                  >
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
                    id="manage-assign-dropdown"
                  >
                    <InputLabel id="manage-select-device-label">
                      Device to Deploy
                    </InputLabel>
                    <Select
                      labelId="manage-select-device"
                      id="manage-select-device"
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
              <Stack direction="row" spacing={1} id="assign-modal-buttons-row">
                <Button
                  variant="contained"
                  fullWidth
                  sx={button_style}
                  onClick={() => {
                    setStep2(true);
                    setActiveStep(1);
                  }}
                >
                  Add Accessories
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={button_style}
                  onClick={() => {
                    deploy();
                  }}
                >
                  Deploy
                </Button>
              </Stack>
            </Stack>
          )}
          {active_step === 1 && (
            <AccessoriesSelection
              nextStep={addAddons}
              client={
                clientData === "spokeops" ? selectedClientData : clientData
              }
              ret_device={ret_device_name}
              setRetDevice={setRetDeviceName}
              ret_sn={ret_sn}
              setRetSN={setRetSN}
              ret_condition={ret_condition}
              setRetCondition={setRetCondition}
              ret_act_key={ret_activation}
              setRetActKey={setRetActivation}
              ret_note={ret_note}
              setRetNote={setRetNote}
              addons={addons}
              can_buy_direct={false}
              is_page={false}
            />
          )}
          {active_step === 2 && (
            <ConfirmationBox
              device_name={assign_device_name}
              serial_number={
                manage_modal
                  ? props.devices![parseInt(selectedDevice)]?.serial_numbers[0]
                      .sn
                  : serial_number!
              }
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
              addons={addons}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AssignModal;
