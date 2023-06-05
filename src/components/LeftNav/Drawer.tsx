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
import { useLocation } from "react-router-dom";
import ManageOrder from "../Orders/ManageOrder";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import { updateEntity } from "../../app/store";
import AppContainer from "../AppContainer/AppContainer";
import { resetData } from "../../services/inventoryAPI";
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
  const location = useLocation();

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const roles = useSelector((state: RootState) => state.client.roles);
  // const navigate = useNavigate();

  const isDarkTheme = useTheme().palette.mode === "dark";

  const { getAccessTokenSilently, logout, user } = useAuth0();

  const container =
    respwindow !== undefined ? () => respwindow().document.body : undefined;

  useEffect(() => {
    if (navMappings[clientData]) setLinks(navMappings[clientData]);
  }, [clientData]);

  // useEffect(() => {
  //   if (selectedClientData !== "Intersect Power" && clientData === "spokeops") {
  //     setLinks([
  //       "Orders",
  //       "Inventory",
  //       "Storefront",
  //       "Marketplace",
  //       "Approvals",
  //       "Misc",
  //     ]);
  //   } else if (clientData === "spokeops") {
  //     setLinks(["Orders", "Storefront", "Misc"]);
  //   }
  // }, [selectedClientData]);

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
            {popupText === ""
              ? "Please reach out to info@withspoke.com to set up a storefront."
              : popupText}
          </Typography>
        </Box>
      </Modal>
    </>
  );

  useEffect(() => {
    switch (window.location.pathname.substring(1)) {
      case "orders":
        setIndex(navMappings[clientData].indexOf("Orders"));
        break;
      case "inventory":
        setIndex(navMappings[clientData].indexOf("Inventory"));
        break;
      case "invoices":
        setIndex(navMappings[clientData].indexOf("Invoices"));
        break;
      case "team":
        setIndex(4);
        break;
      case "misc":
        setIndex(navMappings[clientData].indexOf("Misc"));
        break;
      case "marketplace":
        setIndex(navMappings[clientData].indexOf("Marketplace"));
        break;
      case "approvals":
        setIndex(navMappings[clientData].indexOf("Approvals"));
        break;
      case "invite":
        setIndex(navMappings[clientData].indexOf("Invite"));
        break;
      default:
        setIndex(0);
        break;
    }
  }, [window.location.pathname]);

  const gotoPage = (title: string): void => {
    switch (title) {
      case "Overview":
        window.location.href = "/";
        break;
      case "Orders":
        AppContainer.navigate("/orders");
        setIndex(navMappings[clientData].indexOf("Orders"));
        break;
      case "Inventory":
        AppContainer.navigate("/inventory");
        setIndex(navMappings[clientData].indexOf("Inventory"));
        break;
      case "Misc":
        AppContainer.navigate("/misc");
        setIndex(navMappings[clientData].indexOf("Misc"));
        break;
      case "Marketplace":
        AppContainer.navigate("/marketplace");
        setIndex(navMappings[clientData].indexOf("Marketplace"));
        break;
      case "Approvals":
        AppContainer.navigate("/approvals");
        setIndex(navMappings[clientData].indexOf("Approvals"));
        break;
      case "Invoices":
        window.location.href = "/invoices";
        setIndex(navMappings[clientData].indexOf("Invoices"));
        break;
      case "Team":
        window.location.href = "/team";
        break;
      case "Invite":
        AppContainer.navigate("/invite");
        setIndex(navMappings[clientData].indexOf("Invite"));
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
          if (
            entity === "FLYR Poland" ||
            entity === "FLYR EU" ||
            (roles?.length > 0 &&
              (roles[0] === "flyr-eu" || roles[0] === "flyr-poland"))
          ) {
            window.open("https://withspoke.com/flyrlabs-eu", "_blank");
          } else if (
            entity === "Pribas EU" ||
            (roles?.length > 0 && roles[0] === "pribas-eu")
          ) {
            window.open("https://withspoke.com/pribas", "_blank");
          } else {
            window.open("https://withspoke.com/flyrlabs", "_blank");
          }
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
          window.open("https://withspoke.com/automox", "_blank");
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
        {hasEntity() && (
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
              {hasEntity().map((e: any) => (
                <MenuItem value={e}>{e}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {drawerContent}
        <div className="bottom-version">
          <Typography fontSize="10px">Version 1.3.0-beta</Typography>
        </div>
      </Drawer>
    </>
  );
};

export default SpokeDrawer;
