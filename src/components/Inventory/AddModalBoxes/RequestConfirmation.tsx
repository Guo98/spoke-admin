import React from "react";
import { Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface RequestProps {
  tabValue: number;
}

const RequestConfirmation = (props: RequestProps) => {
  const { tabValue } = props;
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
      {tabValue === 2 && (
        <>
          <Typography textAlign="center" paddingTop="10px" fontStyle="italic">
            Please make sure to ship to the following address:
          </Typography>
          <Typography textAlign="center">
            {atob(localStorage.getItem("spokeclient")!)}
          </Typography>
          <Typography textAlign="center">c/o Spoke Technology</Typography>
          <Typography textAlign="center">2725 Northwoods Pkwy</Typography>
          <Typography textAlign="center">Suite A-2</Typography>
          <Typography textAlign="center">Norcross, GA 30071</Typography>
          <Typography textAlign="center">United States</Typography>
        </>
      )}
    </>
  );
};

export default RequestConfirmation;
