import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Item } from "../../interfaces/orders";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ManageProps {
  order_no: number;
  name: string;
  items: Item[];
}

const ManageOrder = (props: ManageProps) => {
  const { order_no, name, items } = props;
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="contained"
        sx={{
          borderRadius: "999em 999em 999em 999em",
          height: "32px",
          width: "116px",
          textTransform: "none",
        }}
        onClick={() => setOpen(true)}
      >
        Manage
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <h4>Need Help with Order #{order_no}? Contact Spoke:</h4>
          <TextField label="Subject" variant="standard" fullWidth />
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={3}
            variant="standard"
          />
          <div className="support-button-padding">
            <Button variant="contained">Submit</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ManageOrder;
