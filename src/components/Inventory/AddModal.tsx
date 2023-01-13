import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { InventorySummary } from "../../interfaces/inventory";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

interface AddProps {
  open: boolean;
  setParentOpen: Function;
  deviceNames: InventorySummary[];
}

const AddModal = (props: AddProps) => {
  const { open, setParentOpen, deviceNames } = props;
  const [openModal, setOpen] = useState(open);

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setParentOpen(false);
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3>Add Inventory</h3>
          {deviceNames.map((device) => {
            return (
              <>
                <Grid container spacing={2} sx={{ paddingBottom: "10px" }}>
                  <Grid item xs={7}>
                    <Typography sx={{ paddingTop: "5px" }}>
                      {device.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography sx={{ paddingTop: "7px" }} fontSize="80%">
                      {device.location}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ marginBottom: "5px" }}>
                    <div className="right">
                      <TextField
                        hiddenLabel
                        variant="standard"
                        sx={{ width: "50px", input: { textAlign: "center" } }}
                        defaultValue={0}
                        type="number"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </div>
                  </Grid>
                </Grid>
              </>
            );
          })}
          <TextField fullWidth variant="standard" label="Notes" />
          <Grid container justifyContent="space-evenly" paddingTop={3}>
            <Grid item xs={12}>
              <Button className="right" variant="contained">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default AddModal;
