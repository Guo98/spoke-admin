export async function downloadFile(accessToken: string, filename: string) {
  return fetch(process.env.REACT_APP_SPOKE_API + `/downloaddoc/${filename}`, {
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

export async function uploadFile(accessToken: string, body: any) {
  return fetch(process.env.REACT_APP_SPOKE_API + "/uploaddoc", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: body,
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
