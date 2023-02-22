import React, { useState } from "react";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";
import { manageLaptop } from "../../../services/inventoryAPI";
import { useAuth0 } from "@auth0/auth0-react";

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
}

const AddToStock = (props: StockProps) => {
  const { quantity } = props;
  const [open, setOpen] = useState(false);
  const [serial_numbers, setSNs] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const { getAccessTokenSilently } = useAuth0();

  const addToStock = async () => {
    const accessToken = await getAccessTokenSilently();
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
          <>
            <Typography>Enter Serial Numbers:</Typography>
            {[...Array(quantity)].map((ele, index) => {
              return (
                <TextField
                  fullWidth
                  label={`Serial Number #${index + 1}`}
                  sx={{ marginBottom: 1 }}
                  size="small"
                />
              );
            })}
            <Button variant="contained" fullWidth onClick={addToStock}>
              Add to Stock
            </Button>
          </>
        </Box>
      </Modal>
    </>
  );
};

export default AddToStock;
