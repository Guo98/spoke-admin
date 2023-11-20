import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

interface ReturnProps {
  back: Function;
  device_name: string;
  setRetDeviceName: Function;
  serial_number: string;
  setRetSN: Function;
  condition: string;
  setRetCondition: Function;
  activation_key: string;
  setRetActivation: Function;
  note: string;
  setRetNote: Function;
  deploy: Function;
}

const ReturnInfo = (props: ReturnProps) => {
  const {
    back,
    deploy,
    device_name,
    setRetDeviceName,
    serial_number,
    setRetSN,
    condition,
    setRetCondition,
    activation_key,
    setRetActivation,
    note,
    setRetNote,
  } = props;

  const handleConditionChange = (event: SelectChangeEvent) => {
    setRetCondition(event.target.value);
  };

  return (
    <Box sx={style}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            onClick={() => {
              back(0);
            }}
          >
            <ArrowBackIcon />
          </Button>
          <Typography variant="h6" component="h3" sx={{ fontWeight: "bold" }}>
            Return Info:
          </Typography>
        </Stack>
        <TextField
          sx={textFieldStyle}
          fullWidth
          label="Device Name"
          size="small"
          value={device_name}
          onChange={(e) => setRetDeviceName(e.target.value)}
        />
        <TextField
          sx={textFieldStyle}
          fullWidth
          label="Serial Number"
          size="small"
          value={serial_number}
          onChange={(e) => setRetSN(e.target.value)}
        />
        <FormControl fullWidth sx={textFieldStyle} size="small">
          <InputLabel id="cond-simple-select-label">Condition</InputLabel>
          <Select
            labelId="cond-simple-select-label"
            id="cond-simple-select"
            value={condition}
            label="Condition"
            onChange={handleConditionChange}
          >
            <MenuItem value="Working">Working</MenuItem>
            <MenuItem value="Damaged">Damaged</MenuItem>
          </Select>
        </FormControl>
        <TextField
          sx={textFieldStyle}
          fullWidth
          label="Activation Key"
          size="small"
          value={activation_key}
          onChange={(e) => setRetActivation(e.target.value)}
        />
        <TextField
          sx={textFieldStyle}
          fullWidth
          label="Return Note"
          size="small"
          value={note}
          onChange={(e) => setRetNote(e.target.value)}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#054ffe",
            borderRadius: "10px",
          }}
          onClick={async () => await deploy()}
        >
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default ReturnInfo;
