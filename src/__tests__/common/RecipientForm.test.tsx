import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import RecipientForm from "../../components/common/RecipientForm";

import {
  makeMountRender,
  debugMountRender,
} from "../../utilities/test-utils/test-utils";
// import { server } from "../../setupTests";
//@ts-ignore
import { rest } from "msw";

describe("[Recipient Form]", () => {
  test("Renders component", async () => {
    const wrapper = makeMountRender(<RecipientForm address_required={false} />);

    //@ts-ignore
    console.log(
      "wrapper ::::::::::: ",
      debugMountRender(<RecipientForm address_required={false} />)
    );
  });
});
