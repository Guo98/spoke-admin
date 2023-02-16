import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Item } from "../../interfaces/orders";
import { useAuth0 } from "@auth0/auth0-react";
import { sendSupportEmail } from "../../services/ordersAPI";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  paddingBottom: "10px",
};

interface ManageProps {
  order_no?: number;
  name?: string;
  items?: Item[];
  email: string;
  order: boolean;
  footerOpen?: boolean;
  setFooterOpen?: Function;
}

const ManageOrder = (props: ManageProps) => {
  const { order_no, name, items, order } = props;
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sent, setSent] = useState(false);

  const { user, getAccessTokenSilently } = useAuth0();

  const handleClose = () => {
    setOpen(false);
    if (props.setFooterOpen) {
      props.setFooterOpen(false);
    }
  };

  useEffect(() => {
    if (props.footerOpen) setOpen(props.footerOpen!);
  }, [props.footerOpen]);

  const sendSupport = async () => {
    let supportObj = {};
    if (order) {
      supportObj = {
        orderNo: order_no ? order_no : "General",
        customer_name: name,
        requestor_email: user?.email,
        support_message: content,
        support_subject: subject,
      };
    }
    const accessToken = await getAccessTokenSilently();
    try {
      const emailResp = await sendSupportEmail(accessToken, supportObj);

      if (emailResp.message === "Successful") {
        setSent(true);
        if (props.setFooterOpen) {
          // props.setFooterOpen(false);
        }
      }
    } catch (e) {
      console.log("email support err ::::::::: ", e);
    }
  };

  return (
    <>
      {order && (
        <Button
          variant="contained"
          sx={{
            borderRadius: "999em 999em 999em 999em",
            height: "32px",
            width: "116px",
            textTransform: "none",
          }}
          onClick={() => setOpen(true)}
        >
          Manage
        </Button>
      )}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {!sent ? (
            <>
              {" "}
              <Typography
                component="h4"
                fontWeight="bold"
                sx={{ paddingBottom: "10px" }}
              >
                {order && `Need Help with Order #${order_no}? `}Contact Spoke:
              </Typography>
              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                sx={textFieldStyle}
                onChange={(event) => setSubject(event.target.value)}
                defaultValue={subject}
              />
              <TextField
                label="Content"
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                sx={textFieldStyle}
                onChange={(event) => setContent(event.target.value)}
                defaultValue={content}
              />
              <div className="support-button-padding">
                <Button
                  variant="contained"
                  sx={{ borderRadius: "10px" }}
                  onClick={sendSupport}
                >
                  Submit
                </Button>
              </div>
            </>
          ) : (
            <>
              <Typography variant="h5" component="h3" textAlign="center">
                Request received!
              </Typography>
              <div className="center">
                <CheckCircleIcon
                  sx={{ color: "#06BE08", height: "10%", width: "10%" }}
                />
              </div>
              <Typography textAlign="center">
                We'll get back to you as soon as possible. If you need any more
                immediate assistance please shoot us a message on slack or email
                info@withspoke.com.
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ManageOrder;
