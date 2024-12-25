import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { create } from "../functions/requests"
import { getUsername } from "../functions/username"

const NewPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [name, setName] = useState(null);
  const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    getUsername().then((res) => res.message ? setName(null) : setName(res.username))
  }, [])

  // Accounting for HTML's behaviour
  const stripHtmlEntities = (str: String) => {
    return String(str)
      .replace(/\n/g, "<br> <br>")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  // Changing variables' values to match input
  const onChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, setFunction: Function) => {
    setFunction(event.target.value);
  };

  // Sending variables to backend to create a new post
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = "/api/v1/posts/create";

    if (title.length == 0 || content.length == 0) {
      alert("Please fill in all fields!");
      return;
    }
    if (name == null) {
      alert("You must be logged in to create a post!");
      navigate("/login");
      return;
    }
    console.log(anonymous)
    const body = {
      title,
      "author": name,
      category,
      "upvote": 0,
      "downvote": 0,
      content: stripHtmlEntities(content),
      anonymous: anonymous
    };

    const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
    create(url, token, body)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => navigate("/"))
      .catch((error) => console.log(error.message));
  };

  // Rendering form to fill in user input fields for a new post
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-sm-12 col-lg-6 offset-lg-3">
          <h1 className="font-weight-normal mb-5">
            Create a New Post Now!
          </h1>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title of Post</label>
              <input
                type="text"
                name="title"
                id="title"
                className="form-control"
                required
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event, setTitle)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Post Category</label>
              <input
                type="text"
                name="category"
                id="category"
                className="form-control"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event, setCategory)}
              />
            </div>
            <label htmlFor="content">Post Content</label>
            <textarea
              className="form-control"
              id="content"
              name="content"
              rows={5}
              required
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event, setContent)}
            />
            <div className="form-check mt-3">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange ={(event: React.ChangeEvent<HTMLInputElement>) => setAnonymous(!anonymous)}></input>
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Post Anonymously
              </label>
            </div>
            <button type="submit" className="btn mt-3">
              Create Post
            </button>
            <Link to="/" className="btn mt-3">
              Back to Posts
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPost;