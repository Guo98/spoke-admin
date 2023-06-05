import React, { useState } from "react";
import {
  Box,
  Collapse,
  TableRow,
  TableCell,
  Button,
  TextField,
  Grid,
  Stack,
} from "@mui/material";

interface UpdateProps {
  sn: string;
  condition: string;
  status: string;
  full_name?: string;
}

const UpdateCollapse = (props: UpdateProps) => {
  const { sn, condition, status, full_name } = props;
  const [open, setOpen] = useState(false);
  const [updateSN, setSN] = useState(sn);
  const [disableSN, setDisableSN] = useState(true);

  return (
    <>
      <TableRow>
        <TableCell>{sn}</TableCell>
        <TableCell>{condition}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>
          {status === "Deployed" && full_name ? full_name : ""}
        </TableCell>
        <TableCell align="right">
          <Button onClick={() => setOpen(!open)}>
            {!open ? "Edit" : "Done"}
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} sx={{ paddingTop: 0, paddingBottom: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ marginY: 1 }}>
              <Stack direction="column" spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={11}>
                    <TextField
                      fullWidth
                      label="Serial Number"
                      size="small"
                      defaultValue={sn}
                      value={updateSN}
                      onChange={(e) => {
                        setSN(e.target.value);
                        setDisableSN(false);
                      }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Button variant="contained" disabled={disableSN}>
                      Save
                    </Button>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item></Grid>
                  <Grid item></Grid>
                </Grid>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default UpdateCollapse;
