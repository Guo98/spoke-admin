import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

interface OffboardProps {
  manageType: string;
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

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const rightTextFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
  float: "right",
};

const OffboardBody = (props: OffboardProps) => {
  const { manageType, name, address } = props;
  const [disabled, setDisabled] = useState(true);
  return (
    <>
      <h4>{manageType} Details</h4>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            label="First Name"
            value={name.first_name}
            disabled={disabled}
            fullWidth
            sx={textFieldStyle}
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Last Name"
            value={name.last_name}
            disabled={disabled}
            fullWidth
            sx={rightTextFieldStyle}
            size="small"
          />
        </Grid>
      </Grid>
      <Grid container sx={{ paddingTop: "15px" }}>
        <TextField
          label="Address Line 1"
          value={address.al1}
          disabled={disabled}
          fullWidth
          sx={textFieldStyle}
          size="small"
        />
      </Grid>
      <Grid container sx={{ paddingTop: "15px" }}>
        <TextField
          label="Address Line 2"
          value={address.al2}
          disabled={disabled}
          fullWidth
          sx={textFieldStyle}
          size="small"
        />
      </Grid>
      <Grid container spacing={3} sx={{ paddingTop: "15px" }}>
        <Grid item xs={6}>
          <TextField
            label="City"
            value={address.city}
            disabled={disabled}
            fullWidth
            sx={textFieldStyle}
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="State"
            value={address.state}
            disabled={disabled}
            fullWidth
            sx={textFieldStyle}
            size="small"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ paddingTop: "15px" }}>
        <Grid item xs={6}>
          <TextField
            label="Postal Code"
            value={address.postal_code}
            disabled={disabled}
            fullWidth
            sx={textFieldStyle}
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Country"
            value={address.country_code}
            disabled={disabled}
            fullWidth
            sx={textFieldStyle}
            size="small"
          />
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="space-evenly"
        sx={{ paddingTop: "15px" }}
        spacing={3}
      >
        <Grid item xs={6}>
          <Button
            onClick={() => setDisabled(false)}
            sx={{
              backgroundColor: "white",
              color: "#054ffe",
              borderRadius: "10px",
            }}
            variant="contained"
            fullWidth
          >
            Edit
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#054ffe",
              borderRadius: "10px",
            }}
            fullWidth
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default OffboardBody;
