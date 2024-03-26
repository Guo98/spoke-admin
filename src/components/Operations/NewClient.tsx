import React, { useState, ChangeEvent } from "react";
import {
  Button,
  Box,
  TextField,
  Typography,
  Stack,
  IconButton,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth0 } from "@auth0/auth0-react";

import { standardPost } from "../../services/standard";
import LinearLoading from "../common/LinearLoading";

const textFieldStyle = {
  "& fieldset": { borderRadius: "10px" },
};

const portal_pages = [
  "Orders",
  "Inventory",
  "Marketplace",
  "Approvals",
  "Invite",
];

interface NewClientProps {
  handleClose: Function;
}

const NewClient = (props: NewClientProps) => {
  const { handleClose } = props;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(-1);

  const [client_name, setClientName] = useState("");
  const [pages, setPages] = useState<string[]>([]);
  const [google, setGoogle] = useState(false);
  const [microsoft, setMicrosoft] = useState(false);
  const [employee_portal, setEmployeePortal] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const handleChange = (event: SelectChangeEvent<typeof pages>) => {
    const {
      target: { value },
    } = event;
    setPages(typeof value === "string" ? value.split(",") : value);
  };

  const addNewClient = async () => {
    setLoading(true);
    const access_token = await getAccessTokenSilently();
    const post_obj = {
      client_name,
      allowed_pages: pages,
      conenctions: {
        google,
        microsoft,
      },
    };

    const new_result = await standardPost(access_token, "client/new", post_obj);

    if (new_result.status === "Successful") {
      setStatus(0);
    } else {
      setStatus(1);
    }
    setLoading(false);
  };

  return (
    <Box>
      {loading && <LinearLoading />}
      {status === 0 && (
        <Alert severity="success">Client successfully created!</Alert>
      )}
      {status === 1 && (
        <Alert severity="error">Error in creating client...</Alert>
      )}
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography component="h6" variant="h6">
            Add New Client
          </Typography>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <TextField
          label="Client Name"
          sx={textFieldStyle}
          size="small"
          fullWidth
          value={client_name}
          onChange={(e) => {
            setClientName(e.target.value);
          }}
        />
        <Typography>Pages:</Typography>
        <FormControl sx={{ ...textFieldStyle, m: 1 }} size="small">
          <InputLabel id="pages-multiple-chip-label">Select pages</InputLabel>
          <Select
            labelId="pages-multiple-chip-label"
            id="pages-multiple-chip"
            multiple
            value={pages}
            onChange={handleChange}
            input={
              <OutlinedInput id="select-multiple-chip" label="Select pages" />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            fullWidth
          >
            {portal_pages.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography>SSO Connections:</Typography>
        <Stack spacing={2} direction="row">
          <FormControlLabel
            sx={{ ml: 0 }}
            control={
              <Checkbox
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setGoogle(e.target.checked)
                }
                checked={google}
              />
            }
            label="Google"
          />
          <FormControlLabel
            sx={{ ml: 0 }}
            control={
              <Checkbox
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMicrosoft(e.target.checked)
                }
                checked={microsoft}
              />
            }
            label="Microsoft"
          />
        </Stack>
        <Typography>Extras:</Typography>
        <FormControlLabel
          sx={{ ml: 0 }}
          control={
            <Checkbox
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmployeePortal(e.target.checked)
              }
              checked={employee_portal}
            />
          }
          label="Employee Portals Needed"
        />
        <Button variant="contained">Add</Button>
      </Stack>
    </Box>
  );
};

export default NewClient;
