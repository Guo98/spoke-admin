import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Inventory from "../Inventory/Inventory";
import Orders from "../Orders/Orders";
import Logout from "../Login/Logout";
import OperationsMisc from "../Operations/OperationsMisc";

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
