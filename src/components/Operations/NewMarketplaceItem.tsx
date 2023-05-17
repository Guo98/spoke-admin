import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface NMProps {
  handleClose: Function;
}

const NewMarketplaceItem = (props: NMProps) => {
  const { handleClose } = props;
  const [item_type, setItemType] = useState("");
  return (
    <Box>
      <Grid container direction="row">
        <Grid item xs={11} sx={{ paddingLeft: "15px" }}>
          <Typography>
            <h3>Add New Marketplace Item</h3>
          </Typography>
        </Grid>
        <Grid item xs={1} sx={{ paddingTop: "10px", paddingLeft: "20px" }}>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Stack direction="column" spacing={2} alignItems="center">
        <TextField
          label="Item Type"
          value={item_type}
          onChange={(e) => setItemType(e.target.value)}
          fullWidth
        />
      </Stack>
    </Box>
  );
};

export default NewMarketplaceItem;
