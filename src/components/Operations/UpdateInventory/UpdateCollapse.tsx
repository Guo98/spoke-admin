import React, { useState, useEffect } from "react";
import {
  Box,
  Collapse,
  TableRow,
  TableCell,
  Button,
  TextField,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Divider,
} from "@mui/material";
import DateInput from "../../common/DateInput";

interface UpdateProps {
  sn: string;
  condition: string;
  status: string;
  first_name?: string;
  last_name?: string;
  index: number;
  warehouse?: string;
  submitChanges: Function;
  handleDelete: Function;
  date_deployed?: string;
  device_name?: string;
  device_id?: string;
  price?: string;
  supplier?: string;
  purchase_date?: string;
  filtered_device_index?: number;
}

const UpdateCollapse = (props: UpdateProps) => {
  const {
    sn,
    condition,
    status,
    first_name,
    last_name,
    submitChanges,
    index,
    warehouse,
    date_deployed,
  } = props;

  const [open, setOpen] = useState(false);
  const [updateSN, setSN] = useState(sn);
  const [updateStatus, setStatus] = useState(status);
  const [updateFN, setFN] = useState(first_name || "");
  const [updateLN, setLN] = useState(last_name || "");
  const [grade, setGrade] = useState("");
  const [updatedCondition, setCondition] = useState(condition);
  const [updatedWarehouse, setWarehouse] = useState(warehouse ? warehouse : "");
  const [updatedDate, setDate] = useState(date_deployed || "");
  const [updatedSupplier, setSupplier] = useState(props.supplier || "");
  const [updatedPrice, setPrice] = useState(props.price || "");
  const [updatedPurchaseDate, setPurchaseDate] = useState(
    props.purchase_date || ""
  );

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus((event.target as HTMLInputElement).value);
  };

  const handleConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCondition((event.target as HTMLInputElement).value);
  };

  const handleWarehouseChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setWarehouse((event.target as HTMLInputElement).value);
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
      updatedCondition !== condition ? updatedCondition : "",
      updatedWarehouse !== warehouse ? updatedWarehouse : "",
      updatedDate !== date_deployed ? updatedDate : "",
      props.device_id ? props.device_id : "",
      updatedSupplier !== props.supplier ? updatedSupplier : "",
      updatedPrice !== props.price ? updatedPrice : "",
      updatedPurchaseDate !== props.purchase_date ? updatedPurchaseDate : ""
    );
  };

  const handle_delete = async () => {
    await props.handleDelete(sn, index, props.filtered_device_index);
    setOpen(false);
  };

  const handleClose = () => {
    setSN(sn);
    setStatus(status);
    setLN(last_name || "");
    setFN(first_name || "");
    setGrade("");
    setCondition(condition);
    setDate(date_deployed || "");
    setSupplier(props.supplier || "");
    setPrice(props.price || "");
    setPurchaseDate(props.purchase_date || "");
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
            <Box sx={{ my: 2 }}>
              <Stack direction="column" spacing={2}>
                <Divider textAlign="left">Device Info:</Divider>
                {props.device_name && (
                  <div>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                      fontSize="110%"
                    >
                      Device:{" "}
                    </Typography>
                    <Typography
                      display="inline"
                      component="span"
                      fontSize="110%"
                    >
                      {props.device_name}
                    </Typography>
                  </div>
                )}
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
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <TextField
                    size="small"
                    label="Supplier"
                    value={updatedSupplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="Purchase Price"
                    value={updatedPrice}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <DateInput
                    label="Purchase Date"
                    initial_date={updatedPurchaseDate}
                    handleChange={setPurchaseDate}
                  />
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  pt={2}
                >
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
                        control={
                          <Radio checked={updateStatus === "In Stock"} />
                        }
                        label="In Stock"
                      />
                      <FormControlLabel
                        value="Deployed"
                        control={
                          <Radio checked={updateStatus === "Deployed"} />
                        }
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
                    <DateInput
                      label="Date Deployed"
                      initial_date={updatedDate}
                      handleChange={setDate}
                    />
                  )}
                </Stack>
                {(status === "Deployed" || updateStatus === "Deployed") && (
                  <>
                    <Divider textAlign="left">Deployed Info:</Divider>
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
                    <FormControlLabel
                      value="End of Life"
                      control={
                        <Radio checked={updatedCondition === "End of Life"} />
                      }
                      label="End of Life"
                    />
                  </RadioGroup>
                </FormControl>
                {updateStatus === "In Stock" && (
                  <FormControl>
                    <FormLabel id="radio-group-warehouse-label">
                      Warehouse
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-group-warehouse-label"
                      name="status-radio-buttons-group-warehouse"
                      value={warehouse}
                      onChange={handleWarehouseChange}
                    >
                      <FormControlLabel
                        value="CTS"
                        control={<Radio checked={updatedWarehouse === "CTS"} />}
                        label="CTS"
                      />
                      <FormControlLabel
                        value="CDW"
                        control={<Radio checked={updatedWarehouse === "CDW"} />}
                        label="CDW"
                      />
                      <FormControlLabel
                        value="Eurotel"
                        control={
                          <Radio checked={updatedWarehouse === "Eurotel"} />
                        }
                        label="Eurotel"
                      />
                      <FormControlLabel
                        value="ARP"
                        control={<Radio checked={updatedWarehouse === "ARP"} />}
                        label="ARP"
                      />
                      <FormControlLabel
                        value="CDW UK"
                        control={
                          <Radio checked={updatedWarehouse === "CDW UK"} />
                        }
                        label="CDW UK"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    disabled={
                      sn === updateSN &&
                      status === updateStatus &&
                      first_name === updateFN &&
                      last_name === updateLN &&
                      condition === updatedCondition &&
                      date_deployed === updatedDate &&
                      props.price === updatedPrice &&
                      props.purchase_date === updatedPurchaseDate &&
                      props.supplier === updatedSupplier
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
                      condition === updatedCondition &&
                      date_deployed === updatedDate &&
                      props.price === updatedPrice &&
                      props.purchase_date === updatedPurchaseDate &&
                      props.supplier === updatedSupplier
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
