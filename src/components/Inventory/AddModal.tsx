import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Modal,
  Box,
  Button,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  TextField,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { InventorySummary } from "../../interfaces/inventory";
import { manageLaptop } from "../../services/inventoryAPI";
import TabPanel from "../common/TabPanel";
import TopUp from "./AddModalBoxes/TopUp";
import NewDeviceRequest from "./AddModalBoxes/NewDeviceRequest";
import RequestConfirmation from "./AddModalBoxes/RequestConfirmation";
import SendToSpoke from "./AddModalBoxes/SendToSpoke";

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

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  marginBottom: "10px",
};

function a11yProps(index: number) {
  return {
    id: `add-inv-tab-${index}`,
    "aria-controls": `add-inv-tabpanel-${index}`,
  };
}

interface AddProps {
  open: boolean;
  setParentOpen: Function;
  deviceNames: InventorySummary[];
}

interface RequestedItem {
  name: string;
  quantity: number;
  location: string;
  specifications?: string;
  color?: string;
  refurl?: string;
}

const AddModal = (props: AddProps) => {
  const { open, setParentOpen, deviceNames } = props;
  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const [openModal, setOpen] = useState(open);
  const [tabValue, setTabValue] = useState(0);
  const [notes, setNotes] = useState("");
  const [requestedItems, setRequestedItems] = useState<RequestedItem[]>([]);
  const [requested, setRequested] = useState(false);
  const [checked, setChecked] = useState(false);
  // send to spoke states
  const [deviceName, setDeviceName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [warehouse, setWarehouse] = useState("");
  // new device states
  const [specifications, setSpecifications] = useState("");
  const [color, setColor] = useState("");
  const [refurl, setRefURL] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const requestDisabled = () => {
    if (tabValue === 0) {
      return requestedItems.length === 0 || !checked;
    } else if (tabValue === 1) {
      return (
        deviceName === "" ||
        location === "" ||
        specifications === "" ||
        color === "" ||
        refurl === "" ||
        !checked
      );
    } else if (tabValue === 2) {
      return deviceName === "" || warehouse === "" || !checked;
    }
  };

  const handleClose = () => {
    setOpen(false);
    setParentOpen(false);
    setRequested(false);
    setRequestedItems([]);
    setTabValue(0);
    setChecked(false);
    setDeviceName("");
    setWarehouse("");
    setSpecifications("");
    setColor("");
    setRefURL("");
    setLocation("");
  };

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const selectLabel = () => {
    if (tabValue === 0 || tabValue === 1) {
      return "By checking this box, I agree to have Spoke procure the device on my behalf.";
    } else {
      return "By checking this box, I confirm I wish to submit inventory to Spoke.";
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const newSendDevice = () => {
    if (tabValue === 1) {
      return [
        {
          name: deviceName,
          quantity,
          location,
          specifications,
          color,
          refurl,
        },
      ];
    } else {
      return [
        {
          name: deviceName,
          quantity,
          location: warehouse,
        },
      ];
    }
  };

  const requestLaptop = async () => {
    setLoading(true);
    const client = clientData === "spokeops" ? selectedClientData : clientData;
    const accessToken = await getAccessTokenSilently();
    const requestObj = {
      notes,
      requestor_email: user?.email,
      name: user?.name,
      client: client,
      request_type:
        tabValue === 0
          ? "a top up"
          : tabValue === 1
          ? "a new device"
          : "to send a device to Spoke",
      items: tabValue === 0 ? requestedItems : newSendDevice(),
    };

    const apiResp = await manageLaptop(
      accessToken,
      requestObj,
      "/requestInventory"
    );

    if (apiResp.status === "Successful") {
      setRequested(true);
    } else {
      console.error("Error in sending email");
      setError(true);
      setRequested(true);
    }
    setLoading(false);
  };

  const addToRequestList = (device: RequestedItem) => {
    setRequestedItems((prevItems) => [...prevItems, device]);
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {!requested ? (
            <>
              <h3>Add Inventory</h3>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleChange}
                  aria-label="orders tab"
                  variant="fullWidth"
                >
                  <Tab label="Top Up" {...a11yProps(0)} />
                  <Tab label="New Device" {...a11yProps(1)} />
                  <Tab label="Send to Spoke" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0} prefix="add-inv">
                <TopUp
                  devices={deviceNames}
                  addToRequestList={addToRequestList}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1} prefix="add-inv">
                <NewDeviceRequest
                  setDeviceName={setDeviceName}
                  setSpecifications={setSpecifications}
                  setColor={setColor}
                  setLocation={setLocation}
                  setRefURL={setRefURL}
                  setQuantity={setQuantity}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2} prefix="add-inv">
                <SendToSpoke
                  setSendDeviceName={setDeviceName}
                  setWarehouse={setWarehouse}
                  setQuantity={setQuantity}
                  warehouse={warehouse}
                  quantity={quantity}
                />
              </TabPanel>
              <Divider sx={{ paddingTop: "20px", marginBottom: "10px" }} />
              <TextField
                size="small"
                sx={textFieldStyle}
                fullWidth
                label="Notes"
                onChange={(event) => setNotes(event.target.value)}
              />
              <FormControlLabel
                control={<Checkbox required onChange={handleChecked} />}
                label={<Typography fontSize="90%">{selectLabel()}</Typography>}
                sx={{ paddingBottom: "10px" }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{
                  borderRadius: "999em 999em 999em 999em",
                  textTransform: "none",
                }}
                onClick={requestLaptop}
                disabled={requestDisabled() || loading}
              >
                {!loading ? "Request" : <CircularProgress />}
              </Button>
            </>
          ) : (
            <RequestConfirmation tabValue={tabValue} />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AddModal;
