import React, { useState } from "react";
import {
  Card,
  Typography,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { openMarketplace } from "../../app/slices/marketSlice";
import { standardPost } from "../../services/standard";

interface BookmarkProps {
  device_line: string;
  specs: string;
  brand: string;
  locations: string[];
  item_type: string;
  client: string;
  refresh: Function;
}

const BookmarkedCard = (props: BookmarkProps) => {
  const { device_line, specs, brand, locations, client } = props;

  const { getAccessTokenSilently } = useAuth0();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const select_device = () => {
    const market_obj = {
      brand,
      specific_specs: specs,
      specific_device: device_line,
      bookmark: true,
      item_type: props.item_type,
    };

    dispatch(openMarketplace(market_obj));
  };

  const delete_bookmark = async () => {
    setLoading(true);

    const access_token = await getAccessTokenSilently();
    const delete_obj = {
      brand,
      specs,
      type: device_line,
      product_type: props.item_type,
      client,
    };

    const delete_resp = await standardPost(
      access_token,
      "marketplace/bookmark/delete",
      delete_obj
    );

    if (delete_resp.status === "Successful") {
      await props.refresh();
    }

    setLoading(false);
  };

  return (
    <Card
      sx={{
        width: { sm: "100%", md: "30%" },
        maxHeight: "25%",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography fontWeight="bold">{device_line}</Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Buy">
              <IconButton onClick={select_device} disabled={loading}>
                <ShoppingCartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove bookmark">
              <IconButton onClick={delete_bookmark} disabled={loading}>
                {!loading ? <CloseIcon /> : <CircularProgress />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
        <Typography>{specs}</Typography>
      </CardContent>
    </Card>
  );
};

export default BookmarkedCard;
