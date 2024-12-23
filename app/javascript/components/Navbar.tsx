import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { create, del } from "../functions/requests"
import { getUsername } from "../functions/username"
import {logout } from "../functions/logout"

const Navbar = () => {
    const navigate = useNavigate();
    const [body, setBody] = React.useState("");
    const [name, setName] = React.useState(null);
    useEffect(() => {
        getUsername().then((res) => res.message ? setName(null) : setName(res.username))
    }, [])

    const destination = (response: any) => {
        sessionStorage.setItem("search", JSON.stringify(response));
        navigate("/results");
        location.reload();
    }
    const searchPosts = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const url = "/api/v1/search/posts";
        const request_body = {
          query: body
        }
        const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
        create(url, token, request_body)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((response) => destination(response))
          .catch((error) => console.log(error.message));
    }

    const notLoggedIn = (
      <>
        <li className="nav-item mx-2">
          <a className="fs-5 btn btn-outline-dark border-0" aria-current="page" href="/login">Login</a>
        </li>
        <li className="nav-item mx-2">
          <a className="fs-5 btn btn-outline-dark border-0" aria-current="page" href="/register">Register</a>
        </li>
      </>
    )
    
    const logoutButton = () => {
      return (
        <ul className="nav mb-2 mb-lg-0">
          <li className="nav-item mx-2">
            <form onSubmit={logout}>
              <button type="submit" className="btn btn-danger fs-6">Logout</button>
            </form>
          </li>
        </ul>
      )
    }

    const loggedIn = (
      <>
        <li className="nav-item mx-2">
          <a className="fs-5 btn btn-outline-dark border-0" aria-current="page" href="/profile">Profile</a>
        </li>
        <li className="nav-item mx-2">
          <a className="fs-5 btn btn-outline-dark border-0" aria-current="page" href="/new_post">Create</a>
        </li>
      </>
    )
    return (
      <nav className="navbar" style={{backgroundColor: "#e3f2fd"}}>
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src="/images/logo.png" alt="Logo" className="d-inline-block align-text-top mx-2"/>
            Forum
          </a>

          <ul className="nav me-auto mb-2 mb-lg-0">
              <li className="nav-item mx-2">
                <a className="fs-5 btn btn-outline-dark border-0" aria-current="page" href="/">Posts</a>
              </li>
              {name == null ? notLoggedIn : loggedIn}
          </ul>
          <form className="d-flex w-25" role="search" onSubmit={searchPosts} >
            <input className="form-control me-2" name="query" id="query" type="search" placeholder="Search Posts" aria-label="Search" onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBody(event.target.value)}/>
            <button className="btn btn-outline-primary" type="submit">Search</button>
          </form>    
          {name != null ? logoutButton() : ""}
        </div>
    </nav>
    )
}

export default Navbar;