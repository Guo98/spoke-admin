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

export async function testAuth(accessToken: string) {
  return fetch(process.env.REACT_APP_SPOKE_API + "/testingauth", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
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
