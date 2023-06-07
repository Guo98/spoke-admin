import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Button,
  LinearProgress,
  Box,
  Alert,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import {
  standardGet,
  standardDelete,
  standardPost,
} from "../../../services/standard";

const Invites = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const getAllInvites = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    const usersResp = await standardGet(accessToken, "invites");

    if (usersResp.status === "Successful") {
      setInvites(usersResp.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllInvites().catch((err) => {});
  }, []);

  const isExpired = (date: string) => {
    const expire_date = new Date(date);
    expire_date.setDate(expire_date.getDate() + 7);
    const today = new Date();
    if (today.setHours(0, 0, 0, 0) <= expire_date.setHours(0, 0, 0, 0)) {
      return false;
    }
    return true;
  };

  const delete_invite = async (
    accessToken: string,
    client: string,
    invite_id: string
  ) => {
    const deleteResp = await standardDelete(
      accessToken,
      `invites/${client}/${invite_id}`
    );

    if (deleteResp.status === "Successful") {
      return true;
    } else {
      return false;
    }
  };

  const deleteInvite = async (client: string, invite_id: string) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const deleteResp = await delete_invite(accessToken, client, invite_id);

    if (deleteResp) {
      await getAllInvites();
      setSuccess(true);
      setSuccessMsg("Successfully deleted invite!");
    } else {
      setError(false);
      setErrorMsg("Error in deleting invite...");
    }
    setLoading(false);
  };

  const resendInvite = async (
    client: string,
    invite_id: string,
    role: string,
    connection: string,
    email: string
  ) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const deleteResp = await delete_invite(accessToken, client, invite_id);
    if (deleteResp) {
      const inviteObj = {
        client: client,
        connection: connection,
        invite_email: email,
        role: role,
        hasIds: true,
      };

      const postResp = await standardPost(accessToken, "invites", inviteObj);

      if (postResp.status === "Successful") {
        await getAllInvites();
        setSuccess(true);
        setSuccessMsg("Successfully resent invite!");
      } else {
        setError(true);
        setErrorMsg("Error in resending invite...");
      }
    }
    setLoading(false);
  };

  return (
    <Box>
      {loading && <LinearProgress />}
      {success && <Alert severity="success">{successMsg}</Alert>}
      {error && <Alert severity="error">{errorMsg}</Alert>}
      {invites.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Invitee</TableCell>
                <TableCell>Inviter</TableCell>
                <TableCell>Date Invited</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invites.map((user: any) => {
                const isDateExpired = isExpired(user.created_at);
                return (
                  <TableRow>
                    <TableCell>{user.organization}</TableCell>
                    <TableCell>{user.invitee.email}</TableCell>
                    <TableCell>{user.inviter.name}</TableCell>
                    <TableCell sx={{ color: isDateExpired ? "red" : "" }}>
                      {new Date(user.created_at).toDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <>
                        <Button
                          onClick={async () =>
                            await resendInvite(
                              user.organization,
                              user.id,
                              user.roles.length > 0 ? user.roles[0] : undefined,
                              user.connection_id,
                              user.invitee.email
                            )
                          }
                        >
                          Resend
                        </Button>
                        <Button
                          variant="contained"
                          onClick={async () =>
                            await deleteInvite(user.organization, user.id)
                          }
                        >
                          Delete
                        </Button>
                      </>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Invites;
