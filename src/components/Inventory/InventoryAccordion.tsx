import React, { useState, useEffect } from "react";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  CardMedia,
  Button,
  Typography,
  Chip,
  useTheme,
  AccordionDetails,
  Stack,
} from "@mui/material";
import { useDispatch } from "react-redux";

import EndOfLife from "./Tables/EndOfLife";
import InStock from "./Tables/InStock";
import Deployed from "./Tables/Deployed";
import Pending from "./Tables/Pending";
import AppContainer from "../AppContainer/AppContainer";

import { openMarketplace } from "../../app/slices/marketSlice";
import { InventorySummary } from "../../interfaces/inventory";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:before": {
    display: "none",
  },
  marginBottom: 5,
  borderRadius: "10px",
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ExpandMoreIcon />} {...props} />
))(({ theme }) => ({
  flexDirection: "row",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

type Order = "asc" | "desc";

interface InventoryAccordionProps extends InventorySummary {
  tabValue: number;
  clientData?: string;
  index: number;
  total_devices: number;
  search_serial_number: string;
  refresh: Function;
  client: string;
}

const InventoryAccordion = (props: InventoryAccordionProps) => {
  const {
    name,
    location,
    serial_numbers,
    image_source,
    specs: { screen_size, cpu, ram, hard_drive } = {},
    tabValue,
    index,
    id,
    refresh,
    search_serial_number,
    client,
  } = props;

  const dispatch = useDispatch();

  const isDarkTheme = useTheme().palette.mode === "dark";

  const [expand, setExpand] = useState(false);

  const market_info = () => {
    const market_obj = {
      imgSrc: image_source || "",
      brand: props.brand,
      client: client,
      specific_device: name,
      location,
      supplier_links: props.marketplace,
      specific_specs:
        props.specs?.screen_size +
        ", " +
        props.specs?.cpu +
        ", " +
        props.specs?.ram +
        ", " +
        props.specs?.hard_drive,
    };

    dispatch(openMarketplace(market_obj));
    AppContainer.navigate("marketplace");
  };

  useEffect(() => {
    if (search_serial_number !== "") {
      if (
        serial_numbers.filter((sn) => sn.sn === search_serial_number).length > 0
      ) {
        setExpand(true);
      }
    }
  }, [serial_numbers]);

  return (
    <Accordion expanded={expand}>
      <AccordionSummary
        id={"inventory-accordionsummary-" + index}
        onClick={() => {
          setExpand(!expand);
        }}
      >
        <Stack direction="row" spacing={2} sx={{ width: "90%" }}>
          <CardMedia
            component="img"
            sx={{ width: 175 }}
            image={image_source}
            alt="laptop"
          />
          <Stack spacing={1} width="70%">
            <Typography fontWeight="bold" fontSize="18px">
              {(props.new_device ? "[Requested] " : "") + name}
            </Typography>
            {!props.new_device && (
              <div>
                <Typography
                  display="inline"
                  component="span"
                  fontWeight="bold"
                  fontSize="14px"
                >
                  Screen Size:{" "}
                </Typography>
                <Typography display="inline" component="span" fontSize="14px">
                  {screen_size}
                </Typography>
              </div>
            )}
            {!props.new_device && (
              <div>
                <Typography
                  display="inline"
                  component="span"
                  fontWeight="bold"
                  fontSize="14px"
                >
                  CPU:{" "}
                </Typography>
                <Typography display="inline" component="span" fontSize="14px">
                  {cpu}
                </Typography>
              </div>
            )}
            {!props.new_device && (
              <div>
                <Typography
                  display="inline"
                  component="span"
                  fontWeight="bold"
                  fontSize="14px"
                >
                  RAM:{" "}
                </Typography>
                <Typography display="inline" component="span" fontSize="14px">
                  {ram}
                </Typography>
              </div>
            )}
            {!props.new_device && (
              <div>
                <Typography
                  display="inline"
                  component="span"
                  fontWeight="bold"
                  fontSize="14px"
                >
                  SSD:{" "}
                </Typography>
                <Typography display="inline" component="span" fontSize="14px">
                  {hard_drive}
                </Typography>
              </div>
            )}
          </Stack>
          <Stack spacing={2} justifyContent="space-evenly" width="12%">
            <Typography>{location}</Typography>
            <Chip
              label={
                props.total_devices === 0
                  ? "Out of Stock"
                  : props.total_devices +
                    (tabValue === 0
                      ? " in stock"
                      : tabValue === 1
                      ? " deployed"
                      : tabValue === 3
                      ? " device" + (props.total_devices > 1 ? "s" : "")
                      : " pending")
              }
              sx={{
                backgroundColor:
                  props.total_devices < 10 && tabValue === 0
                    ? "#ffefea"
                    : "#ebebeb",
                color:
                  props.total_devices < 10 && tabValue === 0
                    ? "#DC0202"
                    : "black",
                marginTop: { md: "20px" },
                marginLeft: { md: "0px", xs: "15px" },
              }}
            />
            {tabValue === 0 && props.total_devices === 0 && (
              <Button variant="contained" size="small" onClick={market_info}>
                Order More
              </Button>
            )}
          </Stack>
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderTop: "1px solid rgba(0, 0, 0, .125)",
          backgroundColor: isDarkTheme ? "#465059" : "#F8F8F8",
        }}
        id={"inventory-accordiondetails-" + index}
      >
        {tabValue === 0 && (
          <InStock
            serial_numbers={props.in_stock!}
            name={name}
            location={location}
            id={id}
            image_source={image_source}
            searched_serial={search_serial_number}
          />
        )}
        {tabValue === 1 && (
          <Deployed
            serial_numbers={props.deployed!}
            name={name}
            location={location}
            id={id}
            image_source={image_source}
            client={client}
            searched_serial={search_serial_number}
          />
        )}
        {tabValue === 2 && (
          <Pending
            serial_numbers={props.pending!}
            name={name}
            location={location}
            id={id}
            image_source={image_source}
            clientData={props.clientData}
            searched_serial={search_serial_number}
          />
        )}
        {tabValue === 3 && (
          <EndOfLife
            serial_numbers={props.eol!}
            name={name}
            location={location}
            id={id}
            refresh={refresh}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default InventoryAccordion;
