import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Grid from "@mui/material/Grid";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import CircleIcon from "@mui/icons-material/Circle";
import AssignModal from "./AssignModal";
import ManageModal from "./ManageModal";
import { InventorySummary } from "../../interfaces/inventory";
import "./Inventory.css";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 20,
  paddingBottom: 5,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

const SummaryList = (props: InventorySummary) => {
  const { name, location, serial_numbers } = props;
  return (
    <>
      {serial_numbers?.length > 0 &&
        serial_numbers.map((device) => {
          return (
            <Accordion key={device.sn}>
              <AccordionSummary>
                <Grid container>
                  <Grid item xs={5}>
                    <div className="bold">{name}</div>
                  </Grid>
                  <Grid item xs={3}>
                    {device.sn}
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: "left" }}>
                    {location}
                  </Grid>
                  {device.status === "In Stock" && (
                    <Grid item sx={{ color: "#6BD651" }}>
                      <CircleIcon
                        sx={{ fontSize: "medium", paddingTop: "2px" }}
                      />
                    </Grid>
                  )}
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container>
                  <Grid item xs={7}>
                    <div className="top-padding">
                      <span className="bold">Status: </span>
                      <span>{device.status}</span>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    {device.status === "In Stock" ? (
                      <div className="right">
                        <AssignModal
                          serial_number={device.sn}
                          device_name={name}
                        />
                      </div>
                    ) : (
                      <div className="right">
                        <ManageModal
                          name={{
                            first_name: device.first_name!,
                            last_name: device.last_name!,
                          }}
                          address={device.address!}
                        />
                      </div>
                    )}
                  </Grid>
                </Grid>
                {device.status === "Deployed" && (
                  <>
                    <div>
                      <span className="bold">Assigned to: </span>
                      {device.first_name} {device.last_name}
                    </div>
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
    </>
  );
};

export default SummaryList;
