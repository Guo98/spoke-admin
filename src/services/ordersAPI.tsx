export async function getAllOrders(accessToken: string) {
  return fetch(process.env.REACT_APP_SPOKE_API + "/getAllOrders/public", {
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
