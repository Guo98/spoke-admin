import React, { useState } from "react";
import Box from "@mui/material/Box";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  IconButton,
  Stack,
  Card,
  CardMedia,
  CardContent,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Grid,
  TextField,
  Divider,
  Button,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import { InventorySummary } from "../../../interfaces/inventory";

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

interface TopUpProps {
  devices: InventorySummary[];
  addToRequestList: Function;
}

interface DevicesType {
  name: string;
  quantity: number;
  image_source: string | undefined;
  cpu: string;
  hard_drive: string;
  ram: string;
  location: string;
  hidden: boolean;
}

const TopUp = (props: TopUpProps) => {
  const { devices, addToRequestList } = props;
  const [selectedDevices, setDevices] = useState<DevicesType[]>([]);
  const [devicesState, setDevicesState] = useState(devices);
  const [deviceIndex, setDeviceIndex] = useState("");
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isDarkTheme = useTheme().palette.mode === "dark";

  const handleChange = (event: SelectChangeEvent) => {
    setDeviceIndex(event.target.value as string);
  };

  const addToDevices = () => {
    const deviceIntIndex = parseInt(deviceIndex);
    const {
      name,
      image_source,
      specs: { cpu, hard_drive, ram } = { cpu: "", hard_drive: "", ram: "" },
      location,
    } = devicesState[deviceIntIndex];

    const deviceObj: DevicesType = {
      name,
      quantity,
      image_source,
      cpu,
      hard_drive,
      ram,
      location,
      hidden: true,
    };

    setDevices((prevDevices) => [...prevDevices, deviceObj]);
    addToRequestList({ name, quantity, location });
    setAdding(false);
    setDeviceIndex("");
    setQuantity(1);

    setDevicesState((prevDevState) => {
      return prevDevState.map((item, index) => {
        if (index === deviceIntIndex) {
          return { ...item, hidden: true };
        } else {
          return { ...item };
        }
      });
    });
  };

  const editQuantityField = (index: number) => {
    setDevices((prevDevices) => {
      prevDevices[index].hidden = false;
      return [...prevDevices];
    });
  };

  const editQuantity = (index: number, newQuantity: number) => {
    setDevices((prevDevices) => {
      prevDevices[index].quantity = newQuantity;
      return [...prevDevices];
    });
  };

  const removeItem = (index: number) => {
    setDevicesState((prevDevState) => {
      const updatedDevState = prevDevState.map((item) => {
        if (
          item.location === selectedDevices[index].location &&
          item.name === selectedDevices[index].name
        ) {
          item.hidden = false;
        }
        return { ...item };
      });

      return updatedDevState;
    });
    setDevices(selectedDevices.filter((dev, i) => i !== index));
  };

  return (
    <Box>
      {selectedDevices.length > 0 && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            flexDirection: "column",
            height: 250,
            overflow: "hidden",
            overflowY: "scroll",
          }}
        >
          {selectedDevices.length > 0 &&
            selectedDevices.map((device, index) => {
              const {
                image_source,
                name,
                cpu,
                ram,
                hard_drive,
                location,
                hidden,
                quantity,
              } = device;

              return (
                <div
                  className={
                    selectedDevices.length - 1 !== index ? "bottom-padding" : ""
                  }
                >
                  <Card sx={{ display: "flex" }} component={Paper}>
                    <CardMedia
                      component="img"
                      sx={{ width: 150, objectFit: "contain" }}
                      image={image_source}
                      alt="laptop"
                    />
                    <CardContent>
                      <Grid
                        container
                        spacing={2}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Grid item xs={9} sx={{ verticalAlign: "middle" }}>
                          <Typography fontWeight="bold" fontSize="14px">
                            {name}
                          </Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            size="small"
                            type="number"
                            hiddenLabel
                            disabled={hidden}
                            value={quantity}
                            defaultValue={quantity}
                            onChange={(event) =>
                              editQuantity(index, parseInt(event.target.value))
                            }
                          />
                        </Grid>
                      </Grid>
                      <div>
                        <Typography
                          display="inline"
                          component="span"
                          fontWeight="bold"
                          fontSize="12px"
                        >
                          CPU:{" "}
                        </Typography>
                        <Typography
                          display="inline"
                          component="span"
                          fontSize="12px"
                        >
                          {cpu}
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          display="inline"
                          component="span"
                          fontWeight="bold"
                          fontSize="12px"
                        >
                          RAM:{" "}
                        </Typography>
                        <Typography
                          display="inline"
                          component="span"
                          fontSize="12px"
                        >
                          {ram}
                        </Typography>
                      </div>
                      <div>
                        <Typography
                          display="inline"
                          component="span"
                          fontWeight="bold"
                          fontSize="12px"
                        >
                          SSD:{" "}
                        </Typography>
                        <Typography
                          display="inline"
                          component="span"
                          fontSize="12px"
                        >
                          {hard_drive}
                        </Typography>
                      </div>
                      <Typography fontSize="12px">{location}</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={3}>
                          <Button
                            size="small"
                            onClick={() => editQuantityField(index)}
                            disabled={!hidden}
                          >
                            Edit
                          </Button>
                        </Grid>
                        <Grid item xs={3}>
                          <Button
                            size="small"
                            onClick={() => removeItem(index)}
                          >
                            Remove
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
        </Box>
      )}
      {adding && (
        <>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <FormControl fullWidth sx={textFieldStyle}>
                <InputLabel id="device-type-label">
                  Select device and quantity to top up:
                </InputLabel>
                <Select
                  labelId="device-type-label"
                  id="manage-select-standard"
                  value={deviceIndex}
                  onChange={handleChange}
                  label="Select device and quantity to top up:"
                >
                  {devicesState?.length > 0 &&
                    devicesState.map((device, index) => {
                      if (!device.hidden && !device.new_device) {
                        return (
                          <MenuItem value={index}>
                            {device.name}, {device.location}
                          </MenuItem>
                        );
                      }
                    })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <TextField
                variant="outlined"
                sx={textFieldStyle}
                type="number"
                defaultValue={5}
                required
                InputProps={{
                  inputProps: { min: 1 },
                }}
                onChange={(event) => setQuantity(parseInt(event.target.value))}
              />
            </Grid>
            <Grid item xs={2}>
              {deviceIndex !== "" ? (
                <>
                  <IconButton
                    disableRipple
                    onClick={addToDevices}
                    color="primary"
                  >
                    <AddCircleIcon fontSize="large" />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    disableRipple
                    onClick={() => setAdding(false)}
                    color="error"
                  >
                    <CancelIcon fontSize="large" />
                  </IconButton>
                </>
              )}
            </Grid>
          </Grid>
          <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
        </>
      )}
      <Stack>
        <IconButton disableRipple onClick={() => setAdding(true)}>
          <AddCircleIcon
            fontSize="large"
            sx={{ color: isDarkTheme ? "white" : "black" }}
          />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default TopUp;
