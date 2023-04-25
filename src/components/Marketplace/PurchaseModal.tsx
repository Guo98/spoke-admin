import React, { useState, ChangeEvent } from "react";
import {
  Modal,
  Box,
  Typography,
  CardMedia,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  TextField,
  Divider,
  FormControlLabel,
  Checkbox,
  Button,
  Stepper,
  Step,
  StepLabel,
  Backdrop,
  LinearProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { RootState } from "../../app/store";
import { postOrder } from "../../services/ordersAPI";
import { cli } from "cypress";

interface PurchaseProps {
  open: boolean;
  handleClose: Function;
  imgSrc: string;
  types: any;
  brand: string;
}

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
  marginTop: "10px",
};

const PurchaseModal = (props: PurchaseProps) => {
  const { open, handleClose, imgSrc, types, brand } = props;

  const client = useSelector((state: RootState) => state.client.data);
  const selectedClient = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const marketClient = client === "spokeops" ? selectedClient : client;

  const { getAccessTokenSilently } = useAuth0();

  const [type, setType] = useState("");
  const [specs, setSpecs] = useState("");
  const [color, setColor] = useState("");
  const [otherSpecs, setOtherSpecs] = useState("");
  const [specIndex, setSpecIndex] = useState(0);
  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed1, setComplete1] = useState(false);
  const [completed2, setComplete2] = useState(false);
  const [recipient_name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [pn, setPhone] = useState("");
  const [shipping, setShipping] = useState("");
  const [recipient_notes, setRNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleTypeChange = (event: SelectChangeEvent) => {
    setType(event.target.value);
  };

  const handleSpecsChange = (event: SelectChangeEvent) => {
    if (event.target.value === "Others") {
      setSpecIndex(-1);
    } else {
      const specIndex = types[type].specs
        ?.map((spec: any) => spec.spec)
        .indexOf(event.target.value);
      setSpecIndex(specIndex);
    }
    setSpecs(event.target.value);
  };

  const handleColorChange = (event: SelectChangeEvent) => {
    setColor(event.target.value);
  };

  const handleChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const buyDeploy = async () => {
    if (activeStep === 0) {
      setComplete1(true);
      setActiveStep(1);
    } else if (activeStep === 1) {
      setComplete2(true);
      setLoading(true);
      await sendRequest("Deploy");
    }
  };

  const buyHold = async () => {
    setComplete1(true);
    setLoading(true);
    await sendRequest("Hold");
  };

  const sendRequest = async (buyType: string) => {
    let postBody: any = {
      client: marketClient,
      device_type: type,
      specs: specs === "Other" ? otherSpecs : specs,
      color,
      notes: {
        device: notes,
      },
      order_type:
        buyType === "Hold" ? "Hold in Inventory" : "Deploy Right Away",
    };

    if (buyType !== "Hold") {
      postBody.recipient_name = recipient_name;
      postBody.address = address;
      postBody.email = email;
      postBody.phone_number = pn;
      postBody.shipping_rate = shipping;
      postBody.notes.recipient = recipient_notes;
    }

    const accessToken = await getAccessTokenSilently();

    const newPurchaseResp = await postOrder(
      "newPurchase",
      accessToken,
      postBody
    );

    if (newPurchaseResp.status !== "Successful") {
      setError(true);
    }

    setLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setType("");
        setSpecs("");
        setColor("");
        setNotes("");
        setName("");
        setAddress("");
        setEmail("");
        setPhone("");
        setShipping("");
        setRNotes("");
        setActiveStep(0);
        setComplete1(false);
        setLoading(false);
        setComplete2(false);
        setError(false);
        handleClose();
      }}
    >
      <Box sx={style}>
        {((!loading && !completed1) ||
          (completed1 && !completed2 && !loading)) && (
          <>
            <Typography variant="h5">New Purchase - {brand}</Typography>
            <Divider />
            <CardMedia
              image={imgSrc}
              title={"laptop"}
              component="img"
              height="175px"
              sx={{
                objectFit: "contain",
                paddingTop: "15px",
              }}
            />
            <Stepper activeStep={activeStep} sx={{ paddingTop: "10px" }}>
              <Step key="Device" completed={completed1}>
                <StepLabel>
                  <Typography>Device</Typography>
                </StepLabel>
              </Step>
              <Step completed={completed2}>
                <StepLabel
                  optional={<Typography variant="caption">Optional</Typography>}
                >
                  <Typography>Recipient</Typography>
                </StepLabel>
              </Step>
            </Stepper>
            {activeStep === 0 && (
              <>
                {brand !== "Others" && (
                  <FormControl
                    fullWidth
                    sx={textFieldStyle}
                    required
                    size="small"
                  >
                    <InputLabel id="type-select-label">Device Type</InputLabel>
                    <Select
                      labelId="type-select-label"
                      id="type-select"
                      label="Device Type"
                      onChange={handleTypeChange}
                      value={type}
                      required
                    >
                      {types &&
                        Object.keys(types).map((brandtype) => {
                          if (
                            types[brandtype].clients.indexOf(marketClient) > -1
                          ) {
                            return (
                              <MenuItem value={brandtype}>{brandtype}</MenuItem>
                            );
                          }
                        })}
                    </Select>
                  </FormControl>
                )}
                {brand === "Others" && (
                  <TextField
                    label="Device Type"
                    size="small"
                    sx={textFieldStyle}
                    fullWidth
                    required
                    onChange={(e) => setType(e.target.value)}
                  />
                )}
                {brand !== "Others" && (
                  <FormControl
                    fullWidth
                    sx={textFieldStyle}
                    required
                    size="small"
                    disabled={type === ""}
                  >
                    <InputLabel id="specs-select-label">Specs</InputLabel>
                    <Select
                      labelId="specs-select-label"
                      id="specs-select"
                      label="Specs"
                      onChange={handleSpecsChange}
                      value={specs}
                      required
                    >
                      {type !== "" &&
                        types[type].specs?.map((spec: any) => {
                          if (
                            spec.clients.filter(
                              (specClient: any) =>
                                specClient.client === marketClient
                            ).length > 0
                          ) {
                            return (
                              <MenuItem value={spec.spec}>{spec.spec}</MenuItem>
                            );
                          }
                        })}
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                )}
                {specs === "Other" && (
                  <TextField
                    label="Other Specs"
                    sx={textFieldStyle}
                    fullWidth
                    size="small"
                    required
                    onChange={(event) => setOtherSpecs(event.target.value)}
                  />
                )}
                {brand === "Others" && (
                  <TextField
                    label="Device Specs"
                    size="small"
                    sx={textFieldStyle}
                    fullWidth
                    required
                    onChange={(e) => setSpecs(e.target.value)}
                  />
                )}
                {brand !== "Others" && (
                  <FormControl
                    fullWidth
                    sx={textFieldStyle}
                    required
                    size="small"
                    disabled={type === ""}
                  >
                    <InputLabel id="color-select-label">Color</InputLabel>
                    <Select
                      labelId="color-select-label"
                      id="color-select"
                      label="Color"
                      onChange={handleColorChange}
                      value={color}
                      required
                    >
                      {type !== "" &&
                        types[type].colors.map((specColor: string) => {
                          return (
                            <MenuItem value={specColor}>{specColor}</MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                )}
                {(brand === "Others" || specIndex === -1) && (
                  <TextField
                    label="Device Color"
                    size="small"
                    sx={textFieldStyle}
                    onChange={(e) => setColor(e.target.value)}
                    fullWidth
                    required
                  />
                )}
                <TextField
                  label="Notes"
                  sx={textFieldStyle}
                  fullWidth
                  size="small"
                  onChange={(event) => setNotes(event.target.value)}
                />
                <Divider sx={{ marginTop: "20px", marginBottom: "10px" }} />
                <FormControlLabel
                  control={<Checkbox required onChange={handleChecked} />}
                  label={
                    <div>
                      By checking this box, I agree to have Spoke generate a
                      quote on my behalf.
                    </div>
                  }
                />
              </>
            )}
            {activeStep === 1 && (
              <>
                <TextField
                  label="Recipient Name"
                  sx={textFieldStyle}
                  fullWidth
                  size="small"
                  onChange={(event) => setName(event.target.value)}
                  required
                />
                <TextField
                  label="Address"
                  sx={textFieldStyle}
                  fullWidth
                  size="small"
                  onChange={(event) => setAddress(event.target.value)}
                  required
                />
                <TextField
                  label="Email"
                  sx={textFieldStyle}
                  fullWidth
                  size="small"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <TextField
                  label="Phone Number"
                  sx={textFieldStyle}
                  fullWidth
                  size="small"
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
                <TextField
                  label="Shipping Rate"
                  sx={textFieldStyle}
                  fullWidth
                  size="small"
                  onChange={(event) => setShipping(event.target.value)}
                  required
                />
                <TextField
                  label="Notes"
                  sx={textFieldStyle}
                  fullWidth
                  size="small"
                  onChange={(event) => setRNotes(event.target.value)}
                />
              </>
            )}
            <Button
              fullWidth
              variant="contained"
              sx={{
                marginTop: "10px",
                borderRadius: "999em 999em 999em 999em",
                textTransform: "none",
              }}
              disabled={
                ((!checked || specs === "" || color === "" || type === "") &&
                  activeStep === 0) ||
                (activeStep == 1 &&
                  (recipient_name === "" ||
                    address === "" ||
                    email === "" ||
                    pn === "" ||
                    shipping === ""))
              }
              onClick={buyDeploy}
            >
              Buy & Deploy Now
            </Button>
            {activeStep === 0 && (
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  marginTop: "10px",
                  borderRadius: "999em 999em 999em 999em",
                  textTransform: "none",
                }}
                color="secondary"
                disabled={
                  !checked || specs === "" || color === "" || type === ""
                }
                onClick={buyHold}
              >
                Buy & Hold in Inventory
              </Button>
            )}
          </>
        )}
        {((completed1 && activeStep !== 1 && !loading) ||
          (completed1 && completed2 && !loading)) && (
          <>
            <Typography variant="h6" component="h4" textAlign="center">
              {error
                ? "There has been an error with your request"
                : "Your request has been submitted!"}
            </Typography>
            <div className="center">
              {error ? (
                <ErrorIcon sx={{ height: "10%", width: "10%", color: "red" }} />
              ) : (
                <CheckCircleIcon
                  sx={{ color: "#06BE08", height: "10%", width: "10%" }}
                />
              )}
            </div>
            <Typography textAlign="center">
              {error ? "Please try again later." : "Thank you for your order!"}
            </Typography>
          </>
        )}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          {loading && (
            <Box sx={{ width: "50%" }}>
              <LinearProgress />
            </Box>
          )}
        </Backdrop>
      </Box>
    </Modal>
  );
};

export default PurchaseModal;
