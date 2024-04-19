import React, { useState, useEffect } from "react";
import {
  Stack,
  Typography,
  Divider,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import DeviceSelectionPageTwo from "./DeviceSelectionPageTwo";
import RecipientFormPage from "../RecipientFormPage";
import AccessoriesSelection from "./AccessoriesSelection";

import { ScrapedStockInfo } from "../../../interfaces/marketplace";
import { RootState } from "../../../app/store";

interface DeviceSelectionProps {
  brand: string;
  device_lines: any;
  setPageNumber: Function;
}

const DeviceSelectionPage = (props: DeviceSelectionProps) => {
  const { brand, device_lines, setPageNumber } = props;

  const client_data = useSelector((state: RootState) => state.client.data);
  const selected_client = useSelector(
    (state: RootState) => state.client.selectedClient
  );

  const [page, setPage] = useState(0);
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

  const completeAddAccessories = (include_items: string[]) => {
    setAddons(include_items);
    setPage(3);
  };

  useEffect(() => {
    if (page === 0) {
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
  }, [page]);

  return (
    <Stack spacing={2} pt={2}>
      <Typography
        textAlign="left"
        component="h4"
        variant="h6"
        fontWeight="bold"
        fontSize="120%"
      >
        New Purchase - {brand}
      </Typography>
      <Divider />
      {page > 0 && selected_line !== "" && selected_specs !== null && (
        <>
          <Typography component="h5" fontWeight="bold" fontSize="105%">
            Order Details
          </Typography>
          <Stack direction="row" spacing={2}>
            {scraped_info !== null && scraped_info.image_source && (
              <img title="laptop picture" src={scraped_info.image_source} />
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
      {page === 0 &&
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
                      <Card
                        sx={{ borderRadius: "25px" }}
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
          device_specs={selected_specs.spec}
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
