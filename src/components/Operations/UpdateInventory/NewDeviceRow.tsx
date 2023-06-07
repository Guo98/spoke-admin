import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  Button,
  Stack,
} from "@mui/material";

interface NewProps {
  handleData: Function;
  addToList?: Function;
  edit: boolean;
  sn?: string;
  condition?: string;
  status?: string;
  full_name?: string;
  index?: number;
}

const NewDeviceRow = (props: NewProps) => {
  const { handleData, edit } = props;
  const [condition, setCondition] = useState("");
  const [status, setStatus] = useState("");
  const [sn, setSN] = useState("");
  const [fn, setFN] = useState("");
  const [ln, setLN] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setCondition(event.target.value);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handleSave = () => {
    let newDeviceBody: any = {
      sn,
      status,
      condition,
    };

    if (status === "Deployed") {
      newDeviceBody.first_name = fn;
      newDeviceBody.last_name = ln;
      newDeviceBody.full_name = fn + " " + ln;
    }
    handleData(newDeviceBody);
  };

  const handleDelete = () => {
    handleData(props.index);
  };

  return edit ? (
    <TableRow>
      <TableCell>
        <TextField
          label="Serial Number"
          size="small"
          onChange={(e) => setSN(e.target.value)}
        />
      </TableCell>
      <TableCell>
        <FormControl fullWidth size="small">
          <InputLabel id="condition-select-label">Condition</InputLabel>
          <Select
            labelId="condition-select-label"
            value={condition}
            label="Condition"
            onChange={handleChange}
          >
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Used">Used</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <FormControl fullWidth size="small">
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            value={status}
            label="Status"
            onChange={handleStatusChange}
          >
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Deployed">Deployed</MenuItem>
            <MenuItem value="Offboard">Offboard</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      {status === "Deployed" ? (
        <TableCell>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              label="First Name"
              onChange={(e) => setFN(e.target.value)}
            />
            <TextField
              size="small"
              label="Last Name"
              onChange={(e) => setLN(e.target.value)}
            />
          </Stack>
        </TableCell>
      ) : (
        <TableCell></TableCell>
      )}
      <TableCell align="right">
        <Button size="small" onClick={handleSave}>
          Save
        </Button>
      </TableCell>
    </TableRow>
  ) : (
    <TableRow>
      <TableCell sx={{ color: "#98fb98" }}>{props.sn!}</TableCell>
      <TableCell sx={{ color: "#98fb98" }}>{props.condition!}</TableCell>
      <TableCell sx={{ color: "#98fb98" }}>{props.status!}</TableCell>
      <TableCell sx={{ color: "#98fb98" }}>
        {props.status! === "Deployed" ? props.full_name! : ""}
      </TableCell>
      <TableCell align="right">
        <Button onClick={handleDelete}>Delete</Button>
      </TableCell>
    </TableRow>
  );
};

export default NewDeviceRow;
