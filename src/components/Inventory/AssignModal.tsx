import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useAuth0 } from "@auth0/auth0-react";
import DeployModalContent from "./DeployModal";
import { validateAddress } from "../../services/address";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
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
  serial_number: string;
  device_name: string;
  device_location: string;
  image_source: string | undefined;
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
  const { serial_number, device_name, device_location, image_source } = props;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(true);
  const [shipping, setShipping] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [addressObj, setAddrObj] = useState<ValidateAddress | null>(null);
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [note, setNote] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const handleOpen = () => {
    setOpen(true);
    setForm(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm(false);
    setShipping("");
  };

  const handleChange = (event: SelectChangeEvent) => {
    setShipping(event.target.value as string);
  };

  const checkAddress = async () => {
    const accessToken = await getAccessTokenSilently();
    const addressResult = await validateAddress(address, accessToken);
    if (addressResult.message === "Successful!") {
      setAddrObj(addressResult.data);
    } else {
      console.log("couldn't validate address");
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>Assign</Button>
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
              sx={{ fontWeight: "bold", paddingBottom: "10px" }}
            >
              New Deployment
            </Typography>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required
                    id="standard-fn"
                    label="First Name"
                    defaultValue=""
                    onChange={(event) => setFirstname(event.target.value)}
                    size="small"
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    id="standard-ln"
                    label="Last Name"
                    defaultValue=""
                    sx={rightTextFieldStyle}
                    onChange={(event) => setLastname(event.target.value)}
                    size="small"
                  />
                </Grid>
              </Grid>
              <div>
                <TextField
                  required
                  id="standard-address"
                  label="Address"
                  defaultValue=""
                  fullWidth
                  onChange={(event) => setAddress(event.target.value)}
                  size="small"
                  sx={textFieldStyle}
                />
              </div>
              <Grid
                container
                spacing={2}
                sx={{
                  marginLeft: "-16px !important",
                  marginTop: "0px !important",
                }}
              >
                <Grid item xs={6}>
                  <TextField
                    required
                    id="standard-email"
                    label="Email"
                    defaultValue=""
                    onChange={(event) => setEmail(event.target.value)}
                    size="small"
                    sx={textFieldStyle}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    id="standard-phonenumber"
                    label="Phone Number"
                    defaultValue=""
                    sx={rightTextFieldStyle}
                    onChange={(event) => setPhonenumber(event.target.value)}
                    size="small"
                  />
                </Grid>
              </Grid>
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
                    <MenuItem value="Overnight">Overnight</MenuItem>
                    <MenuItem value="2 Day">2 Day</MenuItem>
                    <MenuItem value="Standard">Standard</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div>
                <TextField
                  id="standard-note"
                  label="Note"
                  defaultValue=""
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
                    setForm(false);
                  }}
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
            device_name={device_name}
            addressObj={addressObj!}
            serial_number={serial_number}
            email={email}
            phone_number={phonenumber}
            note={note}
            device_location={device_location}
            shipping={shipping}
            image_source={image_source}
          />
        )}
      </Modal>
    </div>
  );
};

export default AssignModal;
