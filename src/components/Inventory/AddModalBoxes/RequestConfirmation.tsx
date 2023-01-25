import React from "react";
import { Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const RequestConfirmation = () => {
  return (
    <>
      <Typography
        id="confirmation-modal-title"
        variant="h5"
        component="h3"
        textAlign="center"
      >
        Your request has been received
      </Typography>
      <div className="center">
        <CheckCircleIcon
          sx={{ color: "#06BE08", height: "10%", width: "10%" }}
        />
      </div>
      <Typography textAlign="center">Thank you for your request!</Typography>
      <Typography textAlign="center">
        You'll received a confirmation email with your request details.
      </Typography>
    </>
  );
};

export default RequestConfirmation;
