import React, { useState } from "react";
import {
  Modal,
  Button,
  Box,
  Typography,
  TextField,
  Stack,
  LinearProgress,
  Alert,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { standardPost } from "../../../services/standard";

interface NewProps {
  client: string;
  entity: string;
  refresh: Function;
}

const NewDeviceModal = (props: NewProps) => {
  const { client, entity, refresh } = props;
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState("");
  const [sku, setSKU] = useState("");
  const [screen, setScreen] = useState("");
  const [cpu, setCPU] = useState("");
  const [ram, setRAM] = useState("");
  const [ssd, setSSD] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    let addObj = {
      client,
      device,
      location,
      screen,
      cpu,
      ram,
      ssd,
      entity,
      sku,
    };

    const postResp = await standardPost(accessToken, "inventory", addObj);

    if (postResp.status === "Success") {
      setSuccess(true);
      props.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <Button
        sx={{ marginY: 2 }}
        onClick={() => {
          setOpen(true);
        }}
      >
        Add New Device
      </Button>
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
          <Typography>
            Add a New Device for {client}
            {entity !== "" && ` (${entity})`}:
          </Typography>
          {success && (
            <Alert severity="success">Device successfully added!</Alert>
          )}
          {!loading ? (
            <>
              <TextField
                label="Device Name"
                size="small"
                required
                onChange={(e) => setDevice(e.target.value)}
                value={device}
                fullWidth
                sx={{ marginTop: 2 }}
              />
              <TextField
                label="SKU"
                size="small"
                required
                onChange={(e) => setSKU(e.target.value)}
                value={sku}
                fullWidth
                sx={{ marginTop: 2 }}
              />
              <TextField
                label="Location"
                size="small"
                required
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                fullWidth
                sx={{ marginTop: 2 }}
              />
              <Typography sx={{ paddingTop: 2 }}>Specs:</Typography>
              <Stack direction="row" spacing={2} sx={{ paddingTop: 2 }}>
                <TextField
                  label="Screen Size"
                  size="small"
                  required
                  onChange={(e) => setScreen(e.target.value)}
                  value={screen}
                />
                <TextField
                  label="CPU"
                  size="small"
                  required
                  onChange={(e) => setCPU(e.target.value)}
                  value={cpu}
                />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ paddingTop: 2 }}>
                <TextField
                  label="RAM"
                  size="small"
                  required
                  onChange={(e) => setRAM(e.target.value)}
                  value={ram}
                />
                <TextField
                  label="SSD"
                  size="small"
                  required
                  onChange={(e) => setSSD(e.target.value)}
                  value={ssd}
                />
              </Stack>
              <Button
                variant="contained"
                sx={{ marginTop: 2 }}
                fullWidth
                onClick={handleAdd}
              >
                Add
              </Button>
            </>
          ) : (
            <LinearProgress />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default NewDeviceModal;
