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
} from "@mui/material";

interface PurchaseProps {
  open: boolean;
  handleClose: Function;
  imgSrc: string;
  types: any;
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
  const { open, handleClose, imgSrc, types } = props;

  const [type, setType] = useState("");
  const [specs, setSpecs] = useState("");
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState(false);

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

  return (
    <Modal open={open} onClose={() => handleClose()}>
      <Box sx={style}>
        <Typography variant="h5">New Purchase</Typography>
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
        <FormControl fullWidth sx={textFieldStyle} required size="small">
          <InputLabel id="specs-select-label">Specs</InputLabel>
          <Select
            labelId="specs-select-label"
            id="specs-select"
            label="Specs"
            onChange={handleSpecsChange}
            value={specs}
            required
          ></Select>
        </FormControl>
        <FormControl fullWidth sx={textFieldStyle} required size="small">
          <InputLabel id="color-select-label">Color</InputLabel>
          <Select
            labelId="color-select-label"
            id="color-select"
            label="Color"
            onChange={handleColorChange}
            value={color}
            required
          ></Select>
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
              By checking this box, I agree to have Spoke generate a quote on my
              behalf.
            </div>
          }
        />
        <Button
          fullWidth
          variant="contained"
          sx={{
            marginTop: "10px",
            borderRadius: "999em 999em 999em 999em",
            textTransform: "none",
          }}
        >
          Buy & Deploy Now
        </Button>
        <Button
          fullWidth
          variant="outlined"
          sx={{
            marginTop: "10px",
            borderRadius: "999em 999em 999em 999em",
            textTransform: "none",
          }}
          color="secondary"
        >
          Buy & Hold in Inventory
        </Button>
      </Box>
    </Modal>
  );
};

export default PurchaseModal;
