import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import OffboardBody from "./OffboardBody";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ManageProps {
  name: {
    first_name: string;
    last_name: string;
  };
  address: {
    al1: string;
    al2?: string;
    city: string;
    state: string;
    postal_code: string;
    country_code: string;
  };
}

const ManageModal = (props: ManageProps) => {
  const [open, setOpen] = useState(false);
  const [manageType, setManageType] = useState("");
  const [changeView, setChangeView] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: SelectChangeEvent) => {
    setManageType(event.target.value);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Manage</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {!changeView ? (
            <>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Manage Device
              </Typography>
              <Grid container spacing={2} justifyContent="space-evenly">
                <Grid item xs={10}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="manage-type-label">
                      What do you want to do?
                    </InputLabel>
                    <Select
                      labelId="manage-type-label"
                      id="manage-select-standard"
                      value={manageType}
                      onChange={handleChange}
                      label="Age"
                    >
                      <MenuItem value="Offboarding">Offboarding</MenuItem>
                      <MenuItem value="Returning">Returning</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  xs={2}
                  sx={{
                    float: "right",
                    paddingTop: "25px",
                    paddingLeft: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => setChangeView(true)}
                  >
                    <ArrowForwardIcon />
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            <OffboardBody manageType={manageType} {...props} />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default ManageModal;
