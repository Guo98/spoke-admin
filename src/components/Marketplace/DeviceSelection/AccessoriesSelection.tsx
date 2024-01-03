import React, { useState, useEffect, ChangeEvent } from "react";
import { Stack, Button, Checkbox, FormControlLabel } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import LinearLoading from "../../common/LinearLoading";

import { addProducts } from "../../../app/slices/marketSlice";

import { textfield_style, button_style } from "../../../utilities/styles";
import { RootState } from "../../../app/store";
import { standardGet } from "../../../services/standard";

interface AccessoriesProps {
  addAccessories: Function;
  client: string;
}

const AccessoriesSelection = (props: AccessoriesProps) => {
  const { addAccessories, client } = props;

  const dispatch = useDispatch();

  const { getAccessTokenSilently } = useAuth0();

  const accessories_redux = useSelector(
    (state: RootState) => state.market.accessories
  );

  const [return_box, setReturnBox] = useState(false);
  const [include_items, setIncludeItems] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const handleReturnBoxChecked = (event: ChangeEvent<HTMLInputElement>) => {
    setReturnBox(event.target.checked);
  };

  const handleItemsChecked = (label: string, checked: boolean) => {
    if (checked) {
      if (!include_items.includes(label)) {
        setIncludeItems((prevItems) => [...prevItems, label]);
      }
    } else {
      const item_index = include_items.indexOf(label);
      if (item_index > -1) {
        let current_items = [...include_items];
        current_items.splice(item_index, 1);
        setIncludeItems(current_items);
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

  useEffect(() => {
    if (accessories_redux === null) {
      getProducts().catch();
    }
  }, [accessories_redux]);

  return (
    <Stack spacing={2} pt={2}>
      {loading && <LinearLoading />}
      {accessories_redux &&
        accessories_redux.items &&
        accessories_redux.items.length > 0 &&
        accessories_redux.items.map((item: any) => {
          return (
            <FormControlLabel
              sx={{ ml: 0 }}
              control={
                <Checkbox
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleItemsChecked(item.name, e.target.checked)
                  }
                  checked={include_items.includes(item.name)}
                />
              }
              label={item.name}
            />
          );
        })}
      <FormControlLabel
        control={
          <Checkbox onChange={handleReturnBoxChecked} checked={return_box} />
        }
        label="Include Return Box"
      />
      <Button
        variant="contained"
        sx={button_style}
        onClick={() => {
          let add_items = [...include_items];

          if (return_box) {
            add_items.push("Include Return Box");
          }

          addAccessories(add_items);
        }}
      >
        Submit Order
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
