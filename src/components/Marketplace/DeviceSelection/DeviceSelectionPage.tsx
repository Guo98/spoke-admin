import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Divider,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  Modal,
  Box,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import DeviceSelectionPageTwo from "./DeviceSelectionPageTwo";
import RecipientFormPage from "../RecipientFormPage";
import AccessoriesSelection from "./AccessoriesSelection";

import { ScrapedStockInfo } from "../../../interfaces/marketplace";
import { RootState } from "../../../app/store";
import { box_style, button_style } from "../../../utilities/styles";
import { standardPost } from "../../../services/standard";
import LinearLoading from "../../common/LinearLoading";

interface DeviceSelectionProps {
  brand: string;
  device_lines: any;
  setPageNumber: Function;
  accessories_only: boolean;
  product_type: string;
  refresh: Function;
}

const DeviceSelectionPage = (props: DeviceSelectionProps) => {
  const { brand, device_lines, setPageNumber, accessories_only } = props;
  const { getAccessTokenSilently } = useAuth0();

  const client_data = useSelector((state: RootState) => state.client.data);
  const selected_client = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const [page, setPage] = useState(accessories_only ? 2 : 0);
  const [selected_specs, setSelectedSpecs] = useState<any>(null);
  const [selected_line, setSelectedLine] = useState("");

  // passed states
  const [device_location, setDeviceLocation] = useState("");
  const [device_url, setDeviceUrl] = useState("");
  const [device_color, setDeviceColor] = useState("");
  const [supplier, setSupplier] = useState("");
  const [scraped_info, setScrapedInfo] = useState<ScrapedStockInfo | null>(
    null
  );

  //addons
  const [addons, setAddons] = useState<string[]>([]);

  // return device info
  const [ret_device_name, setRetDeviceName] = useState("");
  const [ret_sn, setRetSN] = useState("");
  const [ret_note, setRetNote] = useState("");
  const [ret_condition, setRetCondition] = useState("");
  const [ret_activation, setRetActivation] = useState("");

  const [delete_modal, setDeleteModal] = useState(false);
  const [delete_line, setDeleteLine] = useState("");
  const [delete_spec, setDeleteSpec] = useState("");
  const [delete_loading, setDeleteLoading] = useState(false);
  const [delete_status, setDeleteStatus] = useState(-1);

  const completeAddAccessories = (include_items: string[]) => {
    setAddons(include_items);
    setPage(3);
  };

  useEffect(() => {
    if (page === 0) {
      if (accessories_only) {
        setPageNumber(0);
      } else {
        setDeviceColor("");
        setDeviceLocation("");
        setAddons([]);
        setRetDeviceName("");
        setRetSN("");
        setRetCondition("");
        setRetNote("");
        setRetActivation("");
        setScrapedInfo(null);
      }
    }
  }, [page]);

  const closeDeleteModal = () => {
    if (!delete_loading) {
      setDeleteLine("");
      setDeleteSpec("");
      setDeleteModal(false);
    }
  };

  const deleteSpec = async () => {
    setDeleteLoading(true);

    const access_token = await getAccessTokenSilently();
    const delete_obj = {
      brand,
      type: delete_line,
      specs: delete_spec,
      client: client_data === "spokeops" ? selected_client : client_data,
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
    } else {
      setDeleteStatus(1);
    }
    setDeleteLoading(false);
  };

  return (
    <Stack spacing={2} pt={2}>
      <Typography
        textAlign="left"
        component="h4"
        variant="h6"
        fontWeight="bold"
        fontSize="120%"
      >
        New Purchase - {accessories_only ? "Accessories" : brand}
      </Typography>
      {page > 0 && selected_line !== "" && selected_specs !== null && (
        <>
          <Divider />
          <Typography component="h5" fontWeight="bold" fontSize="105%">
            Order Details
          </Typography>
          <Stack direction="row" spacing={2}>
            {scraped_info !== null && scraped_info.image_source && (
              <img
                title="laptop picture"
                src={scraped_info.image_source}
                style={{ maxHeight: 200, maxWidth: 250 }}
              />
            )}
            <div>
              <Typography>Device:</Typography>
              <ul>
                <li>
                  <Typography>{selected_line}</Typography>
                </li>
                <li>
                  <Typography>
                    Requested Specs: {selected_specs.spec}
                  </Typography>
                </li>
                {device_color !== "" && (
                  <li>
                    <Typography>Device Color: {device_color}</Typography>
                  </li>
                )}
                {device_location !== "" && (
                  <li>
                    <Typography>Location: {device_location}</Typography>
                  </li>
                )}
              </ul>
              {addons.length > 0 && (
                <>
                  <Typography>Accessories:</Typography>
                  <ul>
                    {addons.map((i) => (
                      <li>{i}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Stack>
        </>
      )}
      {page > 2 && accessories_only && addons.length > 0 && (
        <>
          <Divider />
          <Typography>Accessories:</Typography>
          <ul>
            {addons.map((i) => (
              <li>{i}</li>
            ))}
          </ul>
        </>
      )}
      {page === 0 &&
        !accessories_only &&
        device_lines &&
        device_lines.length > 0 &&
        device_lines.map((line: any) => {
          return (
            <>
              <Typography component="h5" fontWeight="bold" fontSize="105%">
                {line.type}
              </Typography>
              <Stack spacing={2}>
                {line.specs &&
                  line.specs.length > 0 &&
                  line.specs.map((spec: any) => {
                    return (
                      <Stack direction="row" spacing={2}>
                        <Modal open={delete_modal} onClose={closeDeleteModal}>
                          <Box sx={box_style}>
                            <Stack
                              spacing={2}
                              sx={{ alignItems: "center", marginLeft: "auto" }}
                            >
                              {delete_status > -1 && (
                                <Alert
                                  severity={
                                    delete_status === 0 ? "success" : "error"
                                  }
                                >
                                  {delete_status === 0
                                    ? "Successfully deleted!"
                                    : "Error in deleting..."}
                                </Alert>
                              )}
                              <Typography>
                                Are you sure you want to delete this spec?
                              </Typography>
                              <Typography>
                                Device Line: {delete_line}
                              </Typography>
                              <Typography>Spec: {delete_spec}</Typography>
                              {delete_loading && <LinearLoading />}
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                spacing={2}
                              >
                                <Button
                                  variant="contained"
                                  sx={button_style}
                                  onClick={deleteSpec}
                                  disabled={
                                    delete_loading || delete_status === 0
                                  }
                                >
                                  Delete
                                </Button>
                                <Button
                                  onClick={() => {
                                    setDeleteLine("");
                                    setDeleteSpec("");
                                    setDeleteModal(false);
                                  }}
                                  disabled={
                                    delete_loading || delete_status === 0
                                  }
                                >
                                  Cancel
                                </Button>
                              </Stack>
                            </Stack>
                          </Box>
                        </Modal>
                        <Tooltip
                          title="Delete spec"
                          onClick={() => {
                            setDeleteLine(line.type);
                            setDeleteSpec(spec.spec);
                            setDeleteModal(true);
                          }}
                        >
                          <IconButton>
                            <DeleteForeverIcon />
                          </IconButton>
                        </Tooltip>
                        <Card
                          sx={{ borderRadius: "25px", width: "100%" }}
                          onClick={() => {
                            setSelectedSpecs(spec);
                            setSelectedLine(line.type);
                            setPage(1);
                          }}
                        >
                          <CardContent
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography>{spec.spec}</Typography>
                            <ChevronRightIcon />
                          </CardContent>
                        </Card>
                      </Stack>
                    );
                  })}
              </Stack>
            </>
          );
        })}
      {page === 1 && (
        <DeviceSelectionPageTwo
          spec_options={selected_specs}
          device_line={selected_line}
          setPage={setPage}
          brand={brand}
          setScrapedInfo={setScrapedInfo}
          scraped_info={scraped_info}
          setDeviceColor={setDeviceColor}
          setDeviceLocation={setDeviceLocation}
          setDeviceUrl={setDeviceUrl}
          setSupplier={setSupplier}
        />
      )}
      {page === 2 && (
        <>
          <Divider textAlign="left">Choose Accessories</Divider>
          <AccessoriesSelection
            client={client_data === "spokeops" ? selected_client : client_data}
            ret_device={ret_device_name}
            setRetDevice={setRetDeviceName}
            ret_sn={ret_sn}
            setRetSN={setRetSN}
            ret_condition={ret_condition}
            setRetCondition={setRetCondition}
            ret_act_key={ret_activation}
            setRetActKey={setRetActivation}
            ret_note={ret_note}
            setRetNote={setRetNote}
            addons={addons}
            addAccessories={setAddons}
            nextStep={completeAddAccessories}
          />
        </>
      )}
      {page === 3 && (
        <RecipientFormPage
          setPage={setPage}
          device_name={selected_line}
          device_specs={selected_specs?.spec}
          device_location={device_location}
          device_url={device_url}
          supplier={supplier}
          ret_device_name={ret_device_name}
          ret_sn={ret_sn}
          ret_activation={ret_activation}
          ret_condition={ret_condition}
          ret_note={ret_note}
          addons={addons}
          color={device_color}
          scraped_info={scraped_info}
          accessories_only={accessories_only}
        />
      )}
      {page === 0 && (
        <Stack direction="row">
          <Button
            onClick={() => {
              setPageNumber(1);
            }}
          >
            Back
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default DeviceSelectionPage;
