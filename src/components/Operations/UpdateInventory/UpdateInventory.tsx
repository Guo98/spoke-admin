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
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SearchIcon from "@mui/icons-material/Search";
import { useAuth0 } from "@auth0/auth0-react";

import { entityMappings } from "../../../app/utility/constants";
import {
  standardGet,
  standardDelete,
  standardPut,
  standardPatch,
} from "../../../services/standard";
import UpdateCollapse from "./UpdateCollapse";
import NewDeviceRow from "./NewDeviceRow";
import NewDeviceModal from "./NewDeviceModal";
import ClientDropdown from "../../common/ClientDropdown";
import LinearLoading from "../../common/LinearLoading";

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

  const [clear, setClear] = useState(false);
  const [search_text, setSearchText] = useState("");
  const [filtered_inventory, setFilteredInventory] = useState<any | null>(null);

  const { getAccessTokenSilently } = useAuth0();

  const getInventory = async () => {
    setLoading(true);
    let route = "inventory/" + client;
    if (entity !== "") {
      route = route + "/" + entity;
    }
    const accessToken = await getAccessTokenSilently();

    const resp = await standardGet(accessToken, route);

    if (resp.data.length > 0) {
      setInventory(resp.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (client !== "") {
      getInventory().catch();
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
    grade = "",
    updated_condition = "",
    updated_warehouse = "",
    updated_date = "",
    device_id = ""
  ) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    const body = {
      client,
      device_id: device_id !== "" ? device_id : inventory[inventoryIndex].id,
      serial_number: sn,
      device_index,
      updated_status,
      updated_fn,
      updated_ln,
      updated_sn,
      grade,
      updated_condition,
      updated_warehouse,
      updated_date,
    };

    const postResp = await standardPatch(accessToken, "inventory", body);

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

    const postResp = await standardPut(accessToken, "inventory", body);

    if (postResp.status === "Successful") {
      updatePage2Data(postResp.data);
    }
    setNewdata([]);
    setLoading(false);
  };

  const handleDeleteRow = async (sn: string, device_index: number) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const delete_sn = sn === "" ? "none" : sn;
    const route = `inventory/${client}/${inventory[inventoryIndex].id}/${device_index}/${delete_sn}`;
    const deleteResp = await standardDelete(accessToken, route);

    if (deleteResp.status === "Successful") {
      updatePage2Data(deleteResp.data);
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

  const search_inventory = () => {
    const lc_search = search_text.toLowerCase();

    let search_results: any[] = [];

    inventory.forEach((device: any) => {
      const filtered_devices = device.serial_numbers.filter(
        (d: any) =>
          d.sn?.toLowerCase().includes(lc_search) ||
          d.first_name?.toLowerCase().includes(lc_search) ||
          d.last_name?.toLowerCase().includes(lc_search)
      );
      if (filtered_devices.length > 0) {
        search_results = [
          ...search_results,
          ...filtered_devices.map((l: any) => {
            return {
              ...l,
              id: device.id,
              device_name: device.name,
              device_index: device.serial_numbers.findIndex(
                (dev: any) => dev.sn === l.sn
              ),
            };
          }),
        ];
      }
    });

    setFilteredInventory(search_results);
  };

  const reset_inventory = () => {
    setFilteredInventory(null);
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Typography>
          <h3>Update Inventory</h3>
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            size="small"
            label="Search"
            value={search_text}
            onChange={(e) => setSearchText(e.target.value)}
            disabled={inventory.length === 0}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                if (clear) {
                  setSearchText("");
                  reset_inventory();
                } else {
                  search_inventory();
                }
                setClear((prevClear) => !prevClear);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={"Search"}
                    disabled={inventory.length === 0}
                    onClick={() => {
                      if (clear) {
                        setSearchText("");
                        reset_inventory();
                      } else {
                        search_inventory();
                      }
                      setClear((prevClear) => !prevClear);
                    }}
                    onMouseDown={() => {
                      if (clear) {
                        setSearchText("");
                        reset_inventory();
                      } else {
                        search_inventory();
                      }
                      setClear((prevClear) => !prevClear);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        if (clear) {
                          setSearchText("");
                          reset_inventory();
                        } else {
                          search_inventory();
                        }
                        setClear((prevClear) => !prevClear);
                      }
                    }}
                    edge="end"
                  >
                    {!clear ? <SearchIcon /> : <CloseIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            onClick={() => {
              setEntity("");
              setClient("");
            }}
            disabled={page !== 0}
          >
            <ClearAllIcon />
          </IconButton>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Stack>
      {page === 0 && <ClientDropdown handleChange={handleChange} />}
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
      {loading && <LinearLoading />}
      {client !== "" && page === 0 && filtered_inventory === null && (
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
          <Stack>
            <NewDeviceModal
              client={client}
              entity={entity}
              refresh={getInventory}
            />
          </Stack>
        </TableContainer>
      )}
      {page === 1 && filtered_inventory === null && (
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
                        warehouse={sn.warehouse}
                        date_deployed={sn.date_deployed}
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
      {filtered_inventory !== null && (
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
              {filtered_inventory.length > 0 &&
                filtered_inventory.map((device: any) => {
                  return (
                    <UpdateCollapse
                      sn={device.sn}
                      condition={device.condition}
                      status={device.status}
                      first_name={device.first_name}
                      last_name={device.last_name}
                      index={device.device_index}
                      submitChanges={handleSubmitChange}
                      handleDelete={handleDeleteRow}
                      warehouse={device.warehouse}
                      date_deployed={device.date_deployed}
                      device_id={device.id}
                      device_name={device.device_name}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UpdateInventory;
