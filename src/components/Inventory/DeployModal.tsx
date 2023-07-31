import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  FormControlLabel,
  Checkbox,
  Stack,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useAuth0 } from "@auth0/auth0-react";
import { standardPost, standardGet } from "../../services/standard";
import ConfirmationBody from "./ConfirmationBody";
import { updateInventory } from "../../app/slices/inventorySlice";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "1px solid #000",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
};

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const rightTextFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  float: "right",
};

interface DeployProps {
  first_name: string;
  last_name: string;
  device_name: string;
  openModal: boolean;
  serial_number: string;
  addressObj: {
    address_line1: string;
    address_line2?: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
  };
  email: string;
  phone_number: string;
  note: string;
  device_location: string;
  shipping: string;
  image_source: string | undefined;
  id: string | undefined;
}

const DeployModalContent = (props: DeployProps) => {
  const {
    first_name,
    last_name,
    device_name,
    openModal,
    serial_number,
    addressObj,
    email,
    phone_number,
    note,
    device_location,
    shipping,
    image_source,
    id,
  } = props;

  const clientData = useSelector((state: RootState) => state.client.data);
  const selectedClientData = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const [edit, setEdit] = useState(false);
  const [fn, setFn] = useState(first_name);
  const [ln, setLn] = useState(last_name);
  const [ad1, setAd1] = useState(addressObj.address_line1);
  const [ad2, setAd2] = useState(addressObj.address_line2);
  const [city, setCity] = useState(addressObj.city);
  const [state, setState] = useState(addressObj.state);
  const [postalCode, setPC] = useState(addressObj.zipCode);
  const [country, setCountry] = useState(addressObj.country);
  const [updatedemail, setEmail] = useState(email);
  const [pn, setPn] = useState(phone_number);
  const [confirmation, setConfirmation] = useState(false);
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editNote, setEditNote] = useState(note);
  const [sending, setSending] = useState(false);

  const { getAccessTokenSilently, user } = useAuth0();

  const dispatch = useDispatch();

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const deploy = async () => {
    const client = clientData === "spokeops" ? selectedClientData : clientData;
    const accessToken = await getAccessTokenSilently();
    const deployObj = {
      client: client,
      first_name: fn,
      last_name: ln,
      address: {
        al1: ad1,
        al2: ad2,
        city: city,
        state: state,
        postal_code: postalCode,
        country_code: country,
      },
      email: updatedemail,
      phone_number: pn,
      device_name: device_name,
      serial_number: serial_number,
      device_location: device_location,
      shipping: shipping,
      requestor_email: user?.email,
      requestor_name: user?.name,
      id,
    };
    setSending(true);

    const deployResult = await standardPost(
      accessToken,
      "deployLaptop",
      deployObj
    );

    if (deployResult) {
      setConfirmation(true);
      setSuccess(true);
      setSending(false);
      const client =
        clientData === "spokeops" ? selectedClientData : clientData;
      const accessToken = await getAccessTokenSilently();

      const inventoryResult = await standardGet(
        accessToken,
        `inventory/${client}`
      );
      dispatch(updateInventory(inventoryResult.data));
    }
  };

  useEffect(() => {
    if (!openModal) {
      setConfirmation(false);
    }
  }, [openModal]);

  return (
    <>
      {!confirmation ? (
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h3">
            Please Confirm Deployment Details:
          </Typography>
          <Card sx={{ display: "flex" }}>
            <CardMedia
              component="img"
              sx={{ width: 175 }}
              image={image_source}
              alt="laptop"
            />
            <CardContent>
              <Typography sx={{ fontWeight: "bold" }}>{device_name}</Typography>
              <Typography>{serial_number}</Typography>
            </CardContent>
          </Card>
          <Stack spacing={2} sx={{ paddingTop: "20px" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  id="standard-fn"
                  label="First Name"
                  defaultValue={fn}
                  onChange={(event) => setFn(event.target.value)}
                  size="small"
                  sx={textFieldStyle}
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="standard-ln"
                  label="Last Name"
                  defaultValue={ln}
                  sx={rightTextFieldStyle}
                  onChange={(event) => setLn(event.target.value)}
                  size="small"
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <div>
              <TextField
                required
                id="standard-address"
                label="Address Line 1"
                defaultValue={ad1}
                fullWidth
                onChange={(event) => setAd1(event.target.value)}
                size="small"
                sx={textFieldStyle}
                disabled={!edit}
              />
            </div>
            <div>
              <TextField
                id="standard-address"
                label="Address Line 2"
                defaultValue={ad2}
                fullWidth
                onChange={(event) => setAd2(event.target.value)}
                size="small"
                sx={textFieldStyle}
                disabled={!edit}
              />
            </div>
            <Grid
              container
              spacing={2}
              sx={{
                marginLeft: "-16px !important",
                marginTop: "0px !important",
              }}
            >
              <Grid item xs={6}>
                <TextField
                  required
                  id="standard-city"
                  label="City"
                  defaultValue={city}
                  onChange={(event) => setCity(event.target.value)}
                  size="small"
                  sx={textFieldStyle}
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="standard-state"
                  label="State/Province"
                  defaultValue={state}
                  sx={rightTextFieldStyle}
                  onChange={(event) => setState(event.target.value)}
                  size="small"
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                marginLeft: "-16px !important",
                marginTop: "0px !important",
              }}
            >
              <Grid item xs={6}>
                <TextField
                  required
                  id="standard-postal-code"
                  label="Postal Code"
                  defaultValue={postalCode}
                  onChange={(event) => setPC(event.target.value)}
                  size="small"
                  sx={textFieldStyle}
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="standard-country"
                  label="Country"
                  defaultValue={country}
                  sx={rightTextFieldStyle}
                  onChange={(event) => setCountry(event.target.value)}
                  size="small"
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              sx={{
                marginLeft: "-16px !important",
                marginTop: "0px !important",
              }}
            >
              <Grid item xs={6}>
                <TextField
                  required
                  id="standard-email"
                  label="Email"
                  defaultValue={updatedemail}
                  onChange={(event) => setEmail(event.target.value)}
                  size="small"
                  sx={textFieldStyle}
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  id="standard-phonenumber"
                  label="Phone Number"
                  defaultValue={pn}
                  sx={rightTextFieldStyle}
                  onChange={(event) => setPn(event.target.value)}
                  size="small"
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <div>
              <TextField
                id="standard-note"
                label="Note"
                defaultValue={editNote}
                fullWidth
                sx={textFieldStyle}
                size="small"
                disabled={!edit}
                onChange={(event) => setEditNote(event.target.value)}
              />
            </div>
          </Stack>
          <hr />
          <FormControlLabel
            control={<Checkbox required onChange={handleChecked} />}
            label={
              <div>
                By checking this box, I agree to have Spoke deploy the device on
                my behalf.
              </div>
            }
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <div className="button">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "white",
                    color: "#054ffe",
                    borderRadius: "10px",
                    ":hover": {
                      backgroundColor: "white",
                    },
                  }}
                  onClick={() => setEdit(true)}
                >
                  Edit
                </Button>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="button">
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "#054ffe",
                    borderRadius: "10px",
                  }}
                  onClick={async () => await deploy()}
                  disabled={!checked || sending}
                >
                  {sending ? <CircularProgress /> : "Deploy"}
                </Button>
              </div>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <ConfirmationBody
          conType="deploy"
          name={fn + " " + ln}
          success={success}
        />
      )}
    </>
  );
};

export default DeployModalContent;
