import { del } from "./requests"

const logout = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const url = "/api/v1/sessions/destroy";
    const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
    del(url, token)
    .then((response) => {
    if (response.ok) {
    return response.json();
    }
    throw new Error("Network response was not ok.");
    })
    .then((response) => location.href = "/")
    .catch((error) => console.log(error.message));
}

export {logout}