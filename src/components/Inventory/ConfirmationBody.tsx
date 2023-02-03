import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

interface ConfirmationProps {
  conType: string;
  name: string;
  success?: boolean;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

const ConfirmationBody = (props: ConfirmationProps) => {
  const { success } = props;
  return (
    <Box sx={style}>
      <Typography
        id="confirmation-modal-title"
        variant="h5"
        component="h3"
        textAlign="center"
      >
        {!success
          ? "There was an error submitting your order"
          : "Your order has been received"}
      </Typography>
      <div className="center">
        {!success ? (
          <ErrorIcon sx={{ height: "10%", width: "10%", color: "red" }} />
        ) : (
          <CheckCircleIcon
            sx={{ color: "#06BE08", height: "10%", width: "10%" }}
          />
        )}
      </div>
      <Typography textAlign="center">
        {!success ? "Please try again later." : "Thank you for your order!"}
      </Typography>
      {success && (
        <Typography textAlign="center">
          You'll received a confirmation email with your order details.
        </Typography>
      )}
    </Box>
  );
};

export default ConfirmationBody;
