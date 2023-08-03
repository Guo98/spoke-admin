import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  IconButton,
  Modal,
  Box,
  LinearProgress,
  Typography,
  TextField,
  Stack,
  Button,
  Chip,
  Alert,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import { standardPatch } from "../../../services/standard";

interface AProps {
  type: string;
  client: string;
  id?: string;
  brand?: string;
  device_type?: string;
  refresh: Function;
}

const AddNew = (props: AProps) => {
  const { type, client, refresh } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(-1);
  const [brand, setBrand] = useState("");
  const [device_type, setType] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([]);
  const [screen, setScreen] = useState("");
  const [cpu, setCPU] = useState("");
  const [ram, setRAM] = useState("");
  const [ssd, setSSD] = useState("");
  const [item, setItem] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const handleClose = () => {
    setOpen(false);
  };

  const addNewBrand = async () => {
    setLoading(true);

    const patchObj = {
      client,
      id: props.id,
      brand: brand,
      update_type: "addbrand",
    };

    await addNewPatch(patchObj);

    setLoading(false);
  };

  const addNewType = async () => {
    setLoading(true);
    const patchObj = {
      client,
      id: props.id,
      brand: props.brand,
      device_type,
      colors,
      update_type: "addtype",
    };
    await addNewPatch(patchObj);
    setLoading(false);
  };

  const addNewSpec = async () => {
    setLoading(true);
    const patchObj = {
      client,
      id: props.id,
      brand: props.brand,
      device_type: props.device_type,
      specs: { screen_size: screen, cpu, ram, ssd },
      update_type: "addspec",
      locations,
    };
    await addNewPatch(patchObj);
    setLoading(false);
  };

  const addNewItem = async () => {
    setLoading(true);
    const patchObj = {
      client,
      update_type: "newitem",
      type: item,
    };
    await addNewPatch(patchObj);
    setLoading(false);
  };

  const addNewPatch = async (body: any) => {
    const accessToken = await getAccessTokenSilently();
    const patchResp = await standardPatch(accessToken, "marketplace", body);

    if (patchResp.status !== "Successful") {
      setStatus(1);
    } else {
      setStatus(0);
      await refresh();
    }
  };

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <AddCircleIcon />
      </IconButton>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            bgcolor: "background.paper",
            borderRadius: "20px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography align="center">Add a new {type}</Typography>
          {loading && <LinearProgress />}
          {status !== -1 && (
            <Alert severity={status === 1 ? "error" : "success"}>
              {status === 1 ? "Error..." : "Success!"}
            </Alert>
          )}
          <Stack spacing={2} sx={{ marginTop: 2 }}>
            {type === "item" && (
              <>
                <TextField
                  label="Item"
                  value={item}
                  fullWidth
                  size="small"
                  onChange={(e) => {
                    setItem(e.target.value);
                  }}
                />
                <Button onClick={addNewItem}>Add Item</Button>
              </>
            )}
            {type === "brand" && !loading && (
              <>
                <TextField
                  label="Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  size="small"
                  fullWidth
                />
                <Button onClick={addNewBrand}>Add Brand</Button>
              </>
            )}
            {type === "type" && !loading && (
              <>
                <TextField
                  label="Device Type"
                  value={device_type}
                  onChange={(e) => setType(e.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Colors (comma separated)"
                  onChange={(e) => setColors(e.target.value.split(","))}
                  size="small"
                  fullWidth
                />
                <Button onClick={addNewType}>Add Type</Button>
              </>
            )}
            {type === "spec" && !loading && (
              <>
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    label="Screen Size"
                    value={screen}
                    onChange={(e) => setScreen(e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="CPU"
                    value={cpu}
                    onChange={(e) => setCPU(e.target.value)}
                  />
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextField
                    size="small"
                    label="RAM"
                    value={ram}
                    onChange={(e) => setRAM(e.target.value)}
                  />
                  <TextField
                    size="small"
                    label="SSD"
                    value={ssd}
                    onChange={(e) => setSSD(e.target.value)}
                  />
                </Stack>
                <TextField
                  label="Locations"
                  InputProps={{
                    startAdornment: (
                      <>
                        {locations.map((loc) => (
                          <Chip
                            label={loc}
                            onDelete={() => {
                              const locIndex = locations.indexOf(loc);
                              locations.splice(locIndex, 1);
                              setLocations([...locations]);
                            }}
                          />
                        ))}
                      </>
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={() => {
                          setLocations([...locations, location]);
                          setLocation("");
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    ),
                  }}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setLocations([...locations, location]);
                      setLocation("");
                    }
                  }}
                  size="small"
                  fullWidth
                  value={location}
                />
                <Button onClick={addNewSpec}>Add Spec</Button>
              </>
            )}
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default AddNew;
