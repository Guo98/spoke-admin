import React, { useState } from "react";
import {
  Box,
  Collapse,
  TableRow,
  TableCell,
  Button,
  TextField,
  Grid,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
} from "@mui/material";

interface UpdateProps {
  sn: string;
  condition: string;
  status: string;
  first_name?: string;
  last_name?: string;
  index: number;
  submitChanges: Function;
  handleDelete: Function;
}

const UpdateCollapse = (props: UpdateProps) => {
  const { sn, condition, status, first_name, last_name, submitChanges, index } =
    props;
  const [open, setOpen] = useState(false);
  const [updateSN, setSN] = useState(sn);
  const [updateStatus, setStatus] = useState(status);
  const [updateFN, setFN] = useState(first_name || "");
  const [updateLN, setLN] = useState(last_name || "");
  const [grade, setGrade] = useState("");
  const [updatedCondition, setCondition] = useState(condition);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus((event.target as HTMLInputElement).value);
  };

  const handleConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCondition((event.target as HTMLInputElement).value);
  };

  const submit_changes = async () => {
    await submitChanges(
      sn,
      index,
      updateStatus !== status ? updateStatus : "",
      updateSN !== sn ? updateSN : "",
      updateFN !== first_name ? updateFN : "",
      updateLN !== last_name ? updateLN : "",
      grade,
      updatedCondition !== condition ? updatedCondition : ""
    );
  };

  const handle_delete = async () => {
    await props.handleDelete(sn, index);
    setOpen(false);
  };

  const handleClose = () => {
    setSN(sn);
    setStatus(status);
    setLN(last_name || "");
    setFN(first_name || "");
    setGrade("");
    setCondition(condition);
  };

  return (
    <>
      <TableRow>
        <TableCell>{sn}</TableCell>
        <TableCell>{condition}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>
          {status === "Deployed" && first_name && last_name
            ? first_name + " " + last_name
            : ""}
        </TableCell>
        <TableCell align="right">
          <Button
            onClick={() => {
              if (open) handleClose();
              setOpen(!open);
            }}
          >
            {!open ? "Edit" : "Done"}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} sx={{ paddingTop: 0, paddingBottom: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ marginY: 1 }}>
              <Stack direction="column" spacing={2}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  size="small"
                  defaultValue={sn}
                  value={updateSN}
                  onChange={(e) => {
                    setSN(e.target.value);
                  }}
                />
                <FormControl>
                  <FormLabel id="radio-group-label">Status</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="radio-group-label"
                    name="status-radio-buttons-group"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <FormControlLabel
                      value="In Stock"
                      control={<Radio checked={updateStatus === "In Stock"} />}
                      label="In Stock"
                    />
                    <FormControlLabel
                      value="Deployed"
                      control={<Radio checked={updateStatus === "Deployed"} />}
                      label="Deployed"
                    />
                    <FormControlLabel
                      value="Offboard"
                      control={
                        <Radio
                          checked={
                            updateStatus === "Offboard" ||
                            updateStatus === "Offboarding"
                          }
                        />
                      }
                      label="Offboard"
                    />
                  </RadioGroup>
                </FormControl>
                {(status === "Deployed" || updateStatus === "Deployed") && (
                  <>
                    <Typography>Deployed Info:</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <TextField
                        size="small"
                        label="First Name"
                        fullWidth
                        defaultValue={updateFN}
                        onChange={(e) => setFN(e.target.value)}
                        disabled={updateStatus === "In Stock"}
                      />
                      <TextField
                        size="small"
                        label="Last Name"
                        fullWidth
                        defaultValue={updateLN}
                        onChange={(e) => setLN(e.target.value)}
                        disabled={updateStatus === "In Stock"}
                      />
                    </Stack>
                  </>
                )}
                {(condition === "Used" ||
                  updatedCondition === "Used" ||
                  updatedCondition === "Damaged") && (
                  <TextField
                    label="Grade"
                    size="small"
                    fullWidth
                    onChange={(e) => setGrade(e.target.value)}
                  />
                )}
                <FormControl>
                  <FormLabel id="radio-group-condition-label">
                    Condition
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="radio-group-condition-label"
                    name="status-radio-buttons-group-condition"
                    value={condition}
                    onChange={handleConditionChange}
                  >
                    <FormControlLabel
                      value="New"
                      control={<Radio checked={updatedCondition === "New"} />}
                      label="New"
                    />
                    <FormControlLabel
                      value="Used"
                      control={<Radio checked={updatedCondition === "Used"} />}
                      label="Used"
                    />
                    <FormControlLabel
                      value="Damaged"
                      control={
                        <Radio checked={updatedCondition === "Damaged"} />
                      }
                      label="Damaged"
                    />
                  </RadioGroup>
                </FormControl>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    disabled={
                      sn === updateSN &&
                      status === updateStatus &&
                      first_name === updateFN &&
                      last_name === updateLN &&
                      condition === updatedCondition
                    }
                    fullWidth
                    onClick={submit_changes}
                  >
                    Submit Changes
                  </Button>
                  <Button
                    variant="contained"
                    disabled={
                      sn === updateSN &&
                      status === updateStatus &&
                      first_name === updateFN &&
                      last_name === updateLN &&
                      condition === updatedCondition
                    }
                    onClick={handleClose}
                    fullWidth
                  >
                    Clear Changes
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    color="warning"
                    onClick={handle_delete}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default UpdateCollapse;
