import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { standardGet } from "../../../services/standard";
import CheckStock from "./CheckStock";
import RecipientForm from "./RecipientForm";

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
  const [activeStep, setActiveStep] = useState(0);
  const [completed1, setComplete1] = useState(false);
  const [completed2, setComplete2] = useState(false);
  const [device_name, setDeviceName] = useState("");
  const [device_specs, setDeviceSpecs] = useState("");
  const [device_url, setDeviceURL] = useState("");

  const completeDeviceStep = (dn: string, ds: string, du: string) => {
    setActiveStep(1);
    setComplete1(true);
    setDeviceName(dn);
    setDeviceSpecs(ds);
    setDeviceURL(du);
  };

  const completeDeploymentStep = () => {
    setComplete2(true);
  };

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
          <CheckStock
            types={types}
            setLoading={setLoading}
            brand={brand}
            completeDeviceChoice={completeDeviceStep}
          />
        )}
        {activeStep === 1 && (
          <RecipientForm
            completeRecipientStep={completeDeploymentStep}
            device_name={device_name}
            device_specs={device_specs}
            device_url={device_url}
          />
        )}
      </Box>
    </Modal>
  );
};

export default MarketAI;
