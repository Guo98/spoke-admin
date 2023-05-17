import React, { useState } from "react";
import { Modal, Box, TextField, Button, Stack } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

interface DenyProps {
  open: boolean;
  handleClose: Function;
  handleDeny: Function;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};

const DenyModal = (props: DenyProps) => {
  const { open, handleClose, handleDeny } = props;

  const [reason, setReason] = useState("");

  return (
    <Modal open={open} onClose={() => handleClose()}>
      <Box sx={style}>
        <TextField
          label="Reason for Denial:"
          fullWidth
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
          }}
          required
        />
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          sx={{ pt: "10px" }}
        >
          <Button variant="outlined" fullWidth onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleDeny(false, reason)}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DenyModal;
