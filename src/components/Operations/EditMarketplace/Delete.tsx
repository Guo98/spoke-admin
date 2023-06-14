import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Stack,
  LinearProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { standardPatch } from "../../../services/standard";

interface DProps {
  type: string;
  brand?: string;
  id?: string;
  device_type?: string;
  spec?: string;
  client: string;
  item?: string;
  refresh: Function;
}

const Delete = (props: DProps) => {
  const { client, id, type, refresh } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(-1);

  const { getAccessTokenSilently } = useAuth0();

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    let patchObj: any = {
      client,
      id,
    };
    if (type === "item") {
      patchObj.update_type = "deleteitem";
    } else if (type === "brand") {
      patchObj.brand = props.brand;
      patchObj.update_type = "deletebrand";
    } else if (type === "type") {
      patchObj.brand = props.brand;
      patchObj.device_type = props.device_type;
      patchObj.update_type = "deletetype";
    } else if (type === "spec") {
      patchObj.brand = props.brand;
      patchObj.device_type = props.device_type;
      patchObj.spec = props.spec;
      patchObj.update_type = "deletespec";
    }

    const accessToken = await getAccessTokenSilently();

    const patchResp = await standardPatch(accessToken, "marketplace", patchObj);

    if (patchResp.status === "Successful") {
      setStatus(0);
      await refresh();
    } else {
      setStatus(1);
    }

    setLoading(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <DeleteIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "background.paper",
            borderRadius: "20px",
            boxShadow: 24,
            p: 4,
          }}
        >
          {!loading && status === -1 && (
            <Stack spacing={2}>
              <Typography textAlign="center">
                Are you sure you want to delete{" "}
                {type === "item"
                  ? props.item
                  : type === "brand"
                  ? props.brand
                  : type === "type"
                  ? props.device_type
                  : props.spec}{" "}
                for {client}?
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button variant="contained" onClick={handleDelete}>
                  Yes
                </Button>
                <Button variant="contained" onClick={handleClose}>
                  No
                </Button>
              </Stack>
            </Stack>
          )}
          {loading && <LinearProgress />}
          {!loading && status === 0 && (
            <Typography>Successfully deleted!</Typography>
          )}
          {!loading && status === 1 && (
            <Typography>Error in deleting...</Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Delete;
