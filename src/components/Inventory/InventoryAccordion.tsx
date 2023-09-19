import React, { useState } from "react";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  CardMedia,
  Grid,
  Typography,
  Chip,
  useTheme,
  AccordionDetails,
} from "@mui/material";

import EndOfLife from "./Tables/EndOfLife";
import InStock from "./Tables/InStock";
import Deployed from "./Tables/Deployed";
import Pending from "./Tables/Pending";

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
  } = props;

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState<Order>("asc");

  const isDarkTheme = useTheme().palette.mode === "dark";

  const sortHandler = (cell: string) => (event: React.MouseEvent<unknown>) => {
    const isAsc = orderBy === cell && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(cell);
  };

  const tableSort = () => {
    let devices = [...serial_numbers];
    if (orderBy === "Serial Number") {
      if (order === "asc") {
        return devices.sort((a, b) => (a.sn > b.sn ? 1 : b.sn > a.sn ? -1 : 0));
      } else {
        return devices.sort((a, b) => (a.sn < b.sn ? 1 : b.sn < a.sn ? -1 : 0));
      }
    } else if (orderBy === "Condition") {
      if (order === "asc") {
        return devices.sort((a, b) =>
          a.condition! > b.condition! ? 1 : b.condition! > a.condition! ? -1 : 0
        );
      } else {
        return devices.sort((a, b) =>
          a.condition! < b.condition! ? 1 : b.condition! < a.condition! ? -1 : 0
        );
      }
    } else if (orderBy === "Grade") {
      if (order === "asc") {
        return devices.sort((a, b) =>
          a.grade! > b.grade! ? 1 : b.grade! > a.grade! ? -1 : 0
        );
      } else {
        return devices.sort((a, b) =>
          a.grade! < b.grade! ? 1 : b.grade! < a.grade! ? -1 : 0
        );
      }
    }

    return devices;
  };

  return (
    <Accordion defaultExpanded={props.total_devices === 1}>
      <AccordionSummary id={"inventory-accordionsummary-" + index}>
        <Grid
          container
          spacing={{ md: 2 }}
          justifyItems={{ md: "space-between" }}
          justifyContent="center"
          flexGrow={{ md: 1 }}
          alignItems="center"
          direction={{ md: "row", xs: "column" }}
          flexDirection={{ xs: "column", md: "row" }}
          display={{ md: "flex", xs: "block" }}
        >
          <Grid
            item
            xs={4}
            md={2.5}
            justifyContent="center"
            alignContent="center"
          >
            <CardMedia
              component="img"
              sx={{ width: 175 }}
              image={image_source}
              alt="laptop"
            />
          </Grid>
          <Grid item xs={4} md={6.5}>
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
          </Grid>
          <Grid
            item
            xs={4}
            md={3}
            display={{ xs: "flex", md: "block" }}
            justifyItems={{ xs: "space-evenly" }}
          >
            <Typography>{location}</Typography>
            <Chip
              label={
                serial_numbers.length === 0
                  ? "Out of Stock"
                  : serial_numbers.length +
                    (tabValue === 0
                      ? " in stock"
                      : tabValue === 1
                      ? " deployed"
                      : tabValue === 3
                      ? " device" + (serial_numbers.length > 1 ? "s" : "")
                      : " pending")
              }
              sx={{
                backgroundColor:
                  serial_numbers.length < 10 && tabValue === 0
                    ? "#ffefea"
                    : "#ebebeb",
                color:
                  serial_numbers.length < 10 && tabValue === 0
                    ? "#DC0202"
                    : "black",
                marginTop: { md: "20px" },
                marginLeft: { md: "0px", xs: "15px" },
              }}
            />
          </Grid>
        </Grid>
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
            tableSort={tableSort}
            serial_numbers={serial_numbers}
            name={name}
            location={location}
            id={id}
            image_source={image_source}
          />
        )}
        {tabValue === 1 && (
          <Deployed
            tableSort={tableSort}
            serial_numbers={serial_numbers}
            name={name}
            location={location}
            id={id}
            image_source={image_source}
          />
        )}
        {tabValue === 2 && (
          <Pending
            tableSort={tableSort}
            serial_numbers={serial_numbers}
            name={name}
            location={location}
            id={id}
            image_source={image_source}
            clientData={props.clientData}
          />
        )}
        {tabValue === 3 && (
          <EndOfLife
            tableSort={tableSort}
            serial_numbers={serial_numbers}
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
