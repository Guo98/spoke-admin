import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import LinearLoading from "../../common/LinearLoading";
import QuantityField from "../../common/QuantityField";

import { addProducts } from "../../../app/slices/marketSlice";

import { textfield_style, button_style } from "../../../utilities/styles";
import { RootState } from "../../../app/store";
import { standardGet } from "../../../services/standard";

interface AccessoriesProps {
  addAccessories?: Function;
  client: string;
  ret_device: string;
  setRetDevice: Function;
  ret_sn: string;
  setRetSN: Function;
  ret_condition: string;
  setRetCondition: Function;
  ret_act_key: string;
  setRetActKey: Function;
  ret_note: string;
  setRetNote: Function;
  addons: string[];
  nextStep: Function;
}

const AccessoriesSelection = (props: AccessoriesProps) => {
  const {
    addAccessories,
    client,
    ret_device,
    ret_sn,
    ret_condition,
    ret_act_key,
    ret_note,
    setRetDevice,
    setRetSN,
    setRetCondition,
    setRetActKey,
    setRetNote,
    addons,
    nextStep,
  } = props;

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  const accessories_redux = useSelector(
    (state: RootState) => state.market.accessories
  );

  const mrkt_client = useSelector(
    (state: RootState) => state.market.marketplace_client
  );

  const [return_box, setReturnBox] = useState(false);
  const [yubikey, setYubikey] = useState(false);
  const [include_items, setIncludeItems] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const handleReturnBoxChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setReturnBox(event.target.checked);
  };

  const handleYubikeyChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setYubikey(event.target.checked);
    if (event.target.checked) {
      if (!include_items.includes("yubikey")) {
        setIncludeItems((prevItems) => [...prevItems, "1 x yubikey"]);
      }
    } else {
      const item_index = include_items.findIndex((i) => i.includes("yubikey"));
      if (item_index > -1) {
        let current_items = [...include_items];
        current_items.splice(item_index, 1);
        setIncludeItems(current_items);
      }
    }
  };

  const handleItemsChecked = (label: string, checked: boolean) => {
    const item_index = include_items.findIndex((i) => i.includes(label));
    if (checked) {
      if (item_index < 0) {
        let new_items = [...include_items, "1 x " + label];
        setIncludeItems((prevItems) => [...prevItems, "1 x " + label]);
        if (addAccessories) {
          addAccessories(new_items);
        }
      }
    } else {
      if (item_index > -1) {
        let current_items = [...include_items];
        current_items.splice(item_index, 1);
        setIncludeItems(current_items);
        if (addAccessories) {
          addAccessories(current_items);
        }
      }
    }
  };

  const getProducts = async () => {
    setLoading(true);
    if (client) {
      const accessToken = await getAccessTokenSilently();

      const marketplace_res = await standardGet(
        accessToken,
        "getmarketplaceinventory/" + client
      );

      dispatch(addProducts(marketplace_res.data));
    }
    setLoading(false);
  };

  const changeQuantity = (label: string, quantity: number) => {
    let updated_items = [...include_items];
    let item_index = updated_items.findIndex((i) => i.includes(label));

    if (item_index > -1) {
      updated_items.splice(item_index, 1);
      setIncludeItems([...updated_items, quantity + " x " + label]);
    }
  };

  useEffect(() => {
    if (accessories_redux === null) {
      getProducts().catch();
    }
  }, [accessories_redux]);

  useEffect(() => {
    if (client !== mrkt_client) {
      getProducts().catch();
    }
  }, [client]);

  useEffect(() => {
    setIncludeItems(addons);

    if (addons.findIndex((i) => i.includes("yubikey")) > -1) {
      setYubikey(true);
    }
  }, [addons]);

  return (
    <Stack spacing={2} pt={2}>
      {loading && <LinearLoading />}
      {accessories_redux &&
        accessories_redux.items &&
        accessories_redux.items.length > 0 &&
        accessories_redux.items.map((item: any) => {
          return (
            <Stack
              direction="row"
              spacing={1}
              justifyContent="space-between"
              alignItems="center"
            >
              <FormControlLabel
                sx={{ ml: 0 }}
                control={
                  <Checkbox
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleItemsChecked(item.name, e.target.checked)
                    }
                    checked={
                      include_items.findIndex((i) => i.includes(item.name)) > -1
                    }
                  />
                }
                label={item.name}
              />
              {include_items.findIndex((i) => i.includes(item.name)) > -1 && (
                <QuantityField
                  changeQuantity={changeQuantity}
                  item={item.name}
                  item_quantity={parseInt(
                    include_items[
                      include_items.findIndex((i) => i.includes(item.name))
                    ].split("x")[0]
                  )}
                />
              )}
            </Stack>
          );
        })}
      {client === "Automox" && (
        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <FormControlLabel
            sx={{ ml: 0 }}
            control={
              <Checkbox onChange={handleYubikeyChecked} checked={yubikey} />
            }
            label="2 x Yubikey 5C NFC"
          />
          {include_items.findIndex((i) => i.includes("yubikey")) > -1 && (
            <QuantityField
              changeQuantity={changeQuantity}
              item="yubikey"
              item_quantity={parseInt(
                include_items[
                  include_items.findIndex((i) => i.includes("yubikey"))
                ].split("x")[0]
              )}
            />
          )}
        </Stack>
      )}
      <FormControlLabel
        control={
          <Checkbox onChange={handleReturnBoxChecked} checked={return_box} />
        }
        label="Include Return Box"
      />
      {return_box && (
        <Stack spacing={1} px={1}>
          <TextField
            sx={textfield_style}
            size="small"
            fullWidth
            label="Device Name"
            value={ret_device}
            onChange={(e) => setRetDevice(e.target.value)}
          />
          <TextField
            sx={textfield_style}
            size="small"
            fullWidth
            label="Serial Number"
            value={ret_sn}
            onChange={(e) => setRetSN(e.target.value)}
          />
          <TextField
            sx={textfield_style}
            size="small"
            fullWidth
            label="Condition"
            value={ret_condition}
            onChange={(e) => setRetCondition(e.target.value)}
          />
          <TextField
            sx={textfield_style}
            size="small"
            fullWidth
            label="Activation Key"
            value={ret_act_key}
            onChange={(e) => setRetActKey(e.target.value)}
          />
          <TextField
            sx={textfield_style}
            size="small"
            fullWidth
            label="Return Note"
            value={ret_note}
            onChange={(e) => setRetNote(e.target.value)}
          />
        </Stack>
      )}
      <Button
        variant="contained"
        sx={button_style}
        onClick={() => {
          let add_items = [...include_items];

          if (return_box) {
            add_items.push("Include Return Box");
          }

          nextStep(add_items);
        }}
      >
        Continue
      </Button>
    </Stack>
  );
};

export default AccessoriesSelection;

/**
 * 
 * @param props dn: string,
    ds: string,
    du: string = "",
    region: string,
    price: string,
    image_source: string,
    stock_level: string,
    ai_specs: string,
    sup: string,
    cdw_part_no: string = "",
    type: string = "quote"
 * @returns 
 */
