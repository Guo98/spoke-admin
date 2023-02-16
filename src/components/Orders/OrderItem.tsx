import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
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
  useTheme,
  AccordionDetails,
  TextField,
} from "@mui/material";
import { postOrder } from "../../services/ordersAPI";
import { useAuth0 } from "@auth0/auth0-react";
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
  shipping_status: string;
  client: string;
  actualClient?: string;
  order_id?: string;
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
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

// const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
//   padding: theme.spacing(2),
//   borderTop: "1px solid rgba(0, 0, 0, .125)",
// }));

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
    shipping_status,
    client,
  } = props;
  let tempItems = JSON.parse(JSON.stringify(items));

  const [laptopName, setLaptopName] = useState("");
  const [laptopTracking, setLaptopTracking] = useState("");
  const [adminedit, setAdminedit] = useState(false);
  const [trackingNumbers, setTrackingNumbers] = useState([]);

  const { getAccessTokenSilently } = useAuth0();

  const isDarkTheme = useTheme().palette.mode === "dark";

  const orderStatus = () => {
    if (!laptopTracking && shipping_status === "Incomplete") {
      return "Order Received";
    } else if (shipping_status === "Incomplete") {
      return "Shipped";
    } else if (shipping_status === "Completed") {
      return "Completed";
    }
  };

  const statusBgColor = () => {
    if (!laptopTracking && shipping_status === "Incomplete") {
      return "#FFF8EF";
    } else if (shipping_status === "Incomplete") {
      return "#ECE7F1";
    } else if (shipping_status === "Completed") {
      return "#E8FDFF";
    }
  };

  const statusTextColor = () => {
    if (!laptopTracking && shipping_status === "Incomplete") {
      return "#DC282A";
    } else if (shipping_status === "Incomplete") {
      return "#6A37E8";
    } else if (shipping_status === "Completed") {
      return "#025DFE";
    }
  };

  const anyTrackingNumbers = () => {
    let anyTrackingNumbers = "";

    for (let i = 0; i < items.length; i++) {
      if (items[i].tracking_number !== "") {
        anyTrackingNumbers = items[i].tracking_number[0];
        break;
      }
    }

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

  const saveTrackingNumbers = async () => {
    if (JSON.stringify(tempItems) !== JSON.stringify(items)) {
      const accessToken = await getAccessTokenSilently();
      const bodyObj = {
        client: props.actualClient,
        full_name: first_name + " " + last_name,
        items: tempItems,
        order_id: props.order_id,
        status: shipping_status,
      };
      const postOrderResp = await postOrder(
        "updateTrackingNumber",
        accessToken,
        bodyObj
      );
    }

    setAdminedit(false);
  };

  return (
    <Accordion>
      <AccordionSummary>
        <Grid container direction={{ md: "row", xs: "column" }}>
          <Grid item md={2}>
            <Typography fontWeight="bold">Order #{order_number}</Typography>
            <Typography>
              {first_name} {last_name}
            </Typography>
          </Grid>
          <Grid item md={2}>
            <Typography>
              {state}, {country}
            </Typography>
          </Grid>
          <Grid item md={5}>
            <Typography>{laptopName}</Typography>
          </Grid>
          <Grid item md={3}>
            <Box display={{ md: "flex" }} justifyContent="flex-end">
              <Chip
                label={orderStatus()}
                sx={{
                  width: "125px",
                  backgroundColor: statusBgColor(),
                  color: statusTextColor(),
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderTop: "0px",
          backgroundColor: isDarkTheme ? "#465059" : "#F8F8F8",
        }}
      >
        <Grid
          container
          justifyContent="space-evenly"
          sx={{ paddingLeft: 3 }}
          alignItems="center"
        >
          <Grid item xs={client === "spokeops" ? 12 : 9}>
            <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
              <Table aria-label="items table">
                <TableHead>
                  <TableRow>
                    <TableCell width={client === "spokeops" ? "50%" : "70%"}>
                      <Typography fontWeight="bold">Item</Typography>
                    </TableCell>
                    <TableCell width={client === "spokeops" ? "25%" : "30%"}>
                      <Typography fontWeight="bold">Quantity</Typography>
                    </TableCell>
                    {client === "spokeops" && (
                      <TableCell width="25%">
                        <Typography fontWeight="bold">
                          Tracking Number
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => {
                    return (
                      <TableRow hover>
                        <TableCell
                          width={client === "spokeops" ? "50%" : "70%"}
                        >
                          {item.name}
                        </TableCell>
                        <TableCell
                          width={client === "spokeops" ? "25%" : "30%"}
                        >
                          {item.quantity || 1}
                        </TableCell>
                        {client === "spokeops" && (
                          <TableCell width="25%">
                            {adminedit && item.tracking_number === "" ? (
                              <TextField
                                size="small"
                                onChange={(event) =>
                                  (tempItems[index].tracking_number = [
                                    event.target.value,
                                  ])
                                }
                              />
                            ) : (
                              item.tracking_number
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          {client !== "spokeops" && (
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
              {anyTrackingNumbers() !== "" && (
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
                    href={
                      "https://withspoke.aftership.com/" + anyTrackingNumbers()
                    }
                    target="_blank"
                  >
                    Track
                  </Button>
                </Box>
              )}
            </Grid>
          )}
        </Grid>
        {client === "spokeops" && (
          <Grid
            container
            spacing={2}
            alignItems="center"
            direction="row"
            justifyContent="space-evenly"
            sx={{ paddingLeft: 3, paddingTop: 2 }}
          >
            <Grid item md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setAdminedit(true)}
                disabled={adminedit}
              >
                Edit
              </Button>
            </Grid>
            <Grid item md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={saveTrackingNumbers}
                disabled={!adminedit}
              >
                Save
              </Button>
            </Grid>
            <Grid item md={4}>
              <Button fullWidth variant="contained">
                Mark Complete
              </Button>
            </Grid>
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderItem;

// "https://withspoke.aftership.com/"
