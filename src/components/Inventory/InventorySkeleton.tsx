import React from "react";
import { Skeleton, Box, Stack } from "@mui/material";

const InventorySkeleton = () => {
  return (
    <Box sx={{ height: "150px", width: "100%", border: 2 }}>
      <Stack direction="row" spacing={2}>
        <Skeleton
          variant="rectangular"
          height="80%"
          width="80%"
          sx={{ bgcolor: "secondary" }}
        />
      </Stack>
      <Skeleton
        variant="rectangular"
        height="110%"
        width="50%"
        sx={{ bgcolor: "secondary" }}
      />
    </Box>
  );
};

export default InventorySkeleton;
