import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Box } from "@mui/material";
import Inventory from "../Inventory/Inventory";
import Orders from "../Orders/Orders";
import Logout from "../Login/Logout";
import OperationsMisc from "../Operations/OperationsMisc";
import Marketplace from "../Marketplace/Marketplace";
import Approvals from "../Approvals/Approvals";
import InviteUsers from "../Invite/InviteUsers";
import SpokeDrawer from "../LeftNav/Drawer";
import MainInventory from "../Inventory/MainInventory";
import MainOrders from "../Orders/MainOrders";

const AppContainer = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Box
          component="nav"
          sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
        >
          <SpokeDrawer />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, paddingBottom: "125px" }}>
          <Orders />
        </Box>
      </>
    ),
  },
  {
    path: "/misc",
    element: (
      <>
        <Box
          component="nav"
          sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
        >
          <SpokeDrawer />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, paddingBottom: "125px" }}>
          <OperationsMisc />
        </Box>
      </>
    ),
  },
  {
    path: "/orders",
    element: (
      <>
        <Box
          component="nav"
          sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
        >
          <SpokeDrawer />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, paddingBottom: "125px" }}>
          <Orders />
        </Box>
      </>
    ),
  },
  {
    path: "/neworders",
    element: (
      <>
        <Box
          component="nav"
          sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
        >
          <SpokeDrawer />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, paddingBottom: "125px" }}>
          <MainOrders />
        </Box>
      </>
    ),
  },
  {
    path: "/inventory",
    element: (
      <>
        <Box
          component="nav"
          sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
        >
          <SpokeDrawer />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, paddingBottom: "125px" }}>
          <Inventory />
        </Box>
      </>
    ),
  },
  {
    path: "/newinventory",
    element: (
      <>
        <Box
          component="nav"
          sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
        >
          <SpokeDrawer />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, paddingBottom: "125px" }}>
          <MainInventory />
        </Box>
      </>
    ),
  },
  {
    path: "/marketplace",
    element: (
      <>
        <Box
          component="nav"
          sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
        >
          <SpokeDrawer />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, paddingBottom: "125px" }}>
          <Marketplace />
        </Box>
      </>
    ),
  },
  {
    path: "/approvals",
    element: (
      <>
        <Box
          component="nav"
          sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
        >
          <SpokeDrawer />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, paddingBottom: "125px" }}>
          <Approvals />
        </Box>
      </>
    ),
  },
  {
    path: "/invite",
    element: (
      <>
        <Box
          component="nav"
          sx={{ width: { sm: "20%" }, flexShrink: { sm: 0 } }}
        >
          <SpokeDrawer />
        </Box>
        <Box component="main" sx={{ flexGrow: 1, paddingBottom: "125px" }}>
          <InviteUsers />
        </Box>
      </>
    ),
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

export default AppContainer;
