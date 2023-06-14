import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  Stack,
  SelectChangeEvent,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  Tooltip,
  Button,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClientDropdown from "../../common/ClientDropdown";
import { standardGet, standardPatch } from "../../../services/standard";
import AddNew from "./AddNew";
import Delete from "./Delete";

interface EProps {
  handleClose: Function;
}

const EditMarketplace = (props: EProps) => {
  const { handleClose } = props;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(-1);
  const [client, setClient] = useState("");
  const [marketplace, setMarketplace] = useState<any>([]);

  const [itemIndex, setItemIndex] = useState(-1);
  const [brandIndex, setBrandIndex] = useState(-1);
  const [typeIndex, setTypeIndex] = useState(-1);
  const [specIndex, setSpecIndex] = useState(-1);
  const [newlocations, setNewLocations] = useState<string[]>([]);
  const [editlocation, setEditLocation] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const getMarketplace = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const getResp = await standardGet(
      accessToken,
      "getmarketplaceinventory/" + client
    );

    if (getResp.status === "Successful") {
      setMarketplace(getResp.data);
      setItemIndex(-1);
      setBrandIndex(-1);
      setTypeIndex(-1);
      setSpecIndex(-1);
      setStatus(0);
    } else {
      setStatus(1);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (client !== "") getMarketplace().catch();
  }, [client]);

  const handleChange = (event: SelectChangeEvent) => {
    setClient(event.target.value);
  };

  const selectItem = (index: number) => {
    setItemIndex(index);
  };

  const selectBrand = (index: number) => {
    setBrandIndex(index);
  };

  const editLocations = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();
    const patchObj = {
      client,
      id: marketplace[itemIndex].id,
      update_type: "editlocations",
      spec: marketplace[itemIndex].brands[brandIndex].types[typeIndex].specs[
        specIndex
      ].spec,
      brand: marketplace[itemIndex].brands[brandIndex].brand,
      device_type:
        marketplace[itemIndex].brands[brandIndex].types[typeIndex].type,
      locations: newlocations,
    };

    const patchResp = await standardPatch(accessToken, "marketplace", patchObj);

    if (patchResp.status === "Successful") {
      await getMarketplace();
    }
    setLoading(false);
  };

  return (
    <Box>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={11}>
          <Typography>
            <h3>Edit Marketplace</h3>
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={() => handleClose()}>
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      {loading && <LinearProgress />}
      {status === 1 && <Alert severity="error">Error</Alert>}
      <Stack direction="column" spacing={2} alignItems="center">
        <ClientDropdown handleChange={handleChange} />
        {client === "" && (
          <Typography>Select a client ot get started</Typography>
        )}
        {client !== "" && (
          <Stack direction="row" spacing={2}>
            {marketplace.length > 0 &&
              marketplace.map((item: any, index: number) => {
                return (
                  <Card
                    elevation={itemIndex === index ? 20 : 1}
                    sx={{ display: "flex", flexDirection: "row" }}
                  >
                    <CardActionArea onClick={() => selectItem(index)}>
                      <CardContent>
                        {item.item_type}
                        <Delete
                          type="item"
                          client={client}
                          id={marketplace[index].id}
                          item={marketplace[index].item_type}
                          refresh={getMarketplace}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                );
              })}
            <Tooltip title="Add New Item">
              <AddNew type="item" client={client} refresh={getMarketplace} />
            </Tooltip>
          </Stack>
        )}
        {client !== "" && itemIndex === -1 && (
          <Typography>Select a item type to edit or add a new item</Typography>
        )}
        {client !== "" && itemIndex !== -1 && (
          <Stack direction="row" spacing={2}>
            {marketplace[itemIndex].brands.length > 0 &&
              marketplace[itemIndex].brands.map((b: any, index: number) => {
                if (b.brand !== "Others") {
                  return (
                    <Card elevation={brandIndex === index ? 20 : 1}>
                      <CardActionArea onClick={() => selectBrand(index)}>
                        <CardContent>
                          {b.brand}
                          <Delete
                            type="brand"
                            client={client}
                            id={marketplace[itemIndex].id}
                            brand={marketplace[itemIndex].brands[index].brand}
                            refresh={getMarketplace}
                          />
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  );
                }
              })}
            <Tooltip title="Add New Brand">
              <AddNew
                type="brand"
                client={client}
                id={marketplace[itemIndex].id}
                refresh={getMarketplace}
              />
            </Tooltip>
          </Stack>
        )}
        {client !== "" && itemIndex !== -1 && brandIndex === -1 && (
          <Typography>Select a brand to edit or add a new brand</Typography>
        )}
        {client !== "" && itemIndex !== -1 && brandIndex !== -1 && (
          <Stack direction="row" spacing={2}>
            {marketplace[itemIndex].brands[brandIndex].types.length > 0 &&
              marketplace[itemIndex].brands[brandIndex].types.map(
                (t: any, index: number) => (
                  <Card elevation={typeIndex === index ? 20 : 1}>
                    <CardActionArea onClick={() => setTypeIndex(index)}>
                      <CardContent>
                        {t.type}
                        <Delete
                          type="type"
                          client={client}
                          id={marketplace[itemIndex].id}
                          brand={
                            marketplace[itemIndex].brands[brandIndex].brand
                          }
                          device_type={
                            marketplace[itemIndex].brands[brandIndex].types[
                              index
                            ].type
                          }
                          refresh={getMarketplace}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )
              )}
            <Tooltip title="Add New Type">
              <AddNew
                type="type"
                client={client}
                id={marketplace[itemIndex].id}
                brand={marketplace[itemIndex].brands[brandIndex].brand}
                refresh={getMarketplace}
              />
            </Tooltip>
          </Stack>
        )}
        {client !== "" &&
          itemIndex !== -1 &&
          brandIndex !== -1 &&
          typeIndex === -1 && (
            <Typography>Select a type to edit or add a new type</Typography>
          )}
        {client !== "" &&
          itemIndex !== -1 &&
          brandIndex !== -1 &&
          typeIndex !== -1 && (
            <Stack direction="row" spacing={2}>
              {marketplace[itemIndex].brands[brandIndex].types[typeIndex].specs
                .length > 0 &&
                marketplace[itemIndex].brands[brandIndex].types[
                  typeIndex
                ].specs.map((s: any, index: number) => {
                  return (
                    <Card elevation={specIndex === index ? 20 : 1}>
                      <CardContent>
                        <Typography>Spec: {s.spec}</Typography>
                        <br />
                        {specIndex !== index && (
                          <Typography>
                            Locations:{" "}
                            {s.locations.length > 1
                              ? s.locations.join(", ")
                              : s.locations}
                          </Typography>
                        )}
                        {specIndex === index && (
                          <TextField
                            label="Locations"
                            InputProps={{
                              startAdornment: newlocations.map(
                                (loc: string) => (
                                  <Chip
                                    label={loc}
                                    onDelete={() => {
                                      const locIndex =
                                        newlocations.indexOf(loc);
                                      newlocations.splice(locIndex, 1);
                                      setNewLocations(newlocations);
                                    }}
                                  />
                                )
                              ),
                            }}
                            onChange={(e) => setEditLocation(e.target.value)}
                            value={editlocation}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setNewLocations([
                                  ...newlocations,
                                  editlocation,
                                ]);
                                setEditLocation("");
                              }
                            }}
                          />
                        )}
                      </CardContent>
                      <CardActions>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyItems="center"
                        >
                          {specIndex !== index && (
                            <Button
                              onClick={() => {
                                setSpecIndex(index);
                                setNewLocations(s.locations);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                          {specIndex === index && (
                            <Button onClick={editLocations}>Save</Button>
                          )}
                          <Delete
                            type="spec"
                            client={client}
                            id={marketplace[itemIndex].id}
                            brand={
                              marketplace[itemIndex].brands[brandIndex].brand
                            }
                            device_type={
                              marketplace[itemIndex].brands[brandIndex].types[
                                typeIndex
                              ].type
                            }
                            spec={
                              marketplace[itemIndex].brands[brandIndex].types[
                                typeIndex
                              ].specs[index].spec
                            }
                            refresh={getMarketplace}
                          />
                        </Stack>
                      </CardActions>
                    </Card>
                  );
                })}
              <Tooltip title="Add New Spec">
                <AddNew
                  type="spec"
                  client={client}
                  id={marketplace[itemIndex].id}
                  brand={marketplace[itemIndex].brands[brandIndex].brand}
                  device_type={
                    marketplace[itemIndex].brands[brandIndex].types[typeIndex]
                      .type
                  }
                  refresh={getMarketplace}
                />
              </Tooltip>
            </Stack>
          )}
        {client !== "" &&
          itemIndex !== -1 &&
          brandIndex !== -1 &&
          typeIndex !== -1 &&
          specIndex === -1 && (
            <Typography>Select a spec to edit or add a new spec</Typography>
          )}
      </Stack>
    </Box>
  );
};

export default EditMarketplace;
