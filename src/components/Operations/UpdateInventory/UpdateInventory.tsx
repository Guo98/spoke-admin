import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Grid,
  FormControl,
  SelectChangeEvent,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Button,
  LinearProgress,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useAuth0 } from "@auth0/auth0-react";
import { entityMappings } from "../../../app/utility/constants";
import { standardGet, standardPost } from "../../../services/standard";
import UpdateCollapse from "./UpdateCollapse";
import NewDeviceRow from "./NewDeviceRow";

interface UpdateProps {
  handleClose: Function;
}

const UpdateInventory = (props: UpdateProps) => {
  const { handleClose } = props;

  const [client, setClient] = useState("");
  const [entity, setEntity] = useState("");
  const [inventory, setInventory] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [inventoryIndex, setInventoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [newdata, setNewdata] = useState<any>([]);
  const [addrow, setAddrow] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const getInventory = async (route: string) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    const resp = await standardGet(accessToken, route);

    if (resp.data.length > 0) {
      setInventory(resp.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (client !== "") {
      let route = "getInventory/" + client;
      if (entity !== "") {
        route = route + "/" + entity;
      }

      getInventory(route).catch();
    }
  }, [client, entity]);

  useEffect(() => {}, [newdata]);

  const handleChange = (event: SelectChangeEvent) => {
    setClient(event.target.value);
    setEntity("");
  };

  const handleEntityChange = (event: SelectChangeEvent) => {
    setEntity(event.target.value);
  };

  const editDevice = (deviceIndex: number) => {
    setInventoryIndex(deviceIndex);
    setPage(1);
  };

  const updatePage2Data = (updated_data: any) => {
    let newData = [...inventory];
    newData[inventoryIndex] = updated_data;
    setInventory(newData);
  };

  const handleSubmitChange = async (
    sn: string,
    device_index: number,
    updated_status = "",
    updated_sn = "",
    updated_fn = "",
    updated_ln = "",
    grade = ""
  ) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    const body = {
      client,
      device_id: inventory[inventoryIndex].id,
      serial_number: sn,
      device_index,
      updated_status,
      updated_fn,
      updated_ln,
      updated_sn,
      grade,
    };

    const postResp = await standardPost(accessToken, "updateinventory", body);

    if (postResp.status === "Successful") {
      updatePage2Data(postResp.data);
    }

    setLoading(false);
  };

  const handleAddNewDevices = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    const body = {
      client,
      device_id: inventory[inventoryIndex].id,
      new_devices: newdata,
    };

    const postResp = await standardPost(accessToken, "addinventory", body);

    if (postResp.status === "Successful") {
      updatePage2Data(postResp.data);
    }
    setNewdata([]);
    setLoading(false);
  };

  const handleDeleteRow = async (sn: string, device_index: number) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    const body = {
      client,
      device_id: inventory[inventoryIndex].id,
      serial_number: sn,
      device_index,
    };

    const postResp = await standardPost(accessToken, "deleteinventory", body);

    if (postResp.status === "Successful") {
      updatePage2Data(postResp.data);
    }
    setLoading(false);
  };

  const addToList = (new_device: object) => {
    setNewdata((prevData: any) => [...prevData, new_device]);
    setAddrow(false);
  };

  const deleteFromList = (index: number) => {
    if (index === 0 && newdata.length === 1) {
      setNewdata([]);
    } else {
      setNewdata(newdata.splice(index, 1));
    }
  };

  const addRow = () => {
    setAddrow(true);
  };

  return (
    <Box>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={10}>
          <Typography>
            <h3>Update Inventory</h3>
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            onClick={() => {
              setEntity("");
              setClient("");
            }}
            disabled={page !== 0}
          >
            <ClearAllIcon />
          </IconButton>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      {page === 0 && (
        <FormControl fullWidth size="small" sx={{ paddingBottom: "15px" }}>
          <InputLabel id="client-select-label">Client</InputLabel>
          <Select
            labelId="client-select-label"
            value={client}
            label="Client"
            onChange={handleChange}
          >
            <MenuItem value="public">Mock</MenuItem>
            <MenuItem value="FLYR">FLYR</MenuItem>
            <MenuItem value="Bowery">Bowery</MenuItem>
            <MenuItem value="NurseDash">NurseDash</MenuItem>
            <MenuItem value="Intersect Power">Intersect Power</MenuItem>
            <MenuItem value="Hidden Road">Hidden Road</MenuItem>
            <MenuItem value="Alma">Alma</MenuItem>
            <MenuItem value="Automox">Automox</MenuItem>
            <MenuItem value="Flo Health">Flo Health</MenuItem>
          </Select>
        </FormControl>
      )}
      {page === 0 && client === "" && (
        <Typography textAlign="center">
          Select a client to get started
        </Typography>
      )}
      {page === 0 && client !== "" && entityMappings[client] && (
        <FormControl fullWidth size="small" sx={{ paddingBottom: "15px" }}>
          <InputLabel id="entity-select-label">Entity</InputLabel>
          <Select
            labelId="entity-select-label"
            value={entity}
            label="Entity"
            onChange={handleEntityChange}
          >
            {entityMappings[client].map((en: string) => (
              <MenuItem value={en}>{en}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {loading && <LinearProgress />}
      {client !== "" && page === 0 && (
        <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Device</TableCell>
                <TableCell>Location</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.length > 0 &&
                inventory.map((device: any, index: number) => {
                  return (
                    <TableRow>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell align="right">
                        <Button onClick={() => editDevice(index)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {page === 1 && (
        <>
          <Typography sx={{ paddingBottom: "15px" }}>
            Editing {inventory[inventoryIndex].name} at{" "}
            {inventory[inventoryIndex].location}
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Condition</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory[inventoryIndex].serial_numbers.length > 0 &&
                  inventory[inventoryIndex].serial_numbers.map(
                    (sn: any, index: number) => (
                      <UpdateCollapse
                        sn={sn.sn}
                        condition={sn.condition}
                        status={sn.status}
                        first_name={sn.first_name}
                        last_name={sn.last_name}
                        index={index}
                        submitChanges={handleSubmitChange}
                        handleDelete={handleDeleteRow}
                      />
                    )
                  )}
                {newdata.length > 0 &&
                  newdata.map((newdevice: any, index: number) => (
                    <NewDeviceRow
                      edit={false}
                      {...newdevice}
                      index={index}
                      handleData={deleteFromList}
                    />
                  ))}
                {addrow && <NewDeviceRow handleData={addToList} edit={true} />}
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Button size="small" onClick={addRow} disabled={addrow}>
                      Add Device
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction="row" spacing={3} justifyContent="space-between">
            <Button
              onClick={() => {
                setPage(0);
                setInventoryIndex(-1);
              }}
              sx={{ marginTop: "25px" }}
            >
              Back
            </Button>
            {newdata.length > 0 && (
              <Button onClick={handleAddNewDevices}>Add New Devices</Button>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default UpdateInventory;
