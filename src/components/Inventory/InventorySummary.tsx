import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

import TabPanel from "../common/TabPanel";

import InStock from "./Tables/InStock";
import Deployed from "./Tables/Deployed";
import Pending from "./Tables/Pending";
import EndOfLife from "./Tables/EndOfLife";

import AssignModal from "./AssignModal";
import OffboardModal from "./OffboardModal";

import { InventorySummary as IS } from "../../interfaces/inventory";

interface ISProps extends IS {
  goToPage: Function;
  client: string;
  refresh: Function;
  selected_tab: number;
}

const a11yProps = (index: number) => {
  return {
    id: `inv-tab-${index}`,
    "aria-controls": `inv-tabpanel-${index}`,
  };
};

type Order = "asc" | "desc";

const InventorySummary = (props: ISProps) => {
  const {
    name,
    goToPage,
    image_source,
    serial_numbers,
    location,
    id,
    client,
    refresh,
    selected_tab,
  } = props;

  const [tab_value, setTabValue] = useState(selected_tab);

  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState<Order>("asc");

  const [in_stock, setInStock] = useState<any>([]);
  const [deployed, setDeployed] = useState<any>([]);
  const [pending, setPending] = useState<any>([]);
  const [eol, setEol] = useState<any>([]);

  useEffect(() => {
    if (serial_numbers.length > 0) {
      let temp_in_stock: any = [];
      let temp_deployed: any = [];
      let temp_pending: any = [];
      let temp_eol: any = [];

      serial_numbers.forEach((d) => {
        if (d.status === "In Stock") {
          if (d.condition === "Used" || d.condition === "New") {
            temp_in_stock.push(d);
          } else {
            temp_eol.push(d);
          }
        } else if (d.status === "Deployed") {
          temp_deployed.push(d);
        } else if (d.status === "End of Life") {
          temp_eol.push(d);
        } else {
          temp_pending.push(d);
        }
      });

      setInStock(temp_in_stock);
      setDeployed(temp_deployed);
      setPending(temp_pending);
      setEol(temp_eol);
    }
  }, [serial_numbers]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const tableSort = () => {
    let devices: any = [];

    if (tab_value === 0) {
      devices = [...in_stock];
    } else if (tab_value === 1) {
      devices = [...deployed];
    } else if (tab_value === 2) {
      devices = [...pending];
    } else if (tab_value === 3) {
      devices = [...eol];
    }
    if (orderBy === "Serial Number") {
      if (order === "asc") {
        return devices.sort((a: any, b: any) =>
          a.sn > b.sn ? 1 : b.sn > a.sn ? -1 : 0
        );
      } else {
        return devices.sort((a: any, b: any) =>
          a.sn < b.sn ? 1 : b.sn < a.sn ? -1 : 0
        );
      }
    } else if (orderBy === "Condition") {
      if (order === "asc") {
        return devices.sort((a: any, b: any) =>
          a.condition! > b.condition! ? 1 : b.condition! > a.condition! ? -1 : 0
        );
      } else {
        return devices.sort((a: any, b: any) =>
          a.condition! < b.condition! ? 1 : b.condition! < a.condition! ? -1 : 0
        );
      }
    } else if (orderBy === "Grade") {
      if (order === "asc") {
        return devices.sort((a: any, b: any) =>
          a.grade! > b.grade! ? 1 : b.grade! > a.grade! ? -1 : 0
        );
      } else {
        return devices.sort((a: any, b: any) =>
          a.grade! < b.grade! ? 1 : b.grade! < a.grade! ? -1 : 0
        );
      }
    }

    return devices;
  };

  return (
    <>
      <Button sx={{ justifyItems: "center" }} onClick={() => goToPage(0)}>
        <KeyboardBackspaceIcon sx={{ mr: 1 }} /> Inventory Overview
      </Button>
      <Card
        sx={{
          display: "flex",
          borderRadius: "25px",
          mt: 2,
        }}
      >
        <CardMedia
          component="img"
          image={image_source}
          alt="Inventory image"
          sx={{ maxHeight: "200px", maxWidth: "200px" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { md: "30%", lg: "70%" },
          }}
        >
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography fontWeight="bold" fontSize="120%" pb={2}>
              {name}
            </Typography>
            {props.specs?.screen_size && (
              <div>
                <Typography
                  display="inline"
                  component="span"
                  fontWeight="bold"
                  fontSize="90%"
                >
                  Screen Size:{" "}
                </Typography>
                <Typography display="inline" component="span" fontSize="90%">
                  {props.specs.screen_size}
                </Typography>
              </div>
            )}
            {props.specs?.cpu && (
              <div>
                <Typography
                  display="inline"
                  component="span"
                  fontWeight="bold"
                  fontSize="90%"
                >
                  CPU:{" "}
                </Typography>
                <Typography display="inline" component="span" fontSize="90%">
                  {props.specs.cpu}
                </Typography>
              </div>
            )}
            {props.specs?.ram && (
              <div>
                <Typography
                  display="inline"
                  component="span"
                  fontWeight="bold"
                  fontSize="90%"
                >
                  Screen Size:{" "}
                </Typography>
                <Typography display="inline" component="span" fontSize="90%">
                  {props.specs.ram}
                </Typography>
              </div>
            )}
            {props.specs?.hard_drive && (
              <div>
                <Typography
                  display="inline"
                  component="span"
                  fontWeight="bold"
                  fontSize="90%"
                >
                  Screen Size:{" "}
                </Typography>
                <Typography display="inline" component="span" fontSize="90%">
                  {props.specs.hard_drive}
                </Typography>
              </div>
            )}
            {props.location && (
              <div>
                <Typography
                  display="inline"
                  component="span"
                  fontWeight="bold"
                  fontSize="90%"
                >
                  Location:{" "}
                </Typography>
                <Typography display="inline" component="span" fontSize="90%">
                  {props.location}
                </Typography>
              </div>
            )}
          </CardContent>
        </Box>
        <Stack spacing={2} justifyContent="space-evenly" pr={2}>
          {in_stock.length > 0 && (
            <AssignModal
              device_name={name}
              device_location={location}
              image_source={image_source}
              type="individual"
              id={id}
              disabled={false}
            />
          )}
          <OffboardModal client={client} device_name={name} />
          <Button variant="contained" sx={{ borderRadius: "10px" }}>
            Buy
          </Button>
        </Stack>
      </Card>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 1 }}>
          <Tabs
            value={tab_value}
            onChange={handleTabChange}
            aria-label="inventory tabs"
          >
            <Tab label="In Stock" {...a11yProps(0)} />
            <Tab label="Deployed" {...a11yProps(1)} />
            <Tab label="Pending" {...a11yProps(2)} />
            <Tab label="End of Life" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={tab_value} index={0} prefix="inv">
          <InStock
            tableSort={tableSort}
            serial_numbers={in_stock}
            name={name}
            location={location}
            id={id}
            image_source={image_source}
          />
        </TabPanel>
        <TabPanel value={tab_value} index={1} prefix="inv">
          <Deployed
            tableSort={tableSort}
            serial_numbers={deployed}
            name={name}
            location={location}
            id={id}
            image_source={image_source}
          />
        </TabPanel>
        <TabPanel value={tab_value} index={2} prefix="inv">
          <Pending
            tableSort={tableSort}
            serial_numbers={pending}
            name={name}
            location={location}
            id={id}
            image_source={image_source}
            clientData={client}
          />
        </TabPanel>
        <TabPanel value={tab_value} index={3} prefix="inv">
          <EndOfLife
            tableSort={tableSort}
            serial_numbers={eol}
            name={name}
            location={location}
            id={id}
            refresh={refresh}
          />
        </TabPanel>
      </Box>
    </>
  );
};

export default InventorySummary;
