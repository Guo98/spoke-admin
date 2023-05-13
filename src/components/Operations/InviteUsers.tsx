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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth0 } from "@auth0/auth0-react";
import {
  clientsList,
  clientRoles,
  connectionMappings,
  clientRolesCode,
} from "../../utilities/mappings";
import { postOrder } from "../../services/ordersAPI";

interface IUProps {
  handleClose: Function;
}

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const InviteUsers = (props: IUProps) => {
  const { handleClose } = props;
  const [client, setClient] = useState("");
  const [selectedRole, setRole] = useState("");
  const [connection, setConnection] = useState("");
  const [email, setEmail] = useState("");

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

  const inviteUser = async () => {
    const inviteObj = {
      client: client,
      connection: connection,
      invite_email: email,
      role: clientRolesCode[selectedRole],
    };

    const accessToken = await getAccessTokenSilently();

    const postResp = await postOrder("inviteusers", accessToken, inviteObj);
  };

  return (
    <Box>
      <Grid container direction="row">
        <Grid item xs={11} sx={{ paddingLeft: "15px" }}>
          <Typography>
            <h3>Invite Users</h3>
          </Typography>
        </Grid>
        <Grid item xs={1} sx={{ paddingTop: "10px", paddingLeft: "20px" }}>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Stack spacing={2}>
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
                return <MenuItem value={clientRole}>{clientRole}</MenuItem>;
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
        <Button onClick={inviteUser}>Invite</Button>
      </Stack>
    </Box>
  );
};

export default InviteUsers;
