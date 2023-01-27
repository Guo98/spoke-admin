import React from "react";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Card, CardMedia, CardContent, Grid } from "@mui/material";
import { InventorySummary } from "../../interfaces/inventory";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  paddingBottom: 5,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<ExpandMoreIcon />} {...props} />
))(({ theme }) => ({
  flexDirection: "column",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
    marginRight: 0,
    paddingTop: 0,
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    marginBottom: 0,
  },
  flexGrow: 1,
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const InventoryAccordion = (props: InventorySummary) => {
  const {
    name,
    location,
    serial_numbers,
    index,
    setFilters,
    image_source,
    type,
    specs,
  } = props;
  return (
    <Accordion>
      <AccordionSummary>
        <Grid container spacing={2} justifyItems="space-between" flexGrow={1}>
          <Grid item xs={4}>
            <CardMedia
              component="img"
              sx={{ width: 175 }}
              image={image_source}
              alt="laptop"
            />
          </Grid>
          <Grid item xs={8}>
            here
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails></AccordionDetails>
    </Accordion>
  );
};

export default InventoryAccordion;
