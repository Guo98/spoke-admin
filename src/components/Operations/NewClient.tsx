import React, { useState } from "react";
import { Button, Modal, Box, TextField, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const NewClient = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="contained"
        size="large"
        sx={{ marginTop: "15px" }}
      >
        <PersonAddIcon sx={{ paddingRight: "5px" }} />
        Add New Client
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography component="h6" variant="h6" textAlign="center">
            Add New Client
          </Typography>
          <TextField
            label="Client Name"
            sx={textFieldStyle}
            size="small"
            fullWidth
          />
          <Button variant="contained">Add</Button>
        </Box>
      </Modal>
    </>
  );
};

export default NewClient;
