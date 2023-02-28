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
import { updateOrders } from "../../app/slices/ordersSlice";
import { useDispatch } from "react-redux";
import { postOrder, getAllOrders } from "../../services/ordersAPI";
import { useAuth0 } from "@auth0/auth0-react";
import { Order } from "../../interfaces/orders";
import ManageOrder from "./ManageOrder";

interface OrderProps extends Order {
  clientui?: string;
  actualClient?: string;
  index: number;
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
    orderNo,
    firstName,
    lastName,
    address: { subdivision, country },
    items,
    email,
    shipping_status,
    clientui,
    index,
  } = props;

  let tempItems = JSON.parse(JSON.stringify(items));

  const dispatch = useDispatch();

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
    } else if (
      shipping_status === "Completed" ||
      shipping_status === "Complete"
    ) {
      return "Completed";
    }
  };

  const statusBgColor = () => {
    if (!laptopTracking && shipping_status === "Incomplete") {
      return "#FFF8EF";
    } else if (shipping_status === "Incomplete") {
      return "#ECE7F1";
    } else if (
      shipping_status === "Completed" ||
      shipping_status === "Complete"
    ) {
      return "#E8FDFF";
    }
  };

  const statusTextColor = () => {
    if (!laptopTracking && shipping_status === "Incomplete") {
      return "#DC282A";
    } else if (shipping_status === "Incomplete") {
      return "#6A37E8";
    } else if (
      shipping_status === "Completed" ||
      shipping_status === "Complete"
    ) {
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
        clientui: props.actualClient,
        full_name: firstName + " " + lastName,
        items: tempItems,
        order_id: props.id,
        status: shipping_status,
      };
      const postOrderResp = await postOrder(
        "updateTrackingNumber",
        accessToken,
        bodyObj
      );

      if (postOrderResp.status === "Success") {
        const ordersResult = await getAllOrders(accessToken, props.client);
        dispatch(updateOrders(ordersResult.data));
      }
    }

    setAdminedit(false);
  };

  const completeOrder = async () => {
    const accessToken = await getAccessTokenSilently();
    const bodyObj = { ...props };
    delete bodyObj.clientui;
    delete bodyObj.actualClient;
    const completeOrderResp = await postOrder(
      "completeOrder",
      accessToken,
      bodyObj
    );

    if (completeOrderResp.status === "Success") {
      const ordersResult = await getAllOrders(accessToken, props.client);
      dispatch(updateOrders(ordersResult.data));
    }
  };

  return (
    <Accordion>
      <AccordionSummary id={"order-accordionsummary-" + index}>
        <Grid container direction={{ md: "row", xs: "column" }}>
          <Grid item md={2}>
            <Typography fontWeight="bold">Order #{orderNo}</Typography>
            <Typography>
              {firstName} {lastName}
            </Typography>
          </Grid>
          <Grid item md={2}>
            <Typography>
              {subdivision}, {country}
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
        id={"order-accordiondetails-" + index}
      >
        <Grid
          container
          justifyContent="space-evenly"
          sx={{ paddingLeft: 3 }}
          alignItems="center"
        >
          <Grid item xs={clientui === "spokeops" ? 12 : 9}>
            <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
              <Table aria-label="items table">
                <TableHead>
                  <TableRow>
                    <TableCell width="50%">
                      <Typography fontWeight="bold">Item</Typography>
                    </TableCell>
                    <TableCell width="25%">
                      <Typography fontWeight="bold">Quantity</Typography>
                    </TableCell>
                    {clientui !== "spokeops" && (
                      <TableCell width="25%">
                        <Typography fontWeight="bold" align="right">
                          Price
                        </Typography>
                      </TableCell>
                    )}
                    {clientui === "spokeops" && (
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
                        <TableCell width="50%">{item.name}</TableCell>
                        <TableCell width="25%">{item.quantity || 1}</TableCell>
                        {clientui !== "spokeops" && (
                          <TableCell width="25%" align="right">
                            <Typography>
                              $
                              {item.price.toString().indexOf(".") > -1
                                ? item.price
                                : item.price + ".00"}
                            </Typography>
                          </TableCell>
                        )}
                        {clientui === "spokeops" && (
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
          {clientui !== "spokeops" && (
            <Grid item xs={3}>
              <Box display="flex" justifyContent="flex-end">
                <ManageOrder
                  order_no={orderNo}
                  name={firstName + " " + lastName}
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
        {clientui === "spokeops" && (
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
              <Button
                fullWidth
                variant="contained"
                onClick={completeOrder}
                disabled={
                  shipping_status === "Completed" ||
                  shipping_status === "Complete"
                }
              >
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
