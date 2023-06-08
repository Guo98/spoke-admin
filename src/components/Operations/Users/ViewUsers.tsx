import React, { useState } from "react";
import { Box, Grid, Typography, IconButton, Tabs, Tab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TabPanel from "../../common/TabPanel";
import Invites from "./Invites";
import Users from "./Users";

interface ViewProps {
  handleClose: Function;
}

function a11yProps(index: number) {
  return {
    id: `users-tab-${index}`,
    "aria-controls": `users-tabpanel-${index}`,
  };
}

const ViewUsers = (props: ViewProps) => {
  const { handleClose } = props;

  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Grid container direction="row">
        <Grid item xs={11} sx={{ paddingLeft: "15px" }}>
          <Typography>
            <h3>View Portal Invitations</h3>
          </Typography>
        </Grid>
        <Grid item xs={1} sx={{ paddingTop: "10px", paddingLeft: "20px" }}>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="users tab"
          variant="fullWidth"
        >
          <Tab label="Users" {...a11yProps(0)} />
          <Tab label="Invites" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0} prefix="users">
        <Users />
      </TabPanel>
      <TabPanel value={tabValue} index={1} prefix="users">
        <Invites />
      </TabPanel>
    </Box>
  );
};

export default ViewUsers;
