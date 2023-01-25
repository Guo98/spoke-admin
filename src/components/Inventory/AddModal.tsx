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
import { useAuth0 } from "@auth0/auth0-react";
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
  width: 500,
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
}

const AddModal = (props: AddProps) => {
  const { open, setParentOpen, deviceNames } = props;
  const [openModal, setOpen] = useState(open);
  const [tabValue, setTabValue] = useState(0);
  const [notes, setNotes] = useState("");
  const [requestedItems, setRequestedItems] = useState<RequestedItem[]>([]);
  const [requested, setRequested] = useState(false);
  const [checked, setChecked] = useState(false);

  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setParentOpen(false);
    setRequested(false);
    setRequestedItems([]);
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

  const requestLaptop = async () => {
    const accessToken = await getAccessTokenSilently();
    const requestObj = {
      notes,
      requestor_email: user?.email,
      name: user?.name,
      client: "Public",
      request_type:
        tabValue === 0
          ? "a top up"
          : tabValue === 1
          ? "a new device"
          : "to send a device to Spoke",
      items: requestedItems,
    };

    // console.log("request obj :::::::: ", requestObj);

    const apiResp = await manageLaptop(
      accessToken,
      requestObj,
      "/requestInventory"
    );

    if (apiResp.status === "Successful") {
      setRequested(true);
    } else {
      console.error("Error in sending email");
      setRequested(true);
    }
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
                <NewDeviceRequest addToRequestList={addToRequestList} />
              </TabPanel>
              <TabPanel value={tabValue} index={2} prefix="add-inv">
                <SendToSpoke addToRequestList={addToRequestList} />
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
                disabled={requestedItems.length === 0 || !checked}
              >
                Request
              </Button>
            </>
          ) : (
            <RequestConfirmation />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AddModal;
