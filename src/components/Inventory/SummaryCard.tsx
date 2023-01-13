import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { InventorySummary } from "../../interfaces/inventory";
import { imageMapping, ImageMapping } from "../../utilities/mappings";

const SummaryCard = (props: InventorySummary) => {
  const { name, location, serial_numbers, index, setFilters, image_source } =
    props;

  const lowStock = () => {
    if (serial_numbers.length < 10) {
      return true;
    }
    return false;
  };
  return (
    <>
      <Card
        sx={{
          minWidth: "275px",
          maxWidth: "500px",
          margin: "10px",
          borderRadius: 2,
          boxShadow: "5px 5px 5px gray",
        }}
        key={index}
      >
        <CardMedia
          sx={{ height: 200 }}
          image={image_source}
          title="laptop"
          component="img"
        />
        <CardContent sx={{ backgroundColor: "white" }}>
          <Link
            onClick={() => {
              if (setFilters) setFilters(location, name);
            }}
          >
            {name}
          </Link>
          <Stack
            direction="row"
            sx={{ paddingTop: "10px" }}
            justifyContent="space-evenly"
          >
            <Chip
              label={location}
              sx={{ backgroundColor: "#D1FBFF", marginRight: "5px" }}
            />
            <Chip
              label={serial_numbers.length + " in stock"}
              sx={{
                backgroundColor: "#F0F1F1",
                marginRight: "5px",
                color: lowStock() ? "red" : "black",
              }}
            />
            {/* <Chip
              label={getStatus()}
              sx={{
                backgroundColor:
                  getStatus() === "Low Stock" ? "#FBDBDB" : "lightblue",
              }}
            /> */}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default SummaryCard;
