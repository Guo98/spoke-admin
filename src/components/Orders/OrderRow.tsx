import React, { useState, useEffect } from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Collapse,
  IconButton,
  Box,
  Chip,
  Stack,
  useTheme,
  Divider,
  Button,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAuth0 } from "@auth0/auth0-react";

import ItemsTable from "./ItemsTable";
import OperationsManage from "./OperationsManage";
import OrderLaptop from "./OrderLaptop";
import DeleteModal from "../Operations/DeleteModal";

import { Order } from "../../interfaces/orders";

import { standardPost } from "../../services/standard";

interface OrderRowProps extends Order {
  selected_tab: number;
  selected_client: string;
  parent_client: string;
  single_row: boolean;
  index: number;
}

const OrderRow = (props: OrderRowProps) => {
  const { selected_tab, client, full_name, single_row } = props;

  const { user, getAccessTokenSilently } = useAuth0();

  const [open, setOpen] = useState(false);
  const [order_price, setOrderPrice] = useState("");
  const [returned_laptop, setReturnedLaptop] = useState("");
  const [deployed_laptop, setDeployedLaptop] = useState("");

  const [loading, setLoading] = useState(false);
  const [email_sent, setEmailSent] = useState(-1);

  const isDarkTheme = useTheme().palette.mode === "dark";

  const anyTrackingNumbers = () => {
    const { items } = props;
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

  const getStatus = () => {
    const { shipping_status } = props;
    if (anyTrackingNumbers() === "" && shipping_status === "Incomplete") {
      return (
        <Chip
          label={"Order Received"}
          sx={{
            width: "125px",
            backgroundColor: "#FFF8EF",
            color: "#DC282A",
          }}
        />
      );
    } else if (
      shipping_status === "Shipped" ||
      shipping_status === "Incomplete"
    ) {
      return (
        <Chip
          label={"Shipped"}
          sx={{
            width: "125px",
            backgroundColor: "#ECE7F1",
            color: "#6A37E8",
          }}
        />
      );
    } else if (
      shipping_status === "Completed" ||
      shipping_status === "Complete"
    ) {
      return (
        <Chip
          label={"Completed"}
          sx={{
            width: "125px",
            backgroundColor: "#E8FDFF",
            color: "#025DFE",
          }}
        />
      );
    }
  };

  useEffect(() => {
    setDeployedLaptop("");
    setReturnedLaptop("");
    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    if (props.items) {
      let total_price = 0;

      props.items.forEach((i) => {
        if (typeof i.price === "string") {
          total_price += parseFloat((i.price as string).replace(",", ""));
        } else {
          total_price += i.price;
        }

        if (i.type === "laptop") {
          setDeployedLaptop(i.name);
        }

        if (i.name === "Offboarding" || i.name === "Returning") {
          if (i.laptop_name) {
            setReturnedLaptop(i.laptop_name);
          } else {
            setReturnedLaptop(i.name);
          }
        } else if (
          i.name.includes("Return Box") &&
          props.shipping_status !== "Completed"
        ) {
          if (i.date_reminder_sent && !i.delivery_status) {
            setReturnedLaptop("Unreturned Device");
          }
        }
      });

      setOrderPrice(USDollar.format(total_price));
    }
    setOpen(false);
  }, [props.full_name, props.items]);

  const has_yubikey = () => {
    return (
      props.items.filter((i) => i.name.toLowerCase().includes("yubikey"))
        .length > 0
    );
  };

  const get_yubikey_id = () => {
    return props.items.filter((i) =>
      i.name.toLowerCase().includes("yubikey")
    )[0].shipment_id;
  };

  const yubikey_shipping_issue = () => {
    const yubikey_obj = props.items.filter((i) =>
      i.name.toLowerCase().includes("yubikey")
    )[0];

    if (yubikey_obj) {
      const delivery_status = yubikey_obj.delivery_status?.toLowerCase();

      if (delivery_status) {
        return (
          delivery_status.includes("lost") ||
          delivery_status.includes("not valid") ||
          delivery_status.includes("exception")
        );
      }
    }

    return false;
  };

  const send_reminder_email = async () => {
    setLoading(true);
    const access_token = await getAccessTokenSilently();
    const email_body = {
      client,
      name: full_name,
      email: props.email,
      address: props.address.formatted,
      requestor_email: user?.email,
    };
    const email_resp = await standardPost(
      access_token,
      "sendemail/manualreminder",
      email_body
    );

    if (email_resp.status === "Successful") {
      setEmailSent(0);
    } else {
      setEmailSent(1);
    }

    setLoading(false);
  };

  return props.items ? (
    <>
      <TableRow
        sx={{
          backgroundColor: open
            ? isDarkTheme
              ? "#616E82"
              : "#F8F8F8"
            : "primary",
        }}
        key={props.index}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell width="15%">
          <Typography>{props.orderNo}</Typography>
        </TableCell>
        <TableCell width="15%">
          <Typography>
            {new Date(props.date).toLocaleDateString("en-us")}
          </Typography>
        </TableCell>
        <TableCell width="20%">
          <Typography>{props.full_name}</Typography>
        </TableCell>
        <TableCell width="20%">
          {deployed_laptop !== "" ? (
            <Typography>{deployed_laptop}</Typography>
          ) : returned_laptop !== "" ? (
            <Typography
              color={
                returned_laptop !== "Offboarding" &&
                returned_laptop !== "Returning"
                  ? returned_laptop.includes("Unreturned")
                    ? "red"
                    : "#AEDD6B"
                  : ""
              }
            >
              {returned_laptop}
            </Typography>
          ) : has_yubikey() &&
            (!get_yubikey_id() || yubikey_shipping_issue()) ? (
            <Typography color="red">ATTN REQUIRED: Yubikey</Typography>
          ) : (
            <Typography></Typography>
          )}
        </TableCell>
        <TableCell width="15%">
          <Typography>{order_price}</Typography>
        </TableCell>
        <TableCell width="15%">{getStatus()}</TableCell>
      </TableRow>
      <TableRow id={"hidden-row-" + props.index}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ mx: 5, my: 1 }}>
              <Stack spacing={1} mb={2}>
                <Divider
                  textAlign="left"
                  sx={{ fontSize: "115%", fontWeight: "bold" }}
                >
                  Employee Info
                </Divider>
                <div>
                  <Typography
                    fontWeight="bold"
                    display="inline"
                    component="span"
                  >
                    Recipient Name:
                  </Typography>
                  <Typography
                    display="inline"
                    component="span"
                    id={"orders-recipient-name-" + props.index}
                  >
                    {" " + props.full_name}
                  </Typography>
                </div>
                <div>
                  <Typography
                    fontWeight="bold"
                    display="inline"
                    component="span"
                  >
                    Email:
                  </Typography>
                  <Typography
                    display="inline"
                    component="span"
                    id={"orders-email-" + props.index}
                  >
                    {" " + props.email}
                  </Typography>
                </div>
                {props.address && (
                  <div>
                    <Typography
                      fontWeight="bold"
                      display="inline"
                      component="span"
                    >
                      Location:
                    </Typography>
                    <Typography
                      display="inline"
                      component="span"
                      id={"orders-location-" + props.index}
                    >
                      {" " + props.address.subdivision}, {props.address.country}
                    </Typography>
                  </div>
                )}
                {returned_laptop && (
                  <div>
                    <Typography
                      fontWeight="bold"
                      display="inline"
                      component="span"
                    >
                      Returned Device:
                    </Typography>
                    <Typography display="inline" component="span">
                      {" " + returned_laptop}
                    </Typography>
                  </div>
                )}
                {props.items[1] &&
                  props.items[1].date_reminder_sent &&
                  props.shipping_status !== "Completed" &&
                  !props.items[1].delivery_status && (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <div>
                        <Typography
                          fontWeight="bold"
                          display="inline"
                          component="span"
                        >
                          Date Reminder Sent:
                        </Typography>
                        <Typography display="inline" component="span">
                          {" " + props.items[1].date_reminder_sent}
                        </Typography>
                      </div>
                      <Button
                        onClick={send_reminder_email}
                        disabled={loading || email_sent > -1}
                      >
                        {loading ? (
                          <CircularProgress />
                        ) : email_sent > -1 ? (
                          email_sent === 0 ? (
                            "Email Sent!"
                          ) : email_sent === 1 ? (
                            "Error sending email..."
                          ) : (
                            "Not Possible"
                          )
                        ) : (
                          "Send Reminder Email"
                        )}
                      </Button>
                    </Stack>
                  )}
                {props.parent_client === "spokeops" && has_yubikey() && (
                  <div>
                    <Typography
                      fontWeight="bold"
                      display="inline"
                      component="span"
                    >
                      Yubikey Shipment ID:
                    </Typography>
                    <Typography display="inline" component="span">
                      {" "}
                      {get_yubikey_id()}
                    </Typography>
                  </div>
                )}
                <Divider
                  textAlign="left"
                  sx={{ fontSize: "115%", fontWeight: "bold" }}
                >
                  Items
                </Divider>
                <ItemsTable
                  items={props.items}
                  recipient_name={full_name}
                  client={client}
                  order_no={props.orderNo}
                />
                {props.parent_client === "spokeops" && (
                  <Stack direction="row" spacing={1}>
                    <OperationsManage {...props} />
                    {deployed_laptop !== "" &&
                      props.selected_client === "Alma" &&
                      props.shipping_status !== "Complete" &&
                      props.shipping_status !== "Completed" &&
                      props.shipping_status !== "Shipped" && (
                        <OrderLaptop {...props} />
                      )}
                    <DeleteModal
                      id={props.id}
                      client={props.client}
                      full_name={props.full_name}
                    />
                  </Stack>
                )}
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  ) : null;
};

export default OrderRow;
