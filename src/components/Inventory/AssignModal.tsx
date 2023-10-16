import React, { useState } from "react";
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
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import DeployModalContent from "./DeployModal";
import { InventorySummary } from "../../interfaces/inventory";
import {
  deviceLocationMappings,
  locationMappings,
} from "../../utilities/mappings";

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
  type: string;
  devices?: InventorySummary[];
  manageOpen?: boolean;
  handleParentClose?: Function;
  disabled: boolean;
  id?: string;
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
  const { serial_number, device_name, device_location, image_source, type } =
    props;
  const [open, setOpen] = useState(
    props.manageOpen !== undefined ? props.manageOpen : false
  );
  const [form, setForm] = useState(true);
  const [shipping, setShipping] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [addressObj, setAddrObj] = useState<ValidateAddress | null>(null);
  const [email, setEmail] = useState("");
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

  const { getAccessTokenSilently } = useAuth0();

  const handleOpen = () => {
    setOpen(true);
    setForm(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm(false);
    setShipping("");
    setSD("");
    setError("");

    if (type === "general") props.handleParentClose!();
  };

  const handleChange = (event: SelectChangeEvent) => {
    setShipping(event.target.value as string);
  };

  const handleDeviceChange = (event: SelectChangeEvent) => {
    setSD(event.target.value as string);
  };

  const checkAddress = () => {
    // const accessToken = await getAccessTokenSilently();
    // const addressResult = await validateAddress(address, accessToken);
    // if (addressResult.message === "Successful!") {
    //   if (
    //     addressResult.data.country &&
    //     deviceLocationMappings[addressResult.data.country] &&
    //     deviceLocationMappings[addressResult.data.country].indexOf(
    //       type === "general"
    //         ? props.devices![parseInt(selectedDevice)]?.location
    //         : device_location
    //     ) < 0
    //   ) {
    //     setError(
    //       `This device is only deployable within ${
    //         locationMappings[device_location!]
    //       }. Please enter an address within the territory or select a new device to deploy.`
    //     );
    //   } else {
    //     setAddrObj(addressResult.data);
    //     setForm(false);
    //   }
    // } else {
    //   setError("Please confirm that the address was entered correctly.");
    // }
    const addrObj: any = {
      address_line1: ad1,
      address_line2: ad2,
      city: city,
      state: prov,
      zipCode: pc,
      country: country,
    };
    setAddrObj(addrObj);
    setForm(false);
  };

  const disable_button = () => {
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
      {type !== "general" && (
        <Button
          variant="contained"
          sx={{
            borderRadius: type === "general" ? "10px 0px 0px 10px" : "10px",
            alignItems: "center",
          }}
          onClick={handleOpen}
          disabled={props.disabled}
        >
          Assign
        </Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {form ? (
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h3"
              sx={{ fontWeight: "bold", paddingBottom: "15px" }}
            >
              New Deployment
            </Typography>
            <Stack spacing={2}>
              {(type === "general" || type === "main") && (
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
              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  id="standard-fn"
                  label="First Name"
                  onChange={(event) => setFirstname(event.target.value)}
                  value={firstname}
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
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  id="standard-email"
                  label="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  size="small"
                  sx={textFieldStyle}
                  fullWidth
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
                    {is_in_us() && (
                      <MenuItem value="Overnight">Overnight</MenuItem>
                    )}
                    {is_in_us() && <MenuItem value="2 Day">2 Day</MenuItem>}
                    <MenuItem value="Standard">Standard</MenuItem>
                    {!is_in_us() && (
                      <MenuItem value="Expedited">Expedited</MenuItem>
                    )}
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
                    await checkAddress();
                  }}
                  disabled={disable_button()}
                >
                  Submit
                </Button>
              </div>
            </Stack>
          </Box>
        ) : (
          <DeployModalContent
            openModal={form}
            first_name={firstname}
            last_name={lastname}
            device_name={
              type === "general"
                ? props.devices![parseInt(selectedDevice)]?.name
                : device_name!
            }
            addressObj={addressObj!}
            serial_number={
              type === "general"
                ? props.devices![parseInt(selectedDevice)]?.serial_numbers[0].sn
                : serial_number!
            }
            email={email}
            phone_number={phonenumber}
            note={note}
            device_location={
              type === "general"
                ? props.devices![parseInt(selectedDevice)]?.location
                : device_location!
            }
            shipping={shipping}
            image_source={
              type === "general"
                ? props.devices![parseInt(selectedDevice)]?.image_source
                : image_source
            }
            id={
              type === "general"
                ? props.devices![parseInt(selectedDevice)]?.id
                : props.id
            }
          />
        )}
      </Modal>
    </>
  );
};

export default AssignModal;
