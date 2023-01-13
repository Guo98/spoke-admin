import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { imageMapping, ImageMapping } from "../../utilities/mappings";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

interface DeployProps {
  name: string;
  device_name: string;
  address: string;
  openModal: boolean;
}

const DeployModalContent = (props: DeployProps) => {
  const { name, device_name, address, openModal } = props;

  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h5" component="h3">
        New Deployment
      </Typography>
      <Card sx={{ display: "flex" }}>
        <CardMedia
          component="img"
          sx={{ width: 175 }}
          image={imageMapping[device_name as keyof ImageMapping]}
          alt="laptop"
        />
        <CardContent>
          <Typography sx={{ fontWeight: "bold" }}>{device_name}</Typography>
          <Typography>{name}</Typography>
          <Typography>{address}</Typography>
        </CardContent>
      </Card>
      <hr />
      <FormControlLabel
        control={<Checkbox />}
        label="By checking this box, I agree to Terms of Service"
      />
      <div className="button">
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#054ffe",
            borderRadius: "999em 999em 999em 999em",
          }}
        >
          Deploy
        </Button>
      </div>
    </Box>
  );
};

export default DeployModalContent;
