import React, { useState, useEffect } from "react";
import { Modal, Box, Typography } from "@mui/material";
import { standardGet } from "../../../services/standard";
import CheckStock from "./CheckStock";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "85%", md: "50%" },
  maxHeight: { xs: "75%" },
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
};

interface MarketAIProps {
  open: boolean;
  handleClose: Function;
  imgSrc: string;
  types: any;
  brand: string;
}

const MarketAI = (props: MarketAIProps) => {
  const { open, handleClose, brand, types } = props;

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      onClose={() => {
        if (!loading) {
          handleClose();
        }
      }}
      open={open}
    >
      <Box sx={style}>
        <Typography variant="h5">New Purchase - {brand}</Typography>
        <CheckStock types={types} setLoading={setLoading} />
      </Box>
    </Modal>
  );
};

export default MarketAI;
