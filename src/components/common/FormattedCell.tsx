import React from "react";
import { TableCell, Typography } from "@mui/material";

interface FormattedProps {
  text: string;
  bold?: boolean;
}

const FormattedCell = (props: FormattedProps) => {
  return (
    <TableCell>
      <Typography fontWeight={props.bold ? "bold" : ""}>
        {props.text}
      </Typography>
    </TableCell>
  );
};

export default FormattedCell;
