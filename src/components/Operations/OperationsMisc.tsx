import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import NewClient from "./NewClient";
import MarketplaceOrders from "./MarketplaceOrders";
import ViewInvites from "./ViewInvites";
import NewMarketplaceItem from "./NewMarketplaceItem";

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
                <ListAltIcon sx={{ paddingRight: "5px" }} />
                View Invites
              </Button>
              <Button
                variant="contained"
                onClick={() => setView("newmarketplaceitem")}
              >
                <AddShoppingCartIcon sx={{ pr: "5px" }} />
                Add New Marketplace Item
              </Button>
            </>
          )}
          {view === "marketplace" && (
            <MarketplaceOrders handleClose={handleClose} />
          )}
          {view === "inviteusers" && <ViewInvites handleClose={handleClose} />}
          {view === "newmarketplaceitem" && (
            <NewMarketplaceItem handleClose={handleClose} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default OperationsMisc;
