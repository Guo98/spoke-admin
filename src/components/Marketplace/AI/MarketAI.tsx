import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
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
  overflowY: "scroll",
};

interface MarketAIProps {
  open: boolean;
  handleClose: Function;
  imgSrc: string;
  types: any;
  brand: string;
  client: string;
}

const MarketAI = (props: MarketAIProps) => {
  const { open, handleClose, brand, types, client } = props;

  const { user, getAccessTokenSilently } = useAuth0();

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed1, setComplete1] = useState(false);
  const [completed2, setComplete2] = useState(false);
  const [device_name, setDeviceName] = useState("");
  const [device_specs, setDeviceSpecs] = useState("");
  const [device_url, setDeviceURL] = useState("");
  const [status, setStatus] = useState(-1);

  const completeDeviceStep = (dn: string, ds: string, du: string) => {
    setActiveStep(1);
    setComplete1(true);
    setDeviceName(dn);
    setDeviceSpecs(ds);
    setDeviceURL(du);
  };

  const completeDeploymentStep = () => {
    setComplete2(true);
    setLoading(true);
  };

  return (
    <Modal
      onClose={() => {
        if (!loading) {
          handleClose();
        }

        if (completed1 && completed2) {
          setActiveStep(0);
          setComplete1(false);
          setComplete2(false);
        }
      }}
      open={open}
    >
      <Box sx={style}>
        <Typography variant="h5" fontWeight="bold">
          New Purchase - {brand}
        </Typography>
        <Stepper activeStep={activeStep} sx={{ paddingTop: "10px" }}>
          <Step key="Device" completed={completed1}>
            <StepLabel>
              <Typography>Device</Typography>
            </StepLabel>
          </Step>
          <Step completed={completed2}>
            <StepLabel>
              <Typography>Deployment</Typography>
            </StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && (
          // <CheckStock
          //   types={types}
          //   setLoading={setLoading}
          //   brand={brand}
          //   completeDeviceChoice={completeDeviceStep}
          // /><>
          <></>
        )}
      </Box>
    </Modal>
  );
};

export default MarketAI;
