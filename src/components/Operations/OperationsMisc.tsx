import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NewClient from "./NewClient";
import MarketplaceOrders from "./MarketplaceOrders";
import InviteUsers from "./InviteUsers";

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
                <ListAltIcon sx={{ paddingRight: "5px" }} />
                View Marketplace Orders
              </Button>
              <Button
                variant="contained"
                onClick={() => setView("inviteusers")}
              >
                <PersonAddIcon sx={{ paddingRight: "5px" }} />
                Invite Users
              </Button>
            </>
          )}
          {view === "marketplace" && (
            <MarketplaceOrders handleClose={handleClose} />
          )}
          {view === "inviteusers" && <InviteUsers handleClose={handleClose} />}
        </Box>
      </Box>
    </>
  );
};

export default OperationsMisc;
