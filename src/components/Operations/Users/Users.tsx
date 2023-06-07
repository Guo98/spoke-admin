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

const Users = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const getAllUsers = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    const usersResp = await standardGet(accessToken, "users");

    if (usersResp.status === "Successful") {
      setUsers(usersResp.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAllUsers().catch((err) => {});
  }, []);

  const deleteUser = async (user_id: string) => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const deleteResp = await standardDelete(accessToken, `users/${user_id}`);

    if (deleteResp.status === "Successful") {
      await getAllUsers();
      setSuccess(true);
      setSuccessMsg("Successfully deleted user.");
    } else {
      setError(true);
      setErrorMsg("Error in deleting user...");
    }
    setLoading(false);
  };

  return (
    <Box>
      {loading && <LinearProgress />}
      {success && <Alert severity="success">{successMsg}</Alert>}
      {error && <Alert severity="error">{errorMsg}</Alert>}
      {users.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: "10px", maxHeight: "700px" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Emailr</TableCell>
                <TableCell>Date Invited</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: any) => {
                return (
                  <TableRow>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toDateString()}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {new Date(user.last_login).toDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <>
                        <Button
                          variant="contained"
                          onClick={async () => await deleteUser(user.user_id)}
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

export default Users;
