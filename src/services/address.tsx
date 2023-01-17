export async function validateAddress(address: string, accessToken: string) {
  return fetch(process.env.REACT_APP_SPOKE_API + "/validateAddressUI", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address: address }),
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
