import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import SummaryCarousel from "./SummaryCarousel";
import { InventorySummary } from "../../interfaces/inventory";

const SummaryCard = (props: InventorySummary) => {
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

  const lowStock = () => {
    if (serial_numbers?.length < 10 && type === "stock") {
      return true;
    }
    return false;
  };
  return (
    <>
      {serial_numbers?.length > 0 && (
        <>
          <Card
            sx={{
              minWidth: "275px",
              maxWidth: "500px",
              margin: "10px",
              borderRadius: 2,
              boxShadow: "5px 5px 5px gray",
            }}
          >
            <CardMedia
              children={
                <SummaryCarousel image_source={image_source} specs={specs} />
              }
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
                  label={
                    serial_numbers.length +
                    (type === "stock" ? " in stock" : " deployed")
                  }
                  sx={{
                    backgroundColor: "#F0F1F1",
                    marginRight: "5px",
                    color: lowStock() ? "red" : "black",
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
};

export default SummaryCard;
