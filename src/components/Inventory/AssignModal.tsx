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
import DeployModalContent from "./DeployModal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

interface AssignProps {
  serial_number: string;
  device_name: string;
}

const AssignModal = (props: AssignProps) => {
  const { serial_number, device_name } = props;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(true);
  const [openDeploy, setDeploy] = useState(false);
  const [shipping, setShipping] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const handleOpen = () => {
    setOpen(true);
    setForm(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (event: SelectChangeEvent) => {
    setShipping(event.target.value as string);
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
              sx={{ fontWeight: "bold" }}
            >
              New Deployment
            </Typography>
            <div>
              <TextField
                required
                id="standard-fn"
                label="First Name"
                defaultValue=""
                variant="standard"
                onChange={(event) => setFirstname(event.target.value)}
              />
              <TextField
                required
                id="standard-ln"
                label="Last Name"
                defaultValue=""
                variant="standard"
                sx={{ float: "right" }}
                onChange={(event) => setLastname(event.target.value)}
              />
            </div>
            <div>
              <TextField
                required
                id="standard-address"
                label="Address"
                defaultValue=""
                variant="standard"
                fullWidth
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>
            <div>
              <TextField
                required
                id="standard-email"
                label="Email"
                defaultValue=""
                variant="standard"
                onChange={(event) => setEmail(event.target.value)}
              />
              <TextField
                required
                id="standard-phonenumber"
                label="Phone Number"
                defaultValue=""
                variant="standard"
                sx={{ float: "right" }}
                onChange={(event) => setPhonenumber(event.target.value)}
              />
            </div>
            <div className="dropdown-padding">
              <FormControl fullWidth variant="standard" required>
                <InputLabel id="demo-simple-select-label">Shipping</InputLabel>
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
                variant="standard"
                fullWidth
              />
            </div>
            <div className="button">
              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#054ffe",
                  borderRadius: "999em 999em 999em 999em",
                }}
                onClick={() => {
                  setForm(false);
                }}
              >
                Submit
              </Button>
            </div>
          </Box>
        ) : (
          <DeployModalContent
            openModal={openDeploy}
            name={firstname + " " + lastname}
            device_name={device_name}
            address={address}
          />
        )}
      </Modal>
    </div>
  );
};

export default AssignModal;
