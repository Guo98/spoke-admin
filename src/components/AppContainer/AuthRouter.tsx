import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../Home/Home";

const AuthRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Home />
      </>
    ),
  },
  {
    path: "/approvals",
    element: (
      <>
        <Home />
      </>
    ),
  },
  {
    path: "/inventory",
    element: (
      <>
        <Home />
      </>
    ),
  },
]);

export default AuthRouter;
