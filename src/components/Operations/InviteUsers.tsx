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
  LinearProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import {
  clientsList,
  clientRoles,
  connectionMappings,
  clientRolesCode,
} from "../../utilities/mappings";
import { postOrder } from "../../services/ordersAPI";

interface IUProps {
  handleClose?: Function;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const InviteUsers = (props: IUProps) => {
  const { handleClose } = props;
  const selectedClient = useSelector((state: RootState) => state.client.data);

  const [client, setClient] = useState("");
  const [selectedRole, setRole] = useState("");
  const [connection, setConnection] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

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

    const postResp = await postOrder("inviteusers", accessToken, inviteObj);

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
        {/* <Grid item xs={1} sx={{ paddingTop: "10px", paddingLeft: "20px" }}>
          <Tooltip title="Exit">
            <IconButton onClick={() => handleClose!()}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Grid> */}
      </Grid>
      <Stack spacing={2}>
        {loading && <LinearProgress />}
        {!loading && success && (
          <Alert severity="success">Invite successfully sent!</Alert>
        )}
        {!loading && error && (
          <Alert severity="error">
            Something went wrong... Please reach out to Andy
          </Alert>
        )}
        <FormControl
          fullWidth
          sx={textFieldStyle}
          required
          size="small"
          disabled={selectedClient !== "spokeops"}
        >
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
          onChange={(e) => setEmail(e.target.value)}
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
        <Button onClick={inviteUser} disabled={loading}>
          Invite
        </Button>
      </Stack>
    </Box>
  );
};

export default InviteUsers;
