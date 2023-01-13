import React, { FC, ReactElement, useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import GroupsIcon from "@mui/icons-material/Groups";
import TuneIcon from "@mui/icons-material/Tune";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth0 } from "@auth0/auth0-react";
import "./Drawer.css";

interface IconMapping {
  Overview: JSX.Element;
  Orders: JSX.Element;
  Inventory: JSX.Element;
  Invoices: JSX.Element;
  Team: JSX.Element;
  Settings: JSX.Element;
  Support: JSX.Element;
  "Log Out": JSX.Element;
  "Log In": JSX.Element;
}

const iconMapping: IconMapping = {
  Overview: <SummarizeIcon />,
  Orders: <SyncAltIcon />,
  Inventory: <WarehouseIcon />,
  Invoices: <RequestQuoteIcon />,
  Team: <GroupsIcon />,
  Settings: <TuneIcon />,
  Support: <SupportAgentIcon />,
  "Log Out": <LogoutIcon />,
  "Log In": <LoginIcon />,
};

const SpokeDrawer: FC = (): ReactElement => {
  const [selectedIndex, setIndex] = useState(0);

  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0();

  useEffect(() => {
    switch (window.location.pathname.substring(1)) {
      case "orders":
        setIndex(0);
        break;
      case "inventory":
        setIndex(1);
        break;
      case "invoices":
        setIndex(3);
        break;
      case "team":
        setIndex(4);
        break;
      default:
        setIndex(0);
        break;
    }
  }, []);

  const gotoPage = (title: string): void => {
    switch (title) {
      case "Overview":
        window.location.href = "/";
        break;
      case "Orders":
        window.location.href = "/orders";
        break;
      case "Inventory":
        window.location.href = "/inventory";
        break;
      case "Invoices":
        window.location.href = "/invoices";
        break;
      case "Team":
        window.location.href = "/team";
        break;
      default:
        window.location.href = "/";
        break;
    }
  };

  const footerAction = (text: string) => {
    switch (text) {
      case "Log Out":
        logout({ returnTo: window.location.origin });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        open={true}
        anchor={"left"}
        PaperProps={{ sx: { width: "20%", backgroundColor: "#F1f3f3" } }}
      >
        <div style={{ paddingLeft: "32px", paddingTop: "10px" }}>
          <img
            src="https://spokeimages.blob.core.windows.net/image/fullspokelogo.png"
            style={{ height: "44px", width: "149px", justifyContent: "center" }}
          />
        </div>
        <List>
          {["Orders", "Inventory"].map((text, index) => (
            <ListItem key={text} selected={index === selectedIndex}>
              <ListItemButton
                onClick={() => {
                  gotoPage(text);
                }}
              >
                <ListItemIcon>
                  {iconMapping[text as keyof IconMapping]}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
          <div className="bottomPush">
            {["Settings", "Support", "Log Out"].map((text) => (
              <ListItem key={text} className="noVerticalPadding">
                <ListItemButton onClick={() => footerAction(text)}>
                  <ListItemIcon>
                    {iconMapping[text as keyof IconMapping]}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </div>
        </List>
      </Drawer>
    </>
  );
};

export default SpokeDrawer;
