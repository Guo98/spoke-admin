export async function getInventory(accessToken: string, client: string) {
  return fetch(process.env.REACT_APP_SPOKE_API + `/getInventory/${client}`, {
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
      console.log("testing auth data <<<<<<<<< ", data);
      return data;
    })
    .catch((err) => {
      return [];
    });
}

export async function download(accessToken: string, client: string) {
  return fetch(
    process.env.REACT_APP_SPOKE_API + `/downloadinventory/${client}`,
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
