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
  Button,
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
      <Stack direction="row" spacing={1} alignItems="right" pl={"40%"}>
        {/* <Tooltip title="Show Less">
          <IconButton onClick={() => props.onExpandCollapse(false)}>
            <ExpandLessIcon />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Show More">
          <Button onClick={() => props.onExpandCollapse(true)}>
            <ExpandMoreIcon /> Show More
          </Button>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center">
        {/* <Typography>Rows per expand:</Typography>
        <FormControl size="small" variant="standard">
          <Select
            onChange={props.onRowsPerPageChange}
            defaultValue={props.rowsPerPage.toString()}
          >
            {props.rowOptions.map((o) => (
              <MenuItem value={o}>{o.toString()}</MenuItem>
            ))}
          </Select>
        </FormControl> */}
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
