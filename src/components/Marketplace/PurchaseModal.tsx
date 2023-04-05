import React, { useState, ChangeEvent } from "react";
import {
  Modal,
  Box,
  Typography,
  CardMedia,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  TextField,
  Divider,
  FormControlLabel,
  Checkbox,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

interface PurchaseProps {
  open: boolean;
  handleClose: Function;
  imgSrc: string;
  types: any;
  brand: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  marginTop: "10px",
};

const PurchaseModal = (props: PurchaseProps) => {
  const { open, handleClose, imgSrc, types, brand } = props;

  const [type, setType] = useState("");
  const [specs, setSpecs] = useState("");
  const [color, setColor] = useState("");
  const [otherSpecs, setOtherSpecs] = useState("");
  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed1, setComplete1] = useState(false);
  const [completed2, setComplete2] = useState(false);
  const [recipient_name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [pn, setPhone] = useState("");
  const [shipping, setShipping] = useState("");
  const [recipient_notes, setRNotes] = useState("");

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const handleSpecsChange = (event: SelectChangeEvent) => {
    setSpecs(event.target.value);
  };

  const handleColorChange = (event: SelectChangeEvent) => {
    setColor(event.target.value);
  };

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const buyDeploy = () => {
    if (activeStep === 0) {
      setComplete1(true);
      setActiveStep(1);
    }
  };

  const buyHold = () => {
    setComplete1(true);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setType("");
        setSpecs("");
        setColor("");
        setNotes("");
        setName("");
        setAddress("");
        setEmail("");
        setPhone("");
        setShipping("");
        setRNotes("");
        setActiveStep(0);
        setComplete1(false);
        handleClose();
      }}
    >
      <Box sx={style}>
        <Typography variant="h5">New Purchase - {brand}</Typography>
        <Divider />
        <CardMedia
          image={imgSrc}
          title={"laptop"}
          component="img"
          height="175px"
          sx={{
            objectFit: "contain",
            paddingTop: "15px",
          }}
        />
        <Stepper activeStep={activeStep} sx={{ paddingTop: "10px" }}>
          <Step key="Device" completed={completed1}>
            <StepLabel>
              <Typography>Device</Typography>
            </StepLabel>
          </Step>
          <Step completed={completed2}>
            <StepLabel
              optional={<Typography variant="caption">Optional</Typography>}
            >
              <Typography>Recipient</Typography>
            </StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && (
          <>
            <FormControl fullWidth sx={textFieldStyle} required size="small">
              <InputLabel id="type-select-label">Device Type</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select"
                label="Device Type"
                onChange={handleTypeChange}
                value={type}
                required
              >
                {types &&
                  Object.keys(types).map((brandtype) => {
                    return <MenuItem value={brandtype}>{brandtype}</MenuItem>;
                  })}
              </Select>
            </FormControl>
            <FormControl
              fullWidth
              sx={textFieldStyle}
              required
              size="small"
              disabled={type === ""}
            >
              <InputLabel id="specs-select-label">Specs</InputLabel>
              <Select
                labelId="specs-select-label"
                id="specs-select"
                label="Specs"
                onChange={handleSpecsChange}
                value={specs}
                required
              >
                {type !== "" &&
                  types[type].specs.map((spec: string) => {
                    return <MenuItem value={spec}>{spec}</MenuItem>;
                  })}
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            {specs === "Other" && (
              <TextField
                label="Other Specs"
                sx={textFieldStyle}
                fullWidth
                size="small"
                required
                onChange={(event) => setOtherSpecs(event.target.value)}
              />
            )}
            <FormControl
              fullWidth
              sx={textFieldStyle}
              required
              size="small"
              disabled={type === ""}
            >
              <InputLabel id="color-select-label">Color</InputLabel>
              <Select
                labelId="color-select-label"
                id="color-select"
                label="Color"
                onChange={handleColorChange}
                value={color}
                required
              >
                {type !== "" &&
                  types[type].colors.map((color: string) => {
                    return <MenuItem value={color}>{color}</MenuItem>;
                  })}
              </Select>
            </FormControl>
            <TextField
              label="Notes"
              sx={textFieldStyle}
              fullWidth
              size="small"
              onChange={(event) => setNotes(event.target.value)}
            />
            <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
            <FormControlLabel
              control={<Checkbox required onChange={handleChecked} />}
              label={
                <div>
                  By checking this box, I agree to have Spoke generate a quote
                  on my behalf.
                </div>
              }
            />
          </>
        )}
        {activeStep === 1 && (
          <>
            <TextField
              label="Recipient Name"
              sx={textFieldStyle}
              fullWidth
              size="small"
              onChange={(event) => setName(event.target.value)}
              required
            />
            <TextField
              label="Address"
              sx={textFieldStyle}
              fullWidth
              size="small"
              onChange={(event) => setAddress(event.target.value)}
              required
            />
            <TextField
              label="Email"
              sx={textFieldStyle}
              fullWidth
              size="small"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <TextField
              label="Phone Number"
              sx={textFieldStyle}
              fullWidth
              size="small"
              onChange={(event) => setPhone(event.target.value)}
              required
            />
            <TextField
              label="Shipping Rate"
              sx={textFieldStyle}
              fullWidth
              size="small"
              onChange={(event) => setShipping(event.target.value)}
              required
            />
            <TextField
              label="Notes"
              sx={textFieldStyle}
              fullWidth
              size="small"
              onChange={(event) => setRNotes(event.target.value)}
            />
          </>
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{
            marginTop: "10px",
            borderRadius: "999em 999em 999em 999em",
            textTransform: "none",
          }}
          disabled={
            ((!checked || specs === "" || color === "" || type === "") &&
              activeStep === 0) ||
            (activeStep == 1 &&
              (recipient_name === "" ||
                address === "" ||
                email === "" ||
                pn === "" ||
                shipping === ""))
          }
          onClick={buyDeploy}
        >
          Buy & Deploy Now
        </Button>
        {activeStep === 0 && (
          <Button
            fullWidth
            variant="outlined"
            sx={{
              marginTop: "10px",
              borderRadius: "999em 999em 999em 999em",
              textTransform: "none",
            }}
            color="secondary"
            disabled={!checked || specs === "" || color === "" || type === ""}
            onClick={buyHold}
          >
            Buy & Hold in Inventory
          </Button>
        )}
      </Box>
    </Modal>
  );
};

export default PurchaseModal;