import { roleMapping } from "../utilities/mappings";

export async function getAllOrders(
  accessToken: string,
  client: string,
  entity: string = ""
) {
  let route = `/getAllOrders/${client}`;

  if (entity !== "" && entity !== "admin") {
    route = `/getAllOrders/${client}/${roleMapping[entity]}`;
  }
  return fetch(process.env.REACT_APP_SPOKE_API + route, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Missing Body");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return [];
    });
}

export async function downloadOrders(
  accessToken: string,
  client: string,
  entity: string
) {
  let route = `/downloadorders/${client}`;

  if (entity !== "") {
    route = `/downloadorders/${client}/${entity}`;
  }

  return fetch(process.env.REACT_APP_SPOKE_API + route, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Missing Body");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return [];
    });
}

export async function sendSupportEmail(accessToken: string, body: object) {
  return fetch(process.env.REACT_APP_SPOKE_API + "/supportEmail", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Missing Body");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return [];
    });
}

export async function postOrder(
  route: string,
  accessToken: string,
  body: object
) {
  return fetch(process.env.REACT_APP_SPOKE_API + "/" + route, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Missing Body");
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return [];
    });
}
