import React from "react";
import {
  Toolbar,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface ExpandProps {
  rowOptions: number[];
  count: number;
  rowsPerPage: number;
  onRowsPerPageChange(event: SelectChangeEvent): void;
  onExpandCollapse(expand: boolean): void;
  expands: number;
}

const ExpandTable = (props: ExpandProps) => {
  return (
    <Toolbar sx={{ justifyContent: "space-between" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Rows per expand:</Typography>
        <FormControl size="small" variant="standard">
          <Select
            onChange={props.onRowsPerPageChange}
            defaultValue={props.rowsPerPage.toString()}
          >
            {props.rowOptions.map((o) => (
              <MenuItem value={o}>{o.toString()}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography pl={5}>
          1 - {props.expands * props.rowsPerPage} of {props.count}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Tooltip title="Show Less">
          <IconButton onClick={() => props.onExpandCollapse(false)}>
            <ExpandLessIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Show More">
          <IconButton onClick={() => props.onExpandCollapse(true)}>
            <ExpandMoreIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Toolbar>
  );
};

export default ExpandTable;
