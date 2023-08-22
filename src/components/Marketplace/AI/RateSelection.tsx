import React, { useState } from "react";
import { Tooltip, IconButton, ButtonGroup } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useAuth0 } from "@auth0/auth0-react";
import { standardPost } from "../../../services/standard";

interface RatingProps {
  requested_item: string;
  recommended_item: string;
  recommended_link: string;
}

const RateSelection = (props: RatingProps) => {
  const { requested_item, recommended_item, recommended_link } = props;

  const [loading, setLoading] = useState(false);
  const [rated, setRated] = useState(false);
  const [liked, setLiked] = useState(false);

  const [added, setAdded] = useState(false);

  const { user, getAccessTokenSilently } = useAuth0();

  const post_message = async (like: boolean) => {
    setLoading(true);
    setLiked(like);
    const accessToken = await getAccessTokenSilently();

    const body = {
      rating: like,
      requested_item,
      recommended_item,
      recommended_link,
      requestor_email: user?.email,
    };

    const messageResp = await standardPost(accessToken, "message", body);

    if (messageResp.status === "Successful") {
      setRated(true);
    }

    setLoading(false);
  };

  const request_for_marketplace = async () => {
    setLoading(true);
    const accessToken = await getAccessTokenSilently();

    const body = {
      rating: true,
      requested_item,
      recommended_item,
      recommended_link,
      add_to_marketplace: true,
      requestor_email: user?.email,
    };

    const messageResp = await standardPost(accessToken, "message", body);

    if (messageResp.status === "Successful") {
      setAdded(true);
    }

    setLoading(false);
  };

  return (
    <>
      <ButtonGroup>
        <Tooltip
          title="Add To Marketplace Selection (May take 24hrs to appear)"
          arrow
        >
          <IconButton
            color={added ? "success" : "primary"}
            disabled={added}
            onClick={request_for_marketplace}
          >
            <AddBusinessIcon color={added ? "success" : "primary"} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Good Selection">
          <IconButton
            color={rated && liked ? "success" : "primary"}
            disabled={loading || rated}
            onClick={async () => await post_message(true)}
          >
            <ThumbUpIcon color={rated && liked ? "success" : "primary"} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bad Selection">
          <IconButton
            color={rated && !liked ? "error" : "primary"}
            disabled={loading || rated}
            onClick={async () => await post_message(false)}
          >
            <ThumbDownAltIcon color={rated && !liked ? "error" : "primary"} />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </>
  );
};

export default RateSelection;
