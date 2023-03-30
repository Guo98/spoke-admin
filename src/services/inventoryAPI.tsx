import { roleMapping } from "../utilities/mappings";

export async function getInventory(
  accessToken: string,
  client: string,
  entity: string = ""
) {
  let route = `/getInventory/${client}`;

  if (entity !== "" && entity !== "admin") {
    route = `/getInventory/${client}/${roleMapping[entity]}`;
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

export async function resetData(accessToken: string) {
  return fetch(process.env.REACT_APP_SPOKE_API + `/resetdata`, {
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

export async function manageLaptop(
  accessToken: string,
  body: object,
  route: string
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

export async function download(
  accessToken: string,
  client: string,
  entity: string
) {
  return fetch(
    process.env.REACT_APP_SPOKE_API +
      (entity !== ""
        ? `/downloadinventory/${client}/${entity}`
        : `/downloadinventory/${client}`),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  )
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
