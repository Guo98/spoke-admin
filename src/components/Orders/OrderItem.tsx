import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import {
  Grid,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Chip,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { Item } from "../../interfaces/orders";
import ManageOrder from "./ManageOrder";

interface OrderProps {
  order_number: number;
  first_name: string;
  last_name: string;
  city: string;
  country: string;
  items: Item[];
  state: string;
  email: string;
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "white",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const OrderItem = (props: OrderProps) => {
  const {
    order_number,
    first_name,
    last_name,
    city,
    country,
    items,
    state,
    email,
  } = props;
  const [laptopName, setLaptopName] = useState("");
  const [laptopTracking, setLaptopTracking] = useState("");

  const orderStatus = () => {
    if (laptopTracking === "") {
      return "Order Received";
    } else {
      return "Shipped";
    }
  };

  const statusBgColor = () => {
    if (laptopTracking === "") {
      return "#FBF1DD";
    } else {
      return "#ECE7F1";
    }
  };

  const statusTextColor = () => {
    if (laptopTracking === "") {
      return "#FF6900";
    } else {
      return "#6A37E8";
    }
  };

  const anyTrackingNumbers = () => {
    let anyTrackingNumbers = false;

    items.forEach((item) => {
      if (item.tracking_number !== "") {
        anyTrackingNumbers = true;
      }
    });

    return anyTrackingNumbers;
  };

  useEffect(() => {
    let itemFilter = items.filter(
      (item) => item.type && item.type === "laptop"
    );

    if (itemFilter.length > 0) {
      setLaptopName(itemFilter[0].name);
      setLaptopTracking(itemFilter[0].tracking_number[0]);
    }
  }, [items]);

  return (
    <Accordion>
      <AccordionSummary>
        <Grid container>
          <Grid item xs={2}>
            <Typography fontWeight="bold">Order #{order_number}</Typography>
            <Typography>
              {first_name} {last_name}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              {state}, {country}
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography>{laptopName}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Box display="flex" justifyContent="flex-end">
              <Chip
                label={orderStatus()}
                sx={{
                  width: "116px",
                  backgroundColor: statusBgColor(),
                  color: statusTextColor(),
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: "0px", backgroundColor: "#F8F8F8" }}>
        <Grid
          container
          justifyContent="space-evenly"
          sx={{ paddingLeft: 3 }}
          alignItems="center"
        >
          <Grid item xs={9}>
            <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
              <Table aria-label="items table">
                <TableHead>
                  <TableRow>
                    <TableCell width="70%">
                      <Typography fontWeight="bold">Item</Typography>
                    </TableCell>
                    <TableCell width="30%">
                      <Typography fontWeight="bold">Quantity</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => {
                    return (
                      <TableRow hover>
                        <TableCell width="70%">{item.name}</TableCell>
                        <TableCell width="30%">{item.quantity || 1}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={3}>
            <Box display="flex" justifyContent="flex-end">
              <ManageOrder
                order_no={order_number}
                name={first_name + " " + last_name}
                items={items}
                email={email}
                order={true}
              />
            </Box>
            {anyTrackingNumbers() && (
              <Box
                display="flex"
                justifyContent="flex-end"
                sx={{ marginTop: "15px" }}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    width: "116px",
                    borderRadius: "999em 999em 999em 999em",
                    textTransform: "none",
                  }}
                  href={"https://withspoke.aftership.com/"}
                  target="_blank"
                >
                  Track
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderItem;

// "https://withspoke.aftership.com/"
