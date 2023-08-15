import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from "@mui/material";
import DeviceSelection from "./DeviceSelection";
import RecipientForm from "./RecipientForm";

interface MPProps {
  open: boolean;
  handleClose: Function;
  imgSrc: string;
  types: any;
  brand: string;
  client: string;
}

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

const MarketplacePurchase = (props: MPProps) => {
  const { open, handleClose, imgSrc, types, brand, client } = props;

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed1, setComplete1] = useState(false);
  const [completed2, setComplete2] = useState(false);

  const [device_name, setDeviceName] = useState("");
  const [device_specs, setDeviceSpecs] = useState("");
  const [device_url, setDeviceURL] = useState("");
  const [region, setRegion] = useState("");

  const completeDeviceStep = (
    dn: string,
    ds: string,
    du: string = "",
    region: string
  ) => {
    setActiveStep(1);
    setComplete1(true);
    setDeviceName(dn);
    setDeviceSpecs(ds);
    setDeviceURL(du);
    setRegion(region);
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
          <>
            <DeviceSelection
              types={types}
              brand={brand}
              setLoading={setLoading}
              completeDeviceChoice={completeDeviceStep}
            />
          </>
        )}
        {activeStep === 1 && (
          <RecipientForm
            completeRecipientStep={completeDeploymentStep}
            device_name={device_name}
            device_specs={device_specs}
            device_url={device_url}
            client={client}
            setParentLoading={setLoading}
            region={region}
          />
        )}
      </Box>
    </Modal>
  );
};

export default MarketplacePurchase;
