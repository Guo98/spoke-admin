import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import NewClient from "./NewClient";
import MarketplaceOrders from "./MarketplaceOrders";
import ViewInvites from "./ViewInvites";
import NewMarketplaceItem from "./NewMarketplaceItem";
import UpdateInventory from "./UpdateInventory/UpdateInventory";

const boxStyle = {
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  justifyContent: "space-evenly",
};

const buttonPadding = {
  marginTop: "15px",
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
                sx={buttonPadding}
              >
                <ListAltIcon sx={{ paddingRight: "5px" }} />
                View Marketplace Orders
              </Button>
              <Button
                variant="contained"
                onClick={() => setView("inviteusers")}
                sx={buttonPadding}
              >
                <ListAltIcon sx={{ paddingRight: "5px" }} />
                View Invites
              </Button>
              <Button
                variant="contained"
                onClick={() => setView("newmarketplaceitem")}
                sx={buttonPadding}
              >
                <AddShoppingCartIcon sx={{ pr: "5px" }} />
                Add New Marketplace Item
              </Button>
              <Button
                variant="contained"
                onClick={() => setView("updateinventory")}
                sx={buttonPadding}
              >
                <InventoryIcon sx={{ pr: "5px" }} />
                Update Inventory
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
          {view === "updateinventory" && (
            <UpdateInventory handleClose={handleClose} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default OperationsMisc;
