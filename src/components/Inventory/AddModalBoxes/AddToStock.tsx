import React, { useState } from "react";
import { Button, Modal, Box, TextField, Typography, Grid } from "@mui/material";
import { standardPost, standardGet } from "../../../services/standard";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { updateInventory } from "../../../app/slices/inventorySlice";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

interface StockProps {
  quantity: number;
  device_name: string;
  device_location: string;
  status: string;
  date_requested: string;
  new_device?: boolean;
  id: string;
}

const AddToStock = (props: StockProps) => {
  const { quantity, device_location, device_name, status, date_requested, id } =
    props;
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const [open, setOpen] = useState(false);
  const [serial_numbers, setSNs] = useState(Array(quantity).fill(""));
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [screen, setScreen] = useState("");
  const [ram, setRam] = useState("");
  const [cpu, setCpu] = useState("");
  const [storage, setStorage] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  const addToStock = async () => {
    const accessToken = await getAccessTokenSilently();
    const reqBody = {
      client: selectedClientData,
      status,
      device_name,
      device_location,
      date_requested,
      serial_numbers,
      specs: {},
      id,
    };

    if (props.new_device) {
      reqBody.specs = {
        screen_size: screen,
        ram,
        cpu,
        hard_drive: storage,
      };
    }

    const stockRes = await standardPost(accessToken, "addtostock", reqBody);

    if (stockRes.status === "Success") {
      let route = `inventory/${selectedClientData}`;

      const inventoryResult = await standardGet(accessToken, route);
      dispatch(updateInventory(inventoryResult.data));
      setSuccess(true);
    } else {
      setError(true);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add to Stock
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {!success && !error ? (
            <>
              {props.new_device && (
                <>
                  <Typography>Enter Specs:</Typography>
                  <Grid container spacing={2}>
                    <Grid item>
                      <TextField
                        label="Screen Size"
                        size="small"
                        onChange={(e) => setScreen(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="RAM"
                        size="small"
                        onChange={(e) => setRam(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item>
                      <TextField
                        label="CPU"
                        size="small"
                        onChange={(e) => setCpu(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Storage"
                        size="small"
                        onChange={(e) => setStorage(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              <Typography>Enter Serial Numbers:</Typography>
              {Array.from({ length: quantity }, (_, index) => {
                return (
                  <TextField
                    fullWidth
                    label={`Serial Number #${index + 1}`}
                    sx={{ marginBottom: 1 }}
                    size="small"
                    onChange={(event) => {
                      const curSNs = [...serial_numbers];
                      curSNs[index] = event.target.value;
                      setSNs(curSNs);
                    }}
                  />
                );
              })}
              <Button variant="contained" fullWidth onClick={addToStock}>
                Add to Stock
              </Button>
            </>
          ) : error ? (
            <>
              <Typography>Error</Typography>
            </>
          ) : (
            <>
              <Typography>Success</Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AddToStock;
