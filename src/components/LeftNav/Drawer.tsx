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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
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
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ApprovalIcon from "@mui/icons-material/Approval";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SignpostIcon from "@mui/icons-material/Signpost";
import Slack from "../common/icons/Slack";
// import { useLocation } from "react-router-dom";
import ManageOrder from "../Orders/ManageOrder";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import { updateEntity } from "../../app/store";
import AppContainer from "../AppContainer/AppContainer";
import { standardGet } from "../../services/standard";
import { RootState } from "../../app/store";
import { entityMappings } from "../../app/utility/constants";
import { navMappings } from "../../utilities/mappings";
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
  Misc: JSX.Element;
  Marketplace: JSX.Element;
  Approvals: JSX.Element;
  Invite: JSX.Element;
  Roadmap: JSX.Element;
  "Add to Slack": JSX.Element;
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
  Misc: <MiscellaneousServicesIcon />,
  Marketplace: <ShoppingCartIcon />,
  Approvals: <ApprovalIcon />,
  Invite: <PersonAddIcon />,
  Roadmap: <SignpostIcon />,
  "Add to Slack": <Slack />,
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
  const [links, setLinks] = useState<string[]>([
    "Orders",
    "Inventory",
    "Storefront",
  ]);
  const [entity, setEntity] = useState("");
  const [popupText, setPopupText] = useState("");

  const dispatch = useDispatch();

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const roles = useSelector((state: RootState) => state.client.roles);

  const allowed_pages = useSelector(
    (state: RootState) => state.client.allowed_pages
  );
  const entities = useSelector((state: RootState) => state.client.entities);
  // const navigate = useNavigate();

  const isDarkTheme = useTheme().palette.mode === "dark";

  const { getAccessTokenSilently, logout, user } = useAuth0();

  const container =
    respwindow !== undefined ? () => respwindow().document.body : undefined;

  useEffect(() => {
    // if (clientData === "Roivant") {
    //   setLinks(navMappings[clientData][roles[0]]);
    //   if (roles[0] === "manager") {
    //     gotoPage("Invite");
    //   }
    // }
    if (allowed_pages.length > 0) {
      setLinks(allowed_pages);
    } else if (navMappings[clientData]) {
      setLinks(navMappings[clientData]);
    }
  }, [clientData]);

  const hasEntity = () => {
    if (clientData === "spokeops") {
      if (entityMappings[selectedClientData]) {
        return entityMappings[selectedClientData];
      }
    } else if (
      entityMappings[clientData] &&
      roles?.length > 0 &&
      roles?.indexOf("admin") > -1
    ) {
      return entityMappings[clientData];
    }
    return false;
  };

  const drawerContent = (
    <>
      <List>
        {links.map((text, index) => (
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
          {/* <a
            href="https://slack.com/oauth/v2/authorize?scope=commands%2Cusers%3Aread%2Cusers%3Aread.email%2Cchat%3Awrite%2Cchannels%3Aread%2Capp_mentions%3Aread&amp;user_scope=&amp;redirect_uri=https%3A%2F%2Fspoke-admin-dev.azurewebsites.net%2F&amp;client_id=2122873212368.5093004197398"
            style={{
              alignItems: "center",
              color: "#000",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              display: "inline-flex",
              fontFamily: "Lato, sans-serif",
              fontSize: "14px",
              fontWeight: "600",
              height: "44px",
              justifyContent: "center",
              textDecoration: "none",
              width: "204px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "16px", width: "16px", marginRight: "12px" }}
              viewBox="0 0 122.8 122.8"
            >
              <path
                d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
                fill="#e01e5a"
              ></path>
              <path
                d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
                fill="#36c5f0"
              ></path>
              <path
                d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
                fill="#2eb67d"
              ></path>
              <path
                d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
                fill="#ecb22e"
              ></path>
            </svg>
            Add to Slack
          </a> */}
          <ListItem>
            <ListItemButton href="https://slack.com/oauth/v2/authorize?scope=commands%2Cusers%3Aread%2Cusers%3Aread.email%2Cchat%3Awrite%2Cchannels%3Aread%2Capp_mentions%3Aread&amp;user_scope=&amp;redirect_uri=https%3A%2F%2Fspoke-admin-dev.azurewebsites.net%2Fslack%2Fredirect&amp;client_id=2122873212368.5093004197398">
              <ListItemIcon>{iconMapping["Add to Slack"]}</ListItemIcon>
              <ListItemText primary={"Add to Slack"} />
            </ListItemButton>
          </ListItem>
          {["Support", "Roadmap", "Logout"].map((text) => (
            <ListItem
              key={text}
              className="noVerticalPadding"
              id={text + "-leftnav"}
            >
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
            {popupText === ""
              ? "Please reach out to info@withspoke.com to set up a storefront."
              : popupText}
          </Typography>
        </Box>
      </Modal>
    </>
  );

  useEffect(() => {
    if (clientData) {
      switch (window.location.pathname.substring(1)) {
        case "orders":
          setIndex(links.indexOf("Orders"));
          break;
        case "inventory":
          setIndex(links.indexOf("Inventory"));
          break;
        case "team":
          setIndex(4);
          break;
        case "misc":
          setIndex(links.indexOf("Misc"));
          break;
        case "marketplace":
          setIndex(links.indexOf("Marketplace"));
          break;
        case "approvals":
          setIndex(links.indexOf("Approvals"));
          break;
        case "invite":
          setIndex(links.indexOf("Invite"));
          break;
        default:
          setIndex(0);
          break;
      }
    }
  }, [window.location.pathname, links]);

  const gotoPage = (title: string): void => {
    switch (title) {
      case "Overview":
        window.location.href = "/";
        break;
      case "Orders":
        AppContainer.navigate("/orders");
        setIndex(links.indexOf("Orders"));
        break;
      case "Inventory":
        AppContainer.navigate("/inventory");
        setIndex(links.indexOf("Inventory"));
        break;
      case "Misc":
        AppContainer.navigate("/misc");
        setIndex(links.indexOf("Misc"));
        break;
      case "Marketplace":
        AppContainer.navigate("/marketplace");
        setIndex(links.indexOf("Marketplace"));
        break;
      case "Approvals":
        AppContainer.navigate("/approvals");
        setIndex(links.indexOf("Approvals"));
        break;
      case "Invite":
        AppContainer.navigate("/invite");
        setIndex(links.indexOf("Invite"));
        break;
      case "Storefront":
        if (
          clientData === "public" ||
          (clientData === "spokeops" && selectedClientData === "public")
        ) {
          window.open("https://withspoke.com/demo", "_blank");
        } else if (
          clientData === "FLYR" ||
          (clientData === "spokeops" && selectedClientData === "FLYR")
        ) {
          window.open("https://www.withspoke.com/flyr-ab", "_blank");
        } else if (
          clientData === "Intersect Power" ||
          (clientData === "spokeops" &&
            selectedClientData === "Intersect Power")
        ) {
          window.open("https://withspoke.com/intersectpower", "_blank");
        } else if (
          clientData === "Alma" ||
          (clientData === "spokeops" && selectedClientData === "Alma")
        ) {
          window.open("https://withspoke.com/alma", "_blank");
        } else if (
          clientData === "Automox" ||
          (clientData === "spokeops" && selectedClientData === "Automox")
        ) {
          window.open("https://withspoke.com/automox-ab", "_blank");
        } else if (
          clientData === "Flo Health" ||
          (clientData === "spokeops" && selectedClientData === "Flo Health")
        ) {
          if (entity === "UK") {
            window.open("https://withspoke.com/flo-health-uk", "_blank");
          } else if (entity === "Lithuania") {
            window.open("https://withspoke.com/flo-health-lt", "_blank");
          } else if (entity === "Netherlands") {
            window.open("https://withspoke.com/flo-health-nl", "_blank");
          } else {
            setPopupText("Please select an entity first.");
            setOpen(true);
          }
        } else if (clientData === "Roivant") {
          window.open("https://withspoke.com/roivant-ab", "_blank");
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
          await standardGet(accessToken, "resetdata");
        } catch (e) {
          console.error("Error in resetting device");
        }
        logout({ returnTo: window.location.origin });
        break;
      case "Support":
        setModalOpen(true);
        break;
      case "Roadmap":
        window.open("https://app.loopedin.io/spoke#/roadmap", "_blank");
        break;
      default:
        break;
    }
  };

  const handleEntityChange = (event: SelectChangeEvent) => {
    let entityValue = event.target.value;
    setEntity(entityValue);

    if (entityValue === "All") {
      entityValue = "";
    }
    dispatch(updateEntity(entityValue));
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
        {entities.length > 0 && (
          <FormControl
            size="small"
            variant="standard"
            sx={{ paddingLeft: "32px", paddingRight: "20px" }}
          >
            <InputLabel
              id="client-select-label"
              sx={{ paddingLeft: "32px", paddingRight: "20px" }}
            >
              Organization
            </InputLabel>
            <Select
              labelId="client-select-label"
              value={entity}
              label="Organization"
              onChange={handleEntityChange}
            >
              {entities.map((e: any) => (
                <MenuItem value={e}>{e}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {drawerContent}
        <div className="bottom-version">
          <Typography fontSize="10px">Version 1.9.1</Typography>
        </div>
      </Drawer>
    </>
  );
};

export default SpokeDrawer;
