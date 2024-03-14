import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NewClient from "./NewClient";
import MarketplaceOrders from "./MarketplaceOrders/MarketplaceOrders";
import ViewUsers from "./Users/ViewUsers";
import EditMarketplace from "./EditMarketplace/EditMarketplace";
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
              <Button
                variant="contained"
                onClick={() => setView("newclient")}
                sx={buttonPadding}
              >
                <PersonAddIcon sx={{ paddingRight: "5px" }} />
                Add New Client
              </Button>
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
                onClick={() => setView("viewusers")}
                sx={buttonPadding}
              >
                <ListAltIcon sx={{ paddingRight: "5px" }} />
                View Users
              </Button>
              <Button
                variant="contained"
                onClick={() => setView("editmarketplace")}
                sx={buttonPadding}
              >
                <AddShoppingCartIcon sx={{ pr: "5px" }} />
                Edit Marketplace
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
          {view === "newclient" && <NewClient handleClose={handleClose} />}
          {view === "marketplace" && (
            <MarketplaceOrders handleClose={handleClose} />
          )}
          {view === "viewusers" && <ViewUsers handleClose={handleClose} />}
          {view === "editmarketplace" && (
            <EditMarketplace handleClose={handleClose} />
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
