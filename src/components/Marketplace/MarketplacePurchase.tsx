import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepConnector,
  StepIconProps,
} from "@mui/material";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import LaptopIcon from "@mui/icons-material/Laptop";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
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

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(90deg, rgba(7,79,255,1) 0%, rgba(23,110,204,1) 49%, rgba(75,137,233,1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(90deg, rgba(7,79,255,1) 0%, rgba(23,110,204,1) 49%, rgba(75,137,233,1) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 45,
  height: 45,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient(90deg, rgba(7,79,255,1) 0%, rgba(23,110,204,1) 49%, rgba(75,137,233,1) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(90deg, rgba(7,79,255,1) 0%, rgba(23,110,204,1) 49%, rgba(75,137,233,1) 100%)",
  }),
}));

function ColorStepIcon(props: StepIconProps) {
  // Add active to ownerstate if want deployment filled on form
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <LaptopIcon />,
    2: <LocalShippingIcon />,
  };

  return (
    <ColorIconRoot ownerState={{ completed }} className={className}>
      {icons[String(props.icon)]}
    </ColorIconRoot>
  );
}

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
  const [price, setPrice] = useState("");
  const [img_src, setSource] = useState("");
  const [stock_level, setStock] = useState("");

  const completeDeviceStep = (
    dn: string,
    ds: string,
    du: string = "",
    region: string,
    price: string,
    image_source: string,
    stock_level: string
  ) => {
    setActiveStep(1);
    setComplete1(true);
    setDeviceName(dn);
    setDeviceSpecs(ds);
    setDeviceURL(du);
    setRegion(region);
    setPrice(price);
    setSource(image_source);
    setStock(stock_level);
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
        <Stepper
          activeStep={activeStep}
          sx={{ paddingTop: "10px" }}
          connector={<ColorConnector />}
        >
          <Step key="Device" completed={completed1}>
            <StepLabel StepIconComponent={ColorStepIcon}>
              <Typography>Device</Typography>
            </StepLabel>
          </Step>
          <Step completed={completed2}>
            <StepLabel StepIconComponent={ColorStepIcon}>
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
            price={price}
            stock_level={stock_level}
            image_source={img_src}
          />
        )}
      </Box>
    </Modal>
  );
};

export default MarketplacePurchase;
