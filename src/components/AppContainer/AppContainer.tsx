import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Inventory from "../Inventory/Inventory";
import Orders from "../Orders/Orders";
import Logout from "../Login/Logout";
import OperationsMisc from "../Operations/OperationsMisc";
import Marketplace from "../Marketplace/Marketplace";
import Approvals from "../Approvals/Approvals";
import InviteUsers from "../Invite/InviteUsers";

const AppContainer = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Orders />
      </>
    ),
  },
  {
    path: "/misc",
    element: (
      <>
        <OperationsMisc />
      </>
    ),
  },
  {
    path: "/orders",
    element: (
      <>
        <Orders />
      </>
    ),
  },
  {
    path: "/inventory",
    element: (
      <>
        <Inventory />
      </>
    ),
  },
  {
    path: "/marketplace",
    element: (
      <>
        <Marketplace />
      </>
    ),
  },
  {
    path: "/approvals",
    element: (
      <>
        <Approvals />
      </>
    ),
  },
  {
    path: "/invite",
    element: (
      <>
        <InviteUsers />
      </>
    ),
  },
  {
    path: "/invoices",
    element: <div>Invoices Page</div>,
  },
  {
    path: "/team",
    element: <div>Team Page</div>,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
]);

export default AppContainer;
