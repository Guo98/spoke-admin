import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Link,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch } from "react-redux";

import { openMarketplace } from "../../app/slices/marketSlice";
import { InventorySummary } from "../../interfaces/inventory";
import AppContainer from "../AppContainer/AppContainer";

interface InventoryCardProps extends InventorySummary {
  goToPage: Function;
  index: number;
  client: string;
}

const InventoryCard = (props: InventoryCardProps) => {
  const {
    image_source,
    name,
    serial_numbers,
    goToPage,
    index,
    client,
    location,
  } = props;

  const dispatch = useDispatch();

  const [in_stock, setInStock] = useState([]);
  const [deployed, setDeployed] = useState([]);
  const [pending, setPending] = useState([]);
  const [eol, setEol] = useState([]);

  const [new_in_stock, setNewInStock] = useState(0);
  const [used_in_stock, setUsedInStock] = useState(0);

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

  useEffect(() => {
    if (in_stock.length > 0) {
      setNewInStock(in_stock.filter((d: any) => d.condition === "New").length);
      setUsedInStock(
        in_stock.filter((d: any) => d.condition === "Used").length
      );
    }
  }, [in_stock]);

  const spec_descriptions = () => {
    return (
      props.specs?.screen_size +
      ", " +
      props.specs?.cpu +
      ", " +
      props.specs?.ram +
      ", " +
      props.specs?.hard_drive
    );
  };

  const market_info = () => {
    const market_obj = {
      imgSrc: image_source || "",
      brand: props.brand,
      client: client,
      specific_device: name,
      location,
      supplier_links: props.marketplace,
      specific_specs:
        props.specs?.screen_size +
        ", " +
        props.specs?.cpu +
        ", " +
        props.specs?.ram +
        ", " +
        props.specs?.hard_drive,
    };

    dispatch(openMarketplace(market_obj));
    AppContainer.navigate("marketplace");
  };

  return (
    <Card
      sx={{
        display: "flex",
        mt: 5,
        width: { md: "100%", lg: "45%" },
        borderRadius: "15px",
        maxHeight: "150px",
      }}
    >
      <CardMedia
        component="img"
        image={image_source}
        alt="Inventory image"
        sx={{ maxHeight: "150px", maxWidth: "150px" }}
      />
      <CardContent sx={{ width: "100%", pt: "5px", pb: "5px!important" }}>
        <Stack
          spacing={0.5}
          justifyContent="space-evenly"
          direction="column"
          height="100%"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            maxWidth="98%"
            alignItems="center"
          >
            <Link
              fontWeight="bold"
              fontSize="110%"
              onClick={() => goToPage(index)}
            >
              {name}
            </Link>
            <IconButton size="small">
              <ShoppingCartIcon onClick={market_info} />
            </IconButton>
          </Stack>
          {props.specs ? (
            <div
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                width: "90%",
              }}
            >
              <Typography
                display="inline"
                component="span"
                fontWeight="bold"
                fontSize="90%"
              >
                Specs:{" "}
              </Typography>
              <Typography display="inline" component="span" fontSize="90%">
                {spec_descriptions()}
              </Typography>
            </div>
          ) : (
            <></>
          )}
          {/* {props.location ? (
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
          ) : (
            <></>
          )} */}
          <Typography>{in_stock.length} in stock</Typography>
          <Stack direction="row" spacing={0.5}>
            {new_in_stock > 0 ? (
              <Chip
                sx={{ borderRadius: "10px" }}
                label={new_in_stock + " new"}
                // onClick={() => goToPage(index, 0)}
              />
            ) : (
              <></>
            )}
            {used_in_stock > 0 ? (
              <Chip
                sx={{ borderRadius: "10px" }}
                label={used_in_stock + " used"}
                // onClick={() => goToPage(index, 1)}
              />
            ) : (
              <></>
            )}
            {/* {pending.length > 0 ? (
              <Chip
                sx={{ borderRadius: "10px" }}
                label={pending.length + " pending"}
                onClick={() => goToPage(index, 2)}
              />
            ) : (
              <></>
            )}
            {eol.length > 0 ? (
              <Chip
                sx={{ borderRadius: "10px" }}
                label={eol.length + " end of service"}
                onClick={() => goToPage(index, 3)}
              />
            ) : (
              <></>
            )} */}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InventoryCard;
