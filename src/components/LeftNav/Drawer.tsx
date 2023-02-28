import React, { ReactElement, useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme,
  Typography,
  Hidden,
  AppBar,
  Toolbar,
  IconButton,
  Modal,
  Box,
} from "@mui/material";
import SummarizeIcon from "@mui/icons-material/Summarize";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import GroupsIcon from "@mui/icons-material/Groups";
import TuneIcon from "@mui/icons-material/Tune";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
import StoreIcon from "@mui/icons-material/Store";
import ManageOrder from "../Orders/ManageOrder";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import AppContainer from "../AppContainer/AppContainer";
import { useNavigate } from "react-router-dom";
import { resetData } from "../../services/inventoryAPI";
import { RootState } from "../../app/store";
import "./Drawer.css";
import Profile from "../Profile/Profile";

interface IconMapping {
  Overview: JSX.Element;
  Orders: JSX.Element;
  Inventory: JSX.Element;
  Invoices: JSX.Element;
  Team: JSX.Element;
  Settings: JSX.Element;
  Support: JSX.Element;
  Logout: JSX.Element;
  "Log In": JSX.Element;
  Storefront: JSX.Element;
}

const iconMapping: IconMapping = {
  Overview: <SummarizeIcon />,
  Orders: <SyncAltIcon />,
  Inventory: <WarehouseIcon />,
  Invoices: <RequestQuoteIcon />,
  Team: <GroupsIcon />,
  Settings: <TuneIcon />,
  Support: <SupportAgentIcon />,
  Logout: <LogoutIcon />,
  "Log In": <LoginIcon />,
  Storefront: <StoreIcon />,
};

interface DrawerProps {
  respwindow?: () => Window;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

const SpokeDrawer = (props: DrawerProps): ReactElement => {
  const { respwindow } = props;
  const [selectedIndex, setIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const clientData = useSelector((state: RootState) => state.client.data);
  // const navigate = useNavigate();

  const isDarkTheme = useTheme().palette.mode === "dark";

  const { getAccessTokenSilently, logout, user } = useAuth0();

  const container =
    respwindow !== undefined ? () => respwindow().document.body : undefined;

  const drawerContent = (
    <>
      <List>
        {["Orders", "Inventory", "Storefront"].map((text, index) => (
          <ListItem key={text} selected={index === selectedIndex}>
            <ListItemButton
              onClick={() => {
                gotoPage(text);
              }}
              id={text + "-leftnav"}
            >
              <ListItemIcon>
                {iconMapping[text as keyof IconMapping]}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        <div className="bottomPush">
          {["Support", "Logout"].map((text) => (
            <ListItem key={text} className="noVerticalPadding">
              <ListItemButton onClick={async () => await footerAction(text)}>
                <ListItemIcon>
                  {iconMapping[text as keyof IconMapping]}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </div>
      </List>
      {modalOpen && (
        <ManageOrder
          email={user?.email!}
          order={false}
          footerOpen={modalOpen}
          setFooterOpen={setModalOpen}
        />
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Typography>
            Please reach out to info@withspoke.com to set up a storefront.
          </Typography>
        </Box>
      </Modal>
    </>
  );

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
        AppContainer.navigate("/orders");
        setIndex(0);
        break;
      case "Inventory":
        AppContainer.navigate("/inventory");
        setIndex(1);
        break;
      case "Invoices":
        window.location.href = "/invoices";
        break;
      case "Team":
        window.location.href = "/team";
        break;
      case "Storefront":
        if (clientData === "public" || clientData === "spokeops") {
          window.open("https://withspoke.com/demo", "_blank");
        } else if (clientData === "FLYR") {
          window.open("https://withspoke.com/flyrlabs", "_blank");
        } else {
          setOpen(true);
        }
        break;
      default:
        window.location.href = "/";
        break;
    }
  };

  const footerAction = async (text: string) => {
    switch (text) {
      case "Logout":
        const accessToken = await getAccessTokenSilently();
        try {
          await resetData(accessToken);
        } catch (e) {
          console.error("Error in resetting device");
        }
        logout({ returnTo: window.location.origin });
        break;
      case "Support":
        setModalOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Hidden mdUp>
        <AppBar position="static" sx={{ height: 56, width: "100%" }}>
          <Toolbar>
            <IconButton
              onClick={() => setMobileOpen((prevOpen) => !prevOpen)}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Spoke Technology
            </Typography>
            <Profile mobile={true} />
          </Toolbar>
        </AppBar>
      </Hidden>
      <Drawer
        variant="temporary"
        container={container}
        // ModalProps={{
        //   keepMounted: true, // Better open performance on mobile.
        // }}
        sx={{
          display: { xs: "block", sm: "none" },
        }}
        open={mobileOpen}
        onClose={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen && drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        open={true}
        anchor={"left"}
        PaperProps={{
          sx: {
            width: "20%",
            backgroundColor: isDarkTheme ? "#25282a" : "#F1f3f3",
          },
        }}
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        <div style={{ paddingLeft: "32px", paddingTop: "20px" }}>
          <img
            src={
              isDarkTheme
                ? "https://spokeimages.blob.core.windows.net/image/fullspokeinvert.png"
                : "https://spokeimages.blob.core.windows.net/image/fullspokenormal.png"
            }
            style={{
              height: "44px",
              width: "149px",
              justifyContent: "center",
            }}
          />
        </div>
        {drawerContent}
        <div className="bottom-version">
          <Typography fontSize="10px">Version 1.0.0-beta</Typography>
        </div>
      </Drawer>
    </>
  );
};

export default SpokeDrawer;
