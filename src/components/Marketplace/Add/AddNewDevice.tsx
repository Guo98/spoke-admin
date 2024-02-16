import React, { useState, useEffect } from "react";
import {
  Button,
  Stack,
  Typography,
  Modal,
  Box,
  Divider,
  TextField,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useAuth0 } from "@auth0/auth0-react";

import { standardPost } from "../../../services/standard";
import { box_style, textfield_style } from "../../../utilities/styles";

import LinearLoading from "../../common/LinearLoading";
import ConfirmSpecs from "./ConfirmSpecs";

interface AddProps {
  client: string;
  refresh: Function;
}

const AddNewDevice = (props: AddProps) => {
  const { client, refresh } = props;

  const [open, setOpen] = useState(false);
  const [supplier_url, setSupplierUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [invalid_supplier, setInvalidSupplier] = useState(false);

  const [specs, setSpecs] = useState<any>({});

  const { getAccessTokenSilently } = useAuth0();

  const handleClose = () => {
    setOpen(false);
    setPage(0);
    setSupplierUrl("");
    setSpecs({});
  };

  const get_specs = async () => {
    setLoading(true);
    const access_token = await getAccessTokenSilently();

    const specs_resp = await standardPost(access_token, "marketplace/specs", {
      supplier_url,
    });

    if (specs_resp.status === "Successful") {
      setPage(1);
      setSpecs(specs_resp.data);
    } else if (specs_resp.status === "Could not retrieve info") {
      setPage(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (
      supplier_url !== "" &&
      !supplier_url.includes("www.cdw.com") &&
      !supplier_url.includes("www.insight.com")
    ) {
      setInvalidSupplier(true);
    } else {
      setInvalidSupplier(false);
    }
  }, [supplier_url]);

  return (
    <>
      <Button
        variant="contained"
        sx={{ alignItems: "center", borderRadius: "20px" }}
        onClick={() => setOpen(true)}
        id="marketplace-add-new"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Add />
          <Typography fontSize="90%" textTransform="none">
            Add New Device
          </Typography>
        </Stack>
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={box_style} id="add-new-device-box">
          {loading && <LinearLoading />}
          {!loading && page === 0 && (
            <Stack spacing={2}>
              <Typography
                component="h4"
                variant="h5"
                id="add-new-device-header"
              >
                Add New Standard Device
              </Typography>
              <Divider />
              <Typography>
                Add a new device to the marketplace by entering a link to the
                product from one of Spoke's verified partners (CDW, Insight).
              </Typography>
              <br />
              <Typography>Enter product link:</Typography>
              <TextField
                size="small"
                required
                sx={textfield_style}
                label="Supplier URL"
                value={supplier_url}
                onChange={(e) => setSupplierUrl(e.target.value)}
                error={invalid_supplier}
                helperText={
                  invalid_supplier
                    ? "Only CDW and Insight links supported right now."
                    : ""
                }
                id="supplier-text-input"
              />
              <Divider />
              <Button
                variant="contained"
                sx={{ borderRadius: "20px", textTransform: "none" }}
                onClick={get_specs}
                disabled={invalid_supplier || supplier_url === ""}
                id="add-new-device-next-button"
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>Next</Typography>
                  <ArrowRightAltIcon />
                </Stack>
              </Button>
            </Stack>
          )}
          {!loading && page === 1 && (
            <ConfirmSpecs
              back={setPage}
              specs={specs}
              client={client}
              supplier_url={supplier_url}
              refresh={refresh}
            />
          )}
        </Box>
      </Modal>
    </>
  );
};

export default AddNewDevice;
