export async function getInventory(accessToken: string) {
  return fetch(process.env.REACT_APP_SPOKE_API + "/getInventory/public", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      // console.log("response ::::::::::", response.json());
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

export async function deployLaptop(accessToken: string, body: object) {
  return fetch(process.env.REACT_APP_SPOKE_API + "/deployLaptop", {
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
