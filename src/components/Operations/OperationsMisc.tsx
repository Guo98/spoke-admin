import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import NewClient from "./NewClient";
import MarketplaceOrders from "./MarketplaceOrders";

const boxStyle = {
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  justifyContent: "space-evenly",
};

const OperationsMisc = () => {
  const [view, setView] = useState("");

  const handleClose = () => {
    setView("");
  };

  return (
    <>
      <Box sx={{ width: "94%", paddingLeft: "3%" }}>
        <Typography>
          <h2>Operations</h2>
        </Typography>
        <Box sx={view === "" ? boxStyle : {}}>
          {view === "" && (
            <>
              <NewClient />{" "}
              <Button
                variant="contained"
                onClick={() => setView("marketplace")}
              >
                VIew Marketplace Orders
              </Button>
            </>
          )}
          {view === "marketplace" && (
            <MarketplaceOrders handleClose={handleClose} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default OperationsMisc;
