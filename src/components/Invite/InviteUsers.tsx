import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Alert,
  Tooltip,
} from "@mui/material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
// @ts-ignore
import isEmail from "validator/lib/isEmail";

import { RootState } from "../../app/store";
import {
  clientsList,
  clientRoles,
  connectionMappings,
  clientRolesCode,
} from "../../utilities/mappings";
import { standardPost } from "../../services/standard";
import LinearLoading from "../common/LinearLoading";

interface IUProps {
  handleClose?: Function;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const InviteUsers = (props: IUProps) => {
  const { handleClose } = props;
  const selectedClient = useSelector((state: RootState) => state.client.data);
  const roles = useSelector((state: RootState) => state.client.roles);

  const [client, setClient] = useState("");
  const [selectedRole, setRole] = useState("");
  const [connection, setConnection] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [valid_email, setValidEmail] = useState(true);

  const { getAccessTokenSilently } = useAuth0();

  const handleChange = (event: SelectChangeEvent) => {
    setClient(event.target.value as string);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  const handleConnectionChange = (event: SelectChangeEvent) => {
    setConnection(event.target.value as string);
  };

  useEffect(() => {
    if (selectedClient !== "spokeops") {
      setClient(selectedClient);
    }
  }, [selectedClient]);

  const inviteUser = async () => {
    setLoading(true);
    const inviteObj = {
      client: client,
      connection: connection,
      invite_email: email,
      role: clientRolesCode[selectedRole],
    };

    const accessToken = await getAccessTokenSilently();

    const postResp = await standardPost(accessToken, "invites", inviteObj);

    if (postResp.status === "Successful") {
      setLoading(false);
      setSuccess(true);
    } else {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <Box sx={{ width: "94%", paddingLeft: "3%" }}>
      <Grid container direction="row">
        <Grid item xs={11} sx={{ paddingLeft: "15px" }}>
          <Typography>
            <h3>Invite Users</h3>
          </Typography>
        </Grid>
        <Grid item xs={1} sx={{ paddingTop: "10px", paddingLeft: "20px" }}>
          <Tooltip title="Clear All">
            <IconButton
              onClick={() => {
                setClient("");
                setRole("");
                setConnection("");
                setEmail("");
                setError(false);
                setSuccess(false);
              }}
            >
              <ClearAllIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Stack spacing={2}>
        {loading && <LinearLoading />}
        {!loading && success && (
          <Alert severity="success">Invite successfully sent!</Alert>
        )}
        {!loading && error && (
          <Alert severity="error">
            Something went wrong... Please reach out to Andy
          </Alert>
        )}
        {selectedClient === "spokeops" && (
          <FormControl fullWidth sx={textFieldStyle} required size="small">
            <InputLabel id="client-select-label">Client</InputLabel>
            <Select
              labelId="client-select-label"
              id="client-simple-select"
              value={client}
              label="Client"
              onChange={handleChange}
              required
            >
              {clientsList.map((menuClient) => {
                return <MenuItem value={menuClient}>{menuClient}</MenuItem>;
              })}
            </Select>
          </FormControl>
        )}
        {clientRoles[client] && (
          <FormControl fullWidth sx={textFieldStyle} required size="small">
            <InputLabel id="role-select-label">Select Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-simple-select"
              value={selectedRole}
              label="Select Role"
              onChange={handleRoleChange}
              required
            >
              {clientRoles[client].map((clientRole: string) => {
                if (clientRole === "Admin") {
                  if (selectedClient === "spokeops")
                    return <MenuItem value={clientRole}>{clientRole}</MenuItem>;
                } else if (clientRole === "Hiring Manager") {
                  if (
                    selectedClient === "spokeops" ||
                    (selectedClient === "Roivant" && roles[0] === "admin")
                  )
                    return <MenuItem value={clientRole}>{clientRole}</MenuItem>;
                } else {
                  return <MenuItem value={clientRole}>{clientRole}</MenuItem>;
                }
              })}
            </Select>
          </FormControl>
        )}
        <TextField
          sx={textFieldStyle}
          label="User Email"
          size="small"
          required
          onChange={(e) => {
            setEmail(e.target.value);
            if (!isEmail(e.target.value) && e.target.value !== "") {
              setValidEmail(false);
            } else {
              setValidEmail(true);
            }
          }}
          error={!valid_email}
          helperText={!valid_email ? "Invalid email" : ""}
        />
        {connectionMappings[client] && (
          <FormControl fullWidth sx={textFieldStyle} required size="small">
            <InputLabel id="conn-select-label">Connection</InputLabel>
            <Select
              labelId="conn-select-label"
              id="conn-simple-select"
              value={connection}
              label="Client"
              onChange={handleConnectionChange}
              required
            >
              {connectionMappings[client].map((connClient: string) => {
                return <MenuItem value={connClient}>{connClient}</MenuItem>;
              })}
            </Select>
          </FormControl>
        )}
        <Button
          onClick={inviteUser}
          disabled={
            loading ||
            email === "" ||
            !valid_email ||
            connection === "" ||
            (clientRoles[client] && selectedRole === "")
          }
        >
          Invite
        </Button>
      </Stack>
    </Box>
  );
};

export default InviteUsers;
