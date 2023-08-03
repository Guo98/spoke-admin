import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAuth0 } from "@auth0/auth0-react";
import OffboardBody from "./OffboardBody";
import { setInventory } from "../../app/slices/inventorySlice";
import { standardGet } from "../../services/standard";
import { roleMapping } from "../../utilities/mappings";
import { InventorySummary } from "../../interfaces/inventory";
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
  name?: {
    first_name: string;
    last_name: string;
  };
  address?: {
    al1: string;
    al2?: string;
    city: string;
    state: string;
    postal_code: string;
    country_code: string;
  };
  email?: string;
  device_name?: string;
  serial_number?: string;
  device_location?: string;
  phone_number?: string;
  type: string;
  devices?: InventorySummary[];
  instock_quantity?: number;
  id?: string;
}

const ManageModal = (props: ManageProps) => {
  const { instock_quantity } = props;

  const [open, setOpen] = useState(false);
  const [manageType, setManageType] = useState("");
  const [changeView, setChangeView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [device_names, setDeviceNames] = useState<any[]>([]);

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );
  const roles = useSelector((state: RootState) => state.client.roles);

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchData = async () => {
      const client =
        clientData === "spokeops" ? selectedClientData : clientData;
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
    if (props.devices && props.devices.length > 0)
      setDeviceNames([
        ...new Set(
          props.devices!?.map((dev) => {
            return { name: dev.name, id: dev.id };
          })
        ),
      ]);
  }, [props.devices]);

  const handleOpen = () => {
    setOpen(true);
    setLoading(true);
  };
  const handleClose = () => {
    setOpen(false);
    setChangeView(false);
    setManageType("");
  };

  const handleChange = (event: SelectChangeEvent) => {
    setManageType(event.target.value);
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        variant={props.type === "general" ? "contained" : "text"}
      >
        Manage
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {!changeView ? (
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
        )}
      </Modal>
    </div>
  );
};

export default ManageModal;
