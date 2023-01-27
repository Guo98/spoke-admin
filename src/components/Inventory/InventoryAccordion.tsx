import React, { useState } from "react";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
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
} from "@mui/material";
import AssignModal from "./AssignModal";
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

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  backgroundColor: "#F8F8F8",
}));

type Order = "asc" | "desc";

const InventoryAccordion = (props: InventorySummary) => {
  const {
    name,
    location,
    serial_numbers,
    index,
    setFilters,
    image_source,
    type,
    specs: { screen_size, cpu, ram, hard_drive },
  } = props;

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState<Order>("asc");

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
          spacing={2}
          justifyItems="space-between"
          justifyContent="center"
          flexGrow={1}
        >
          <Grid item xs={4} sm={2}>
            <CardMedia
              component="img"
              sx={{ width: 175 }}
              image={image_source}
              alt="laptop"
            />
          </Grid>
          <Grid item xs={6} sm={7}>
            <CardContent>
              <Typography fontWeight="bold" fontSize="18px">
                {name}
              </Typography>
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
            </CardContent>
          </Grid>
          <Grid item xs={2} sm={3}>
            <CardContent>
              <Typography>{location}</Typography>
              <Chip
                label={
                  serial_numbers.length === 0
                    ? "Out of Stock"
                    : serial_numbers.length + " in stock"
                }
                sx={{
                  backgroundColor:
                    serial_numbers.length < 10 ? "#ffefea" : "#ebebeb",
                  color: serial_numbers.length < 10 ? "red" : "black",
                  marginTop: "20px",
                }}
              />
            </CardContent>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {serial_numbers.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
            <Table aria-label="device-table">
              <TableHead>
                <TableRow>
                  <TableCell
                    key="SerialNumber"
                    width="50%"
                    sortDirection={orderBy === "Serial Number" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "Serial Number"}
                      onClick={sortHandler("Serial Number")}
                      direction={orderBy === "Serial Number" ? order : "asc"}
                    >
                      <Typography>Serial Number</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="Condition"
                    width="15%"
                    sortDirection={orderBy === "Condition" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "Condition"}
                      onClick={sortHandler("Condition")}
                      direction={orderBy === "Condition" ? order : "asc"}
                    >
                      <Typography>Condition</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    key="Grade"
                    width="15%"
                    sortDirection={orderBy === "Grade" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "Grade"}
                      onClick={sortHandler("Grade")}
                      direction={orderBy === "Grade" ? order : "asc"}
                    >
                      <Typography>Grade</Typography>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell key="Action" width="20%">
                    <Typography>Action</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serial_numbers.length > 0 &&
                  tableSort().map((item) => {
                    const { sn, condition } = item;
                    return (
                      <TableRow>
                        <TableCell width="50%">
                          <Typography>{sn}</Typography>
                        </TableCell>
                        <TableCell width="15%">
                          <Typography>{condition}</Typography>
                        </TableCell>
                        <TableCell width="15%">
                          <Typography>
                            {condition === "Used" && item.grade}
                          </Typography>
                        </TableCell>
                        <TableCell width="20%">
                          <AssignModal
                            serial_number={sn}
                            device_name={name}
                            device_location={location}
                            image_source={image_source}
                          />
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
