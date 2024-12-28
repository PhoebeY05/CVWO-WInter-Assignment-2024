// Function to send DELETE request
const del = (url: string, token: string) => fetch(url, {
                    method: "DELETE",
                    headers: {
                        "X-CSRF-Token": token,
                        "Content-Type": "application/json",
                    },
                    });
// Function to send PUT request
const update = (url: string, token: string, body:any) => fetch(url, {
                    method: "PUT",
                    headers: {
                        "X-CSRF-Token": token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                    });
// Function to send POST request
const create = (url: string, token: string, body:any) => fetch(url, {
                    method: "POST",
                    headers: {
                        "X-CSRF-Token": token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                })
export {del, update, create};