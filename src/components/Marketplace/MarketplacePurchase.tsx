import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  styled,
  StepConnector,
  StepIconProps,
  Tooltip,
  IconButton,
  Stack,
  ButtonGroup,
  Alert,
} from "@mui/material";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import LaptopIcon from "@mui/icons-material/Laptop";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";

import DeviceSelection from "./DeviceSelection";
import RecipientForm from "./RecipientForm";
import SpecificDevice from "./SpecificDevice";
import { standardPost } from "../../services/standard";
import { openMarketplace } from "../../app/slices/marketSlice";

interface MPProps {
  open: boolean;
  handleClose: Function;
  imgSrc: string;
  types?: any;
  brand: string;
  client: string;
  suppliers?: any;
  specific_device?: string;
  location?: string;
  supplier_links?: any;
  specific_specs?: string;
  product_type?: string;
  bookmark?: boolean;
  refresh: Function;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "85%", md: "50%" },
  maxHeight: { xs: "75%" },
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
  overflow: "scroll",
};

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(90deg, rgba(7,79,255,1) 0%, rgba(23,110,204,1) 49%, rgba(75,137,233,1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(90deg, rgba(7,79,255,1) 0%, rgba(23,110,204,1) 49%, rgba(75,137,233,1) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 45,
  height: 45,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient(90deg, rgba(7,79,255,1) 0%, rgba(23,110,204,1) 49%, rgba(75,137,233,1) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(90deg, rgba(7,79,255,1) 0%, rgba(23,110,204,1) 49%, rgba(75,137,233,1) 100%)",
  }),
}));

function ColorStepIcon(props: StepIconProps) {
  // Add active to ownerstate if want deployment filled on form
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <LaptopIcon />,
    2: <LocalShippingIcon />,
  };

  return (
    <ColorIconRoot ownerState={{ completed }} className={className}>
      {icons[String(props.icon)]}
    </ColorIconRoot>
  );
}

const MarketplacePurchase = (props: MPProps) => {
  const { open, handleClose, imgSrc, types, brand, client } = props;
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed1, setComplete1] = useState(false);
  const [completed2, setComplete2] = useState(false);

  const [device_name, setDeviceName] = useState("");
  const [device_specs, setDeviceSpecs] = useState("");
  const [device_url, setDeviceURL] = useState("");
  const [region, setRegion] = useState("");
  const [price, setPrice] = useState("");
  const [img_src, setSource] = useState("");
  const [stock_level, setStock] = useState("");
  const [ai_specs, setAISpecs] = useState("");
  const [supplier, setSupplier] = useState("");
  const [cdw_part_number, setCDWPartNo] = useState("");
  const [request_type, setReqType] = useState("");

  const [clear_device, setClearDevice] = useState(false);
  const [clear_deployment, setClearDeployment] = useState(false);

  const [can_bookmark, setCanBookmark] = useState(false);
  const [bookmark_status, setBookmarkStatus] = useState(-1);
  const [already_bookmarked, setAlreadyBookmark] = useState(false);

  const [can_delete, setCanDelete] = useState(false);
  const [delete_status, setDeleteStatus] = useState(-1);

  useEffect(() => {
    setActiveStep(0);
    setComplete1(false);
    setComplete2(false);
  }, [brand, types]);

  useEffect(() => {
    if (!props.bookmark && device_name !== "" && device_specs !== "") {
      setCanBookmark(true);
      setCanDelete(true);
    }
  }, [device_name, device_specs]);

  useEffect(() => {
    if (props.bookmark) {
      setDeviceName(props.specific_device!);
      setDeviceSpecs(props.specific_specs!);
    }
  }, [props.specific_device, props.specific_specs, props.bookmark]);

  const completeDeviceStep = (
    dn: string,
    ds: string,
    du: string = "",
    region: string,
    price: string,
    image_source: string,
    stock_level: string,
    ai_specs: string,
    sup: string,
    cdw_part_no: string = "",
    type: string = "quote"
  ) => {
    setActiveStep(1);
    setComplete1(true);
    setDeviceName(dn);
    setDeviceSpecs(ds);
    setDeviceURL(du);
    setRegion(region);
    setPrice(price);
    setSource(image_source);
    setStock(stock_level);
    setAISpecs(ai_specs);
    setSupplier(sup);
    setCDWPartNo(cdw_part_no);
    setReqType(type);
  };

  const completeDeploymentStep = () => {
    setComplete2(true);
    setLoading(true);
  };

  const clearAll = () => {
    setLoading(false);
    if (activeStep === 0) {
      setClearDevice(true);
      setDeviceName("");
      setDeviceSpecs("");
    } else {
      setClearDeployment(true);
      setClearDevice(true);
      setActiveStep(0);
      setComplete1(false);
    }
  };

  const bookmarkDevice = async () => {
    setLoading(true);
    setCanBookmark(false);
    const access_token = await getAccessTokenSilently();
    const bookmark_body = {
      brand,
      type: device_name,
      specs: device_specs,
      client,
      product_type: props.product_type,
    };

    const bookmark_resp = await standardPost(
      access_token,
      "marketplace/bookmark",
      bookmark_body
    );

    if (bookmark_resp.status === "Successful") {
      setBookmarkStatus(0);
      await props.refresh();
    } else {
      setBookmarkStatus(1);
    }

    setLoading(false);
  };

  const deleteSpec = async () => {
    setLoading(true);
    setCanDelete(false);

    const access_token = await getAccessTokenSilently();
    const delete_obj = {
      brand,
      type: device_name,
      specs: device_specs,
      client,
      product_type: props.product_type,
    };

    const delete_resp = await standardPost(
      access_token,
      "marketplace/delete",
      delete_obj
    );
    if (delete_resp.status === "Successful") {
      setDeleteStatus(0);
      await props.refresh();
      setDeviceName("");
      setDeviceSpecs("");
    } else {
      setDeleteStatus(1);
    }
    setLoading(false);
  };

  return (
    <Modal
      onClose={() => {
        if (!loading) {
          handleClose();
          dispatch(openMarketplace(null));
        }
        if (completed1 && completed2) {
          setActiveStep(0);
          setComplete1(false);
          setComplete2(false);
        }
        setBookmarkStatus(-1);
        setDeleteStatus(-1);
        setCanBookmark(false);
        setCanDelete(false);
        setDeviceName("");
        setDeviceSpecs("");
      }}
      open={open}
    >
      <Box sx={style}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h5" fontWeight="bold">
            {"New Purchase" + (!props.specific_device ? " - " + brand : "")}
          </Typography>
          <ButtonGroup>
            {activeStep === 1 && (
              <Tooltip title="Back">
                <IconButton
                  onClick={() => {
                    setActiveStep(0);
                    setComplete1(false);
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            )}
            {activeStep === 0 && (
              <Tooltip title="Bookmark">
                <IconButton
                  disabled={
                    !can_bookmark || props.bookmark || already_bookmarked
                  }
                  onClick={bookmarkDevice}
                >
                  {props.bookmark || already_bookmarked ? (
                    <BookmarkIcon />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {activeStep === 0 && (
              <Tooltip title="Delete Spec">
                <IconButton disabled={!can_delete} onClick={deleteSpec}>
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Clear All">
              <IconButton onClick={clearAll}>
                <ClearAllIcon />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </Stack>
        {bookmark_status !== -1 && (
          <Alert severity={bookmark_status === 0 ? "success" : "error"}>
            {bookmark_status === 0
              ? "Successfully bookmarked!"
              : "Please try again later."}
          </Alert>
        )}
        {delete_status !== -1 && (
          <Alert severity={delete_status === 0 ? "success" : "error"}>
            {delete_status === 0
              ? "Successfully deleted!"
              : "Please try again later."}
          </Alert>
        )}
        <Stepper
          activeStep={activeStep}
          sx={{ paddingTop: "10px" }}
          connector={<ColorConnector />}
        >
          <Step key="Device" completed={completed1}>
            <StepLabel StepIconComponent={ColorStepIcon}>
              <Typography>Device</Typography>
            </StepLabel>
          </Step>
          <Step completed={completed2}>
            <StepLabel StepIconComponent={ColorStepIcon}>
              <Typography>Deployment</Typography>
            </StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && !props.specific_device && (
          <>
            <DeviceSelection
              types={types}
              brand={brand}
              setLoading={setLoading}
              completeDeviceChoice={completeDeviceStep}
              clear_device={clear_device}
              setClear={setClearDevice}
              loading={loading}
              suppliers={props.suppliers}
              client={props.client}
              setDeviceName={setDeviceName}
              setDeviceSpecs={setDeviceSpecs}
              specs={device_specs}
              device_name={device_name}
              bookmarked={setAlreadyBookmark}
            />
          </>
        )}
        {activeStep === 0 && props.specific_device && props.bookmark && (
          <>
            <DeviceSelection
              types={types}
              brand={brand}
              setLoading={setLoading}
              completeDeviceChoice={completeDeviceStep}
              clear_device={clear_device}
              setClear={setClearDevice}
              loading={loading}
              suppliers={props.suppliers}
              client={props.client}
              setDeviceName={setDeviceName}
              setDeviceSpecs={setDeviceSpecs}
              specs={props.specific_specs!}
              device_name={props.specific_device}
              bookmarked={setAlreadyBookmark}
            />
          </>
        )}
        {activeStep === 0 && props.specific_device && !props.bookmark && (
          <>
            <SpecificDevice
              device_name={props.specific_device}
              location={props.location!}
              completeDeviceChoice={completeDeviceStep}
              supplier_links={props.supplier_links}
              specs={props.specific_specs!}
            />
          </>
        )}
        {activeStep === 1 && (
          <RecipientForm
            completeRecipientStep={completeDeploymentStep}
            device_name={device_name}
            device_specs={device_specs}
            device_url={device_url}
            client={client}
            setParentLoading={setLoading}
            region={region}
            price={price}
            stock_level={stock_level}
            image_source={img_src}
            clear_deployment={clear_deployment}
            setClear={setClearDeployment}
            ai_specs={ai_specs}
            supplier={supplier}
            request_type={request_type}
            cdw_part_no={cdw_part_number}
          />
        )}
      </Box>
    </Modal>
  );
};

export default MarketplacePurchase;
