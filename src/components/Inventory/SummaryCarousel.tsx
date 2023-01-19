import React, { useState } from "react";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const boxStyle = {
  height: 225,
};

interface CarouselProps {
  image_source: string | undefined;
  specs: {
    screen_size: string;
    ram: string;
    hard_drive: string;
    cpu: string;
  };
}

const SummaryCarousel = (props: CarouselProps) => {
  const {
    image_source,
    specs: { screen_size, ram, hard_drive, cpu },
  } = props;
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <Box sx={boxStyle}>
        <Box sx={{ height: 200 }}>
          {activeStep === 0 ? (
            <CardMedia
              sx={{ height: 200 }}
              image={image_source}
              title="laptop"
            ></CardMedia>
          ) : (
            <div className="center-align">
              <div>
                <Typography display="inline" component="span" fontWeight="bold">
                  Screen Size:{" "}
                </Typography>
                <Typography display="inline" component="span">
                  {screen_size}
                </Typography>
              </div>
              <div>
                <Typography display="inline" component="span" fontWeight="bold">
                  CPU:{" "}
                </Typography>
                <Typography display="inline" component="span">
                  {cpu}
                </Typography>
              </div>
              <div>
                <Typography display="inline" component="span" fontWeight="bold">
                  RAM:{" "}
                </Typography>
                <Typography display="inline" component="span">
                  {ram}
                </Typography>
              </div>
              <div>
                <Typography display="inline" component="span" fontWeight="bold">
                  Storage:{" "}
                </Typography>
                <Typography display="inline" component="span">
                  {hard_drive}
                </Typography>
              </div>
            </div>
          )}
        </Box>
        <MobileStepper
          position="static"
          steps={2}
          activeStep={activeStep}
          nextButton={
            <Button onClick={handleNext} disabled={activeStep === 2 - 1}>
              <KeyboardArrowRightIcon />
            </Button>
          }
          backButton={
            <Button onClick={handleBack} disabled={activeStep === 0}>
              <KeyboardArrowLeftIcon />
            </Button>
          }
          sx={{ paddingTop: 0 }}
        />
      </Box>
    </>
  );
};

export default SummaryCarousel;
