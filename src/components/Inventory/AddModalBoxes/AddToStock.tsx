import React, { useState } from "react";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";
import { manageLaptop, getInventory } from "../../../services/inventoryAPI";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
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
}

const AddToStock = (props: StockProps) => {
  const { quantity, device_location, device_name, status, date_requested } =
    props;

  const [open, setOpen] = useState(false);
  const [serial_numbers, setSNs] = useState(Array(quantity).fill(""));
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  const addToStock = async () => {
    const accessToken = await getAccessTokenSilently();
    const reqBody = {
      client: "FLYR",
      status,
      device_name,
      device_location,
      date_requested,
      serial_numbers,
    };
    const stockRes = await manageLaptop(accessToken, reqBody, "addtostock");

    if (stockRes.status === "Success") {
      const inventoryResult = await getInventory(accessToken, "FLYR");
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
