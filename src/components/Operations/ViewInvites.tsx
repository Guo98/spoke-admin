import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth0 } from "@auth0/auth0-react";
import { standardGet } from "../../services/standard";

interface ViewProps {
  handleClose: Function;
}

const ViewInvites = (props: ViewProps) => {
  const { handleClose } = props;

  const [users, setUsers] = useState([]);

  const { getAccessTokenSilently } = useAuth0();

  const getAllUsers = async () => {
    const accessToken = await getAccessTokenSilently();

    const usersResp = await standardGet(accessToken, "listusers");

    if (usersResp.status === "Successful") {
      setUsers(usersResp.data);
    }
  };

  useEffect(() => {
    getAllUsers().catch((err) => {});
  }, []);

  useEffect(() => {}, [users]);

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
      {users.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Invitee</TableCell>
                <TableCell>Inviter</TableCell>
                <TableCell>Date Invited</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: any) => (
                <TableRow>
                  <TableCell>{user.organization}</TableCell>
                  <TableCell>{user.invitee.email}</TableCell>
                  <TableCell>{user.inviter.name}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ViewInvites;
