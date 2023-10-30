import React from "react";
import {
  Toolbar,
  Typography,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandProps {
  count: number;
  rowsPerPage: number;
  onRowsPerPageChange(event: SelectChangeEvent): void;
  onExpandCollapse(expand: boolean): void;
  expands: number;
}

const ExpandTable = (props: ExpandProps) => {
  return (
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Stack direction="row" spacing={1} alignItems="right" pl={"40%"}>
        <Tooltip title="Show More">
          <Button
            onClick={() => props.onExpandCollapse(true)}
            disabled={props.expands * props.rowsPerPage > props.count}
          >
            <ExpandMoreIcon /> Show More
          </Button>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>
          1 -{" "}
          {props.expands * props.rowsPerPage > props.count
            ? props.count
            : props.expands * props.rowsPerPage}{" "}
          of {props.count}
        </Typography>
      </Stack>
    </Toolbar>
  );
};

export default ExpandTable;
