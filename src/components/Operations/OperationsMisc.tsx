import React from "react";
import { Typography, Box } from "@mui/material";
import NewClient from "./NewClient";

const OperationsMisc = () => {
  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Typography variant="h5" component="h3">
          Overview
        </Typography>
        <Box>
          <NewClient />
        </Box>
      </Box>
    </>
  );
};

export default OperationsMisc;
