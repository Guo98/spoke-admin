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
  Stack,
  Link,
  Card,
  CardContent,
} from "@mui/material";
import { Order } from "../../interfaces/orders";
import ManageOrder from "./ManageOrder";
import OperationsManage from "./OperationsManage";
import DeleteModal from "../Operations/DeleteModal";
import AppContainer from "../AppContainer/AppContainer";

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
    address: { subdivision, country },
    items,
    email,
    shipping_status,
    clientui,
    index,
    full_name,
    date,
  } = props;

  const [laptopName, setLaptopName] = useState("");
  const [laptopTracking, setLaptopTracking] = useState("");
  const [serial_number, setSN] = useState("");
  const [expanded, setExpanded] = useState(false);

  const isDarkTheme = useTheme().palette.mode === "dark";

  const orderStatus = () => {
    if (anyTrackingNumbers() === "" && shipping_status === "Incomplete") {
      return "Order Received";
    } else if (
      shipping_status === "Completed" ||
      shipping_status === "Complete"
    ) {
      return "Completed";
    } else {
      return shipping_status;
    }
  };

  const statusBgColor = () => {
    if (anyTrackingNumbers() === "" && shipping_status === "Incomplete") {
      return "#FFF8EF";
    } else if (shipping_status === "Shipped") {
      return "#ECE7F1";
    } else if (
      shipping_status === "Completed" ||
      shipping_status === "Complete"
    ) {
      return "#E8FDFF";
    }
  };

  const statusTextColor = () => {
    if (anyTrackingNumbers() === "" && shipping_status === "Incomplete") {
      return "#DC282A";
    } else if (shipping_status === "Shipped") {
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
      if (
        items[i].tracking_number &&
        items[i].tracking_number !== "" &&
        items[i].tracking_number[0] !== "" &&
        items[i].tracking_number[0] !== " "
      ) {
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
      if (itemFilter[0].serial_number) setSN(itemFilter[0].serial_number);
    } else {
      setLaptopName("");
      setLaptopTracking("");
      setSN("");
    }
  }, [items]);

  const getCourierHost = (courier: string, tracking_number: string) => {
    if (courier === "fedex") {
      return "https://www.fedex.com/fedextrack/?trknbr=" + tracking_number;
    } else if (courier === "ups") {
      return (
        "https://wwwapps.ups.com/tracking/tracking.cgi?tracknum=" +
        tracking_number
      );
    } else if (courier === "usps") {
      return (
        "https://tools.usps.com/go/TrackConfirmAction_input?strOrigTrackNum=" +
        tracking_number
      );
    } else if (courier === "dhl") {
      return (
        "http://www.dhl.com/en/express/tracking.html?AWB=" +
        tracking_number +
        "&brand=DHL"
      );
    } else if (courier === "correios") {
      return "";
    } else {
      return "";
    }
  };

  return (
    <Accordion key={index} onChange={(e, expanded) => setExpanded(expanded)}>
      <AccordionSummary id={"order-accordionsummary-" + index}>
        <Grid container direction={{ md: "row", xs: "column" }}>
          <Grid item md={2}>
            <Typography fontWeight="bold">Order #{orderNo}</Typography>
            <Typography>{full_name}</Typography>
          </Grid>
          <Grid item md={2}>
            {!expanded && (
              <>
                <Typography>{date}</Typography>
                <Typography>
                  {subdivision}, {country}
                </Typography>
              </>
            )}
          </Grid>
          <Grid item md={5} zeroMinWidth>
            {!expanded && (
              <>
                <Typography
                  fontWeight="bold"
                  noWrap
                  sx={{ textOverflow: "ellipsis", overflow: "hidden" }}
                >
                  {laptopName}
                </Typography>
                <Typography>{serial_number}</Typography>
              </>
            )}
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
        <Card sx={{ ml: 3, mb: 2, borderRadius: "10px" }}>
          <CardContent>
            <Stack direction="column" spacing={1}>
              <Typography fontWeight="bold">
                Date Ordered:{" "}
                <Typography display="inline" component="span">
                  {date}
                </Typography>
              </Typography>
              <Typography fontWeight="bold">
                Order Location:{" "}
                <Typography display="inline" component="span">
                  {subdivision}, {country}
                </Typography>
              </Typography>
              <Typography fontWeight="bold">
                Employee Email:{" "}
                <Typography display="inline" component="span">
                  {email}
                </Typography>
              </Typography>
              {laptopName !== "" && (
                <Typography fontWeight="bold">
                  Device:{" "}
                  <Typography display="inline" component="span">
                    {laptopName}
                  </Typography>
                </Typography>
              )}
              {serial_number !== "" && (
                <Typography fontWeight="bold" sx={{ textIndent: "30px" }}>
                  - Device Serial Number:{" "}
                  <Typography display="inline" component="span">
                    {serial_number}
                  </Typography>
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
        <Grid
          container
          justifyContent="space-evenly"
          sx={{ paddingLeft: 3 }}
          alignItems="center"
        >
          <Grid item xs={10}>
            <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
              <Table aria-label="items table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography fontWeight="bold">Item</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold">Quantity</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" align="right">
                        Price
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" align="right">
                        Tracking Number
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" align="right">
                        Courier
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, index) => {
                    return (
                      <TableRow hover>
                        <TableCell>
                          {item.serial_number ? (
                            <Link
                              onClick={() =>
                                AppContainer.navigate(
                                  "/inventory?sn=" + item.serial_number
                                )
                              }
                              aria-label="Go to selected device on inventory tab"
                            >
                              {item.name}
                            </Link>
                          ) : (
                            item.name
                          )}
                        </TableCell>
                        <TableCell>{item.quantity || 1}</TableCell>
                        <TableCell align="right">
                          <Typography>
                            $
                            {item.price.toString().indexOf(".") > -1
                              ? item.price
                              : item.price + ".00"}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {item.tracking_number.length > 0 &&
                          item.courier &&
                          getCourierHost(
                            item.courier.toLowerCase(),
                            item.tracking_number[0]
                          ) !== "" ? (
                            <Link
                              href={getCourierHost(
                                item.courier.toLowerCase(),
                                item.tracking_number[0]
                              )}
                              aria-label="Tracking link that'll open in a new page"
                              target="_blank"
                            >
                              {item.tracking_number}
                            </Link>
                          ) : (
                            item.tracking_number
                          )}
                        </TableCell>
                        <TableCell align="right">{item.courier}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={2}>
            <Box display="flex" justifyContent="flex-end">
              {clientui !== "spokeops" ? (
                <ManageOrder
                  order_no={orderNo}
                  name={full_name}
                  items={items}
                  email={email}
                  order={true}
                />
              ) : (
                <>
                  <Stack direction="column" spacing={2}>
                    <OperationsManage {...props} />
                    <DeleteModal
                      id={props.id}
                      client={props.client}
                      full_name={props.full_name}
                    />
                  </Stack>
                </>
              )}
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
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default OrderItem;

// "https://withspoke.aftership.com/"
