import React, { useState } from "react";
import { Box, Typography, Divider, MobileStepper, Button } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Recommendation from "./Recommendation";

interface RecommendationsProps {
  recommendations: any;
  completeDeviceChoice: Function;
  requested_item: string;
  chosen_specs: string;
}

const Recommendations = (props: RecommendationsProps) => {
  const {
    recommendations,
    completeDeviceChoice,
    requested_item,
    chosen_specs,
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
      <Divider sx={{ my: 2 }} />
      <Typography fontWeight="bold" variant="h6" pb={2}>
        Recommended Replacements:
      </Typography>
      {recommendations.map(
        (rec: any, index: number) =>
          activeStep === index && (
            <Recommendation
              completeDeviceChoice={completeDeviceChoice}
              price={rec.price}
              specs={rec.specs}
              stock_level={rec.stock_level}
              url_link={rec.url_link}
              product_name={rec.product_name}
              image_source={rec.image_source}
              requested_item={requested_item}
              chosen_specs={chosen_specs}
            />
          )
      )}
      <MobileStepper
        position="static"
        steps={recommendations.length}
        activeStep={activeStep}
        nextButton={
          <Button
            onClick={handleNext}
            disabled={activeStep === recommendations.length - 1}
          >
            <KeyboardArrowRightIcon />
          </Button>
        }
        backButton={
          <Button onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeftIcon />
          </Button>
        }
        sx={{ paddingTop: 2 }}
      />
    </>
  );
};

export default Recommendations;
