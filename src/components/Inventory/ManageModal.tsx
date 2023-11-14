import React, { useState, useEffect } from "react";
import { Stack, Box, Button, Typography, Modal } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import OffboardModal from "./OffboardModal";

import { RootState } from "../../app/store";
import { setInventory } from "../../app/slices/inventorySlice";
import { standardGet } from "../../services/standard";
import { roleMapping } from "../../utilities/mappings";
import { InventorySummary } from "../../interfaces/inventory";
import AppContainer from "../AppContainer/AppContainer";
import AssignModal from "./AssignModal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

interface ManageProps {
  devices: InventorySummary[];
}

const ManageModal = (props: ManageProps) => {
  const { devices } = props;

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const roles = useSelector((state: RootState) => state.client.roles);

  const [open, setOpen] = useState(false);
  const [client, setClient] = useState(
    clientData === "spokeops" ? selectedClientData : clientData
  );

  const [manageType, setManageType] = useState("");
  const [changeView, setChangeView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [device_names, setDeviceNames] = useState<string[]>([]);

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();

      let route = `inventory/${client}`;

      if (roles?.length > 0 && roles[0] !== "admin") {
        route = route + `/${roleMapping[roles[0]]}`;
      }

      const inventoryResult = await standardGet(accessToken, route);
      dispatch(setInventory(inventoryResult.data));
    };

    if (!open && loading) {
      fetchData().catch(console.error);
    }
  }, [open]);

  useEffect(() => {
    if (devices && devices.length > 0)
      setDeviceNames([
        ...new Set(
          devices.map((dev) => {
            return dev.name;
          })
        ),
      ]);
  }, [devices]);

  useEffect(() => {
    setClient(selectedClientData);
  }, [selectedClientData]);

  const handleOpen = () => {
    setOpen(true);
    setLoading(true);
  };
  const handleClose = () => {
    setOpen(false);
    setChangeView(false);
    setManageType("");
  };

  return (
    <div>
      <Button onClick={handleOpen} variant="contained">
        Manage
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack spacing={2}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h3"
              sx={{ textAlign: "center" }}
            >
              Manage Inventory
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="space-evenly">
              <AssignModal
                manage_modal={true}
                devices={devices}
                disabled={false}
              />
              <OffboardModal
                client={client}
                manage_modal={true}
                all_devices={device_names}
              />
              <Button
                variant="contained"
                sx={{ height: "50%", width: "25%" }}
                onClick={() => AppContainer.navigate("marketplace")}
              >
                <Stack spacing={1} alignItems="center" p={2}>
                  <ShoppingCartIcon />
                  <Typography>Buy</Typography>
                </Stack>
              </Button>
            </Stack>
          </Stack>
        </Box>
        {/* {!changeView ? (
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h5"
              component="h3"
              sx={{ textAlign: "center" }}
            >
              Manage Device
            </Typography>
            <Grid
              container
              spacing={2}
              justifyContent="space-evenly"
              sx={{ paddingTop: "15px" }}
            >
              <Grid item xs={10}>
                <FormControl fullWidth sx={textFieldStyle}>
                  <InputLabel id="manage-type-label">
                    What do you want to do?
                  </InputLabel>
                  <Select
                    labelId="manage-type-label"
                    id="manage-select-standard"
                    value={manageType}
                    onChange={handleChange}
                    label="What do you want to do?"
                  >
                    {props.type === "general" && (
                      <MenuItem
                        value="Deployment"
                        disabled={instock_quantity! < 1}
                      >
                        New Deployment
                      </MenuItem>
                    )}
                    <MenuItem value="Offboard">Offboard</MenuItem>
                    <MenuItem value="Return">Return</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                xs={2}
                sx={{
                  float: "right",
                  paddingTop: "25px !important",
                  paddingLeft: "10px",
                }}
                item
              >
                <Button
                  variant="contained"
                  onClick={() => setChangeView(true)}
                  sx={{ backgroundColor: "#054ffe", borderRadius: "10px" }}
                >
                  <ArrowForwardIcon />
                </Button>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <>
            {manageType !== "Deployment" && (
              <OffboardBody
                manageType={manageType}
                {...props}
                device_names={device_names}
              />
            )}
            {manageType === "Deployment" && (
              <AssignModal
                type="general"
                devices={props.devices}
                manageOpen={true}
                handleParentClose={handleClose}
                disabled={false}
              />
            )}
          </>
        )} */}
      </Modal>
    </div>
  );
};

export default ManageModal;
