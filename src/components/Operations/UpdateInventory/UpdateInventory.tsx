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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useAuth0 } from "@auth0/auth0-react";
import { entityMappings } from "../../../app/utility/constants";
import { standardGet } from "../../../services/standard";
import UpdateCollapse from "./UpdateCollapse";

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
  const { getAccessTokenSilently } = useAuth0();

  const getInventory = async (route: string) => {
    const accessToken = await getAccessTokenSilently();

    const resp = await standardGet(accessToken, route);

    if (resp.data.length > 0) {
      setInventory(resp.data);
    }
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
            Editing {inventory[inventoryIndex].name}
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
                        full_name={sn.full_name}
                      />
                    )
                  )}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            onClick={() => {
              setPage(0);
              setInventoryIndex(-1);
            }}
            sx={{ paddingTop: "25px" }}
          >
            Back
          </Button>
        </>
      )}
    </Box>
  );
};

export default UpdateInventory;
