import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepIconProps,
  Tooltip,
  IconButton,
  Stack,
  ButtonGroup,
  Alert,
} from "@mui/material";
import LaptopIcon from "@mui/icons-material/Laptop";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";

import DeviceSelection from "./DeviceSelection/DeviceSelection";
import RecipientForm from "./RecipientForm";
import SpecificDevice from "./SpecificDevice";
import AccessoriesSelection from "./DeviceSelection/AccessoriesSelection";
import { standardPost } from "../../services/standard";
import { openMarketplace } from "../../app/slices/marketSlice";
import { ColorConnector, ColorIconRoot } from "../common/StepperUtils";
import { RootState } from "../../app/store";
import { resetInfo } from "../../app/slices/recipientSlice";

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
  item_type: string;
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
  overflowY: "scroll",
};

function ColorStepIcon(props: StepIconProps) {
  // Add active to ownerstate if want deployment filled on form
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <LaptopIcon />,
    2: <AddShoppingCartIcon />,
    3: <LocalShippingIcon />,
  };

  return (
    <ColorIconRoot ownerState={{ completed }} className={className}>
      {icons[String(props.icon)]}
    </ColorIconRoot>
  );
}

const MarketplacePurchase = (props: MPProps) => {
  const accessories_redux = useSelector(
    (state: RootState) => state.market.accessories
  );

  const { open, handleClose, imgSrc, types, brand, client, item_type } = props;
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const [step_1, setStep1] = useState(true);
  const [step_2, setStep2] = useState(false);
  const [step_3, setStep3] = useState(false);

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

  const [accessories, setAccessories] = useState<any[]>([]);

  const [ret_device, setRetDevice] = useState("");
  const [ret_sn, setRetSN] = useState("");
  const [ret_condition, setRetCondition] = useState("");
  const [ret_act_key, setRetActKey] = useState("");
  const [ret_note, setRetNote] = useState("");

  const [clear_device, setClearDevice] = useState(false);
  const [clear_deployment, setClearDeployment] = useState(false);

  const [can_bookmark, setCanBookmark] = useState(false);
  const [bookmark_status, setBookmarkStatus] = useState(-1);
  const [already_bookmarked, setAlreadyBookmark] = useState(false);

  const [can_delete, setCanDelete] = useState(false);
  const [delete_status, setDeleteStatus] = useState(-1);

  useEffect(() => {
    // setActiveStep(0);
    // setStep1(true);
    // setStep2(false);
    // setStep3(false);
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

  useEffect(() => {
    if (item_type === "Accessories") {
      setActiveStep(1);
      setStep2(true);
    } else {
      setActiveStep(0);
      setStep1(true);
      setStep2(false);
      setAccessories([]);
    }
    setStep3(false);
    setReqType("");
    setCDWPartNo("");
    setAISpecs("");
    setDeviceName("");
    setDeviceSpecs("");
    setDeviceURL("");
    dispatch(resetInfo());
  }, [item_type]);

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
    type: string = "quote",
    go_to_addons: boolean = false
  ) => {
    // setComplete1(true);
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

    if (!go_to_addons) {
      setActiveStep(2);
      setStep3(true);
    } else {
      setActiveStep(1);
      setStep2(true);
    }
  };

  const addAccessories = (items: any[]) => {
    setAccessories(items);
    setActiveStep(2);
    setStep3(true);
  };

  const completeDeploymentStep = () => {
    // setComplete2(true);
    setLoading(true);
  };

  const clearAll = () => {
    setLoading(false);
    if (item_type === "Accessories") {
      if (activeStep === 1) {
        setAccessories([]);
      } else {
        setAccessories([]);
        setActiveStep(1);
        setStep3(false);
      }
    } else {
      if (activeStep === 0) {
        setClearDevice(true);
        setDeviceName("");
        setDeviceSpecs("");
      } else {
        setClearDeployment(true);
        setClearDevice(true);
        setAccessories([]);
        setActiveStep(0);
        setStep3(false);
        setStep2(false);
      }
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

  const deleteAccessories = async () => {
    setLoading(true);
    const access_token = await getAccessTokenSilently();
    const delete_obj = {
      client,
      items: accessories,
    };
    const delete_resp = await standardPost(
      access_token,
      "marketplace/delete/accessories",
      delete_obj
    );

    if (delete_resp.status === "Successful") {
      //setDeleteStatus(0);
      await props.refresh();
      setAccessories([]);
    } else {
      setDeleteStatus(1);
    }

    setLoading(false);
  };

  const back_button = () => {
    if (step_3) {
      setStep3(false);
      if (step_2) {
        setActiveStep(1);
      } else {
        setActiveStep(0);
      }
    } else if (step_2) {
      setActiveStep(0);
      setStep2(false);
    }
  };

  const close_module = () => {
    if (!loading) {
      handleClose();
      dispatch(openMarketplace(null));
    }
    if (item_type === "Accessories") {
      if (!step_3) {
        setActiveStep(1);
        setStep2(true);
      }
    } else {
      if (step_1 && step_3) {
        setActiveStep(0);
        setStep1(true);
        setStep3(false);
        if (step_2) {
          setStep2(false);
        }
        dispatch(resetInfo());
      }
    }

    setBookmarkStatus(-1);
    setDeleteStatus(-1);
    setCanBookmark(false);
    setCanDelete(false);
    setDeviceName("");
    setDeviceSpecs("");
  };

  return (
    <Modal onClose={close_module} open={open} sx={{ overflow: "hidden" }}>
      <Box sx={style} id="marketplace-purchase-modal">
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            {((activeStep !== 0 && item_type !== "Accessories") ||
              (step_3 && item_type === "Accessories")) && (
              <Tooltip title="Back">
                <IconButton onClick={back_button}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            )}
            <Typography
              variant="h5"
              fontWeight="bold"
              id="marketplace-purchase-modal-header"
            >
              {"New Purchase" +
                (!props.specific_device
                  ? item_type !== "Accessories"
                    ? " - " + brand
                    : " - Accessories"
                  : "")}
            </Typography>
          </Stack>
          <ButtonGroup>
            {activeStep === 0 && (
              <Tooltip title="Bookmark">
                <IconButton
                  disabled={
                    !can_bookmark || props.bookmark || already_bookmarked
                  }
                  onClick={bookmarkDevice}
                  id="bookmark-button"
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
                <IconButton
                  disabled={!can_delete}
                  onClick={deleteSpec}
                  id="delete-specs-button"
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            )}
            {activeStep === 1 && (
              <Tooltip title="Delete Accessories">
                <IconButton
                  disabled={accessories.length === 0}
                  onClick={deleteAccessories}
                >
                  <RemoveCircleIcon
                    color={accessories.length === 0 ? "disabled" : "error"}
                  />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Clear All">
              <IconButton onClick={clearAll} id="clear-button">
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
          {item_type !== "Accessories" && (
            <Step key="Device" completed={step_1}>
              <StepLabel StepIconComponent={ColorStepIcon}>
                <Typography>Device</Typography>
              </StepLabel>
            </Step>
          )}
          <Step key="Accessories" completed={step_2}>
            <StepLabel StepIconComponent={ColorStepIcon}>
              <Typography>Accessories</Typography>
            </StepLabel>
          </Step>
          <Step completed={step_3}>
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
              item_type={item_type}
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
              item_type={item_type}
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
          <AccessoriesSelection
            nextStep={addAccessories}
            client={props.client}
            ret_device={ret_device}
            setRetDevice={setRetDevice}
            ret_sn={ret_sn}
            setRetSN={setRetSN}
            ret_condition={ret_condition}
            setRetCondition={setRetCondition}
            ret_act_key={ret_act_key}
            setRetActKey={setRetActKey}
            ret_note={ret_note}
            setRetNote={setRetNote}
            addons={accessories}
            addAccessories={setAccessories}
          />
        )}
        {activeStep === 2 && (
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
            addons={accessories}
            item_type={item_type}
            ret_device_name={ret_device}
            ret_condition={ret_condition}
            ret_sn={ret_sn}
            ret_note={ret_note}
            ret_activation={ret_act_key}
          />
        )}
      </Box>
    </Modal>
  );
};

export default MarketplacePurchase;
