const getUsername = () => {
    const url = "/api/v1/users/show"
    return (
        fetch(url)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Network response was not ok.");
        })
    )
    
}
export {getUsername}