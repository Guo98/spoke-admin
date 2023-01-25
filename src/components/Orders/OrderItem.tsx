import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Grid from "@mui/material/Grid";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
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
            <Chip
              label={orderStatus()}
              sx={{
                width: "116px",
                backgroundColor: statusBgColor(),
                color: statusTextColor(),
              }}
            />
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: "0px" }}>
        <Grid container justifyContent="space-evenly" sx={{ paddingLeft: 3 }}>
          <Grid item xs={9}>
            <Typography component="h4" fontWeight="bold">
              Item{items.length > 1 ? "s" : ""} Ordered:{" "}
            </Typography>
            <ul>
              {items.map((item) => {
                return (
                  <li>
                    <Grid container spacing={2}>
                      <Grid item xs={10}>
                        <Typography>{item.name}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        {item.tracking_number[0] && (
                          <Link
                            href={
                              "https://withspoke.aftership.com/" +
                              item.tracking_number[0]
                            }
                          >
                            Track
                          </Link>
                        )}
                      </Grid>
                    </Grid>
                  </li>
                );
              })}
            </ul>
          </Grid>
          <Grid item xs={3}>
            <ManageOrder
              order_no={order_number}
              name={first_name + " " + last_name}
              items={items}
              email={email}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderItem;
