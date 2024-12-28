import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { create } from "../functions/requests"

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Changing variables' values to match input
  const onChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, setFunction: Function) => {
    setFunction(event.target.value);
  };

  // Sending variables to backend to create a new user
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url_new_user = "/api/v1/users/create";
    const url_session = "/api/v1/sessions/create";

    // Checking if all fields are filled & passwords match
    if (username.length == 0 || password.length == 0)
      return;
    if (password != passwordConfirmation) {
      alert("Passwords do not match!");
      return; 
    }

    const body = {
      username,
      password
    };
    
    // Action after receiving response from backend
    const destination = (response: any) => {
        if (response.message) {
          alert(response.message);
        } else {
          create(url_session, token, body)
              .then((response) => {navigate("/"); location.reload();})
              .catch((error) => console.log(error.message));
        }
    }

    const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
    create(url_new_user, token, body)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => destination(response))
      .catch((error) => console.log(error.message));
  };

  // Rendering form to fill in user input fields for a new post
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-sm-12 col-lg-6 offset-lg-3">
          <h1 className="font-weight-normal mb-5">
            Login Now!
          </h1>
          <form onSubmit={onSubmit}>
            <div className="form-floating mb-3">
              <input
                type="text"
                name="title"
                id="title"
                className="form-control"
                placeholder="Username"
                required
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event, setUsername)}
              />
              <label htmlFor="title">Enter your username:</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                placeholder="Password"
                autoComplete="on"
                required
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event, setPassword)}
              />
              <label htmlFor="password">Enter your password: </label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                name="password_confirmation"
                id="password_confirmation"
                className="form-control"
                placeholder="Password"
                autoComplete="on"
                required
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event, setPasswordConfirmation)}
              />
              <label htmlFor="password_confirmation">Enter your password again: </label>
            </div>
            <div className="row mt-2">
                <div className="m-2 col d-flex flex-row">
                    <Link to="/" className="btn btn-secondary mt-3">
                        Back to Home
                    </Link>
                </div>
                <div className="m-2 col col-md-4 offset-md-4 d-flex flex-row-reverse">
                    <button type="submit" className="btn btn-primary mt-3">
                        Register
                    </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;