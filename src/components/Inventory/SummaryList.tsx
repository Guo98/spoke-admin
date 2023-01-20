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
import Typography from "@mui/material/Typography";
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
  const {
    name,
    location,
    serial_numbers,
    image_source,
    specs: { screen_size, ram, hard_drive, cpu },
  } = props;

  const determineStatus = (status: string) => {
    if (status === "Offboarding" || status === "Returning") {
      return "Requested";
    } else if (status === "Top Up") {
      return "In Progress";
    } else {
      return status;
    }
  };

  return (
    <>
      {serial_numbers?.length > 0 &&
        serial_numbers.map((device) => {
          return (
            <Accordion key={device.sn}>
              <AccordionSummary>
                <Grid container>
                  <Grid item xs={5}>
                    <Typography fontWeight="bold">{name}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>{device.sn}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: "left" }}>
                    <Typography>{location}</Typography>
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
                      <Typography
                        display="inline"
                        component="span"
                        fontWeight="bold"
                      >
                        Status:{" "}
                      </Typography>
                      <Typography display="inline" component="span">
                        {determineStatus(device.status)}
                      </Typography>
                    </div>
                    <>
                      <Typography
                        display="inline"
                        component="span"
                        fontWeight="bold"
                      >
                        Condition:{" "}
                      </Typography>
                      <Typography display="inline" component="span">
                        {device.condition}
                      </Typography>
                    </>
                    {device.condition === "Used" && (
                      <div>
                        <Typography
                          display="inline"
                          component="span"
                          fontWeight="bold"
                        >
                          Grade:{" "}
                        </Typography>
                        <Typography display="inline" component="span">
                          {device.grade || "Not graded yet"}
                        </Typography>
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={3}>
                    {device.status === "In Stock" && (
                      <div className="right">
                        <AssignModal
                          serial_number={device.sn}
                          device_name={name}
                          device_location={location}
                          image_source={image_source}
                        />
                      </div>
                    )}
                    {device.status === "Deployed" && (
                      <div className="right">
                        <ManageModal
                          name={{
                            first_name: device.first_name!,
                            last_name: device.last_name!,
                          }}
                          address={device.address!}
                          email={device.email!}
                          serial_number={device.sn}
                          device_name={name}
                          device_location={location}
                          phone_number={device.phone_number!}
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
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-evenly"
                  paddingTop="10px"
                >
                  <Grid item xs={3}>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
                      Screen Size:{" "}
                    </Typography>
                    <Typography display="inline" component="span">
                      {screen_size}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
                      CPU:{" "}
                    </Typography>
                    <Typography display="inline" component="span">
                      {cpu}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
                      Ram:{" "}
                    </Typography>
                    <Typography display="inline" component="span">
                      {ram}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography
                      display="inline"
                      component="span"
                      fontWeight="bold"
                    >
                      Storage:{" "}
                    </Typography>
                    <Typography display="inline" component="span">
                      {hard_drive}
                    </Typography>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </>
  );
};

export default SummaryList;
