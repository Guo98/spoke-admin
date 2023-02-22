import React, { useState } from "react";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  CardMedia,
  CardContent,
  Grid,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableSortLabel,
  Paper,
  Chip,
  Button,
  useTheme,
  AccordionDetails,
} from "@mui/material";
import AssignModal from "./AssignModal";
import ManageModal from "./ManageModal";
import AddToStock from "./AddModalBoxes/AddToStock";
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
}

const InventoryAccordion = (props: InventoryAccordionProps) => {
  const {
    name,
    location,
    serial_numbers,
    image_source,
    specs: { screen_size, cpu, ram, hard_drive } = {},
    tabValue,
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
    <Accordion>
      <AccordionSummary>
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
      >
        {serial_numbers.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
            <Table aria-label="device-table">
              <TableHead>
                <TableRow>
                  <TableCell
                    key="SerialNumber"
                    width={tabValue === 2 ? "25%" : "40%"}
                    sortDirection={orderBy === "Serial Number" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "Serial Number"}
                      onClick={sortHandler("Serial Number")}
                      direction={orderBy === "Serial Number" ? order : "asc"}
                    >
                      <Typography fontWeight="bold">Serial Number</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="Condition"
                    width="20%"
                    sortDirection={orderBy === "Condition" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "Condition"}
                      onClick={sortHandler("Condition")}
                      direction={orderBy === "Condition" ? order : "asc"}
                    >
                      <Typography fontWeight="bold">
                        {tabValue === 0
                          ? "Condition"
                          : tabValue === 1
                          ? "Employee"
                          : "Status"}
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="Grade"
                    width={tabValue === 2 ? "15%" : "20%"}
                    sortDirection={orderBy === "Grade" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "Grade"}
                      onClick={sortHandler("Grade")}
                      direction={orderBy === "Grade" ? order : "asc"}
                    >
                      <Typography fontWeight="bold">
                        {tabValue === 0
                          ? "Grade"
                          : tabValue === 1
                          ? "Date Deployed"
                          : "Quantity"}
                      </Typography>
                    </TableSortLabel>
                  </TableCell>
                  {tabValue === 2 && (
                    <TableCell key="Date" width="20%">
                      <Typography fontWeight="bold">Date Requested</Typography>
                    </TableCell>
                  )}
                  <TableCell key="Action" width="20%">
                    <Typography fontWeight="bold">Action</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serial_numbers.length > 0 &&
                  tableSort().map((item, index) => {
                    const { sn, condition } = item;
                    return (
                      <TableRow key={index}>
                        <TableCell width={tabValue === 2 ? "25%" : "40%"}>
                          <Typography>{sn}</Typography>
                        </TableCell>
                        <TableCell width="20%">
                          <Typography>
                            {tabValue === 0
                              ? condition
                              : tabValue === 1
                              ? item.first_name + " " + item.last_name
                              : item.status}
                          </Typography>
                        </TableCell>
                        <TableCell width={tabValue === 2 ? "15%" : "40%"}>
                          <Typography>
                            {tabValue === 0
                              ? condition === "Used" && item.grade
                              : tabValue === 1
                              ? item.date_deployed
                              : item.quantity || 1}
                          </Typography>
                        </TableCell>
                        {tabValue === 2 && (
                          <TableCell width="20%">
                            <Typography>{item.date_requested}</Typography>
                          </TableCell>
                        )}
                        <TableCell width="20%">
                          {tabValue === 0 && (
                            <AssignModal
                              serial_number={sn}
                              device_name={name}
                              device_location={location}
                              image_source={image_source}
                              type="individual"
                            />
                          )}
                          {tabValue === 1 && (
                            <ManageModal
                              name={{
                                first_name: item.first_name!,
                                last_name: item.last_name!,
                              }}
                              address={item.address!}
                              email={item.email!}
                              serial_number={item.sn}
                              device_name={name}
                              device_location={location}
                              phone_number={item.phone_number!}
                              type="individual"
                            />
                          )}
                          {tabValue === 2 && item.tracking_number && (
                            <Button
                              href={
                                "https://withspoke.aftership.com/" +
                                item.tracking_number
                              }
                              target="_blank"
                            >
                              Track
                            </Button>
                          )}
                          {tabValue === 2 &&
                            props.clientData === "spokeops" &&
                            item.quantity && (
                              <AddToStock quantity={item.quantity!} />
                            )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography textAlign="center">Out of Stock</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default InventoryAccordion;
