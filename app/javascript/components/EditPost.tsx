import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { update } from "../functions/requests"
import { getUsername } from "../functions/username"
import { addHtmlEntities, stripHtmlEntities } from "../functions/prep"

const EditPost = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState(null);
    // New values for post fields
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    // Existing values for post fields
    const [title_def, setTitle_def] = useState("");
    const [category_def, setCategory_def] = useState("");
    const [content_def, setContent_def] = useState("");
    // Original statistics
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
    
    // Get username of current user
    useEffect(() => {
        getUsername().then((res) => res.message ? setName(null) : setName(res.username))
    }, [])

    // Loading existing post data
    useEffect(() => {
        const url_p = `/api/v1/show/${params.id}`;
        fetch(url_p)
        .then((response) => {
            if (response.ok) {
            return response.json();
            }
            throw new Error("Network response was not ok.");
        })
        .then((res) => {
            setTitle_def(res.title);
            setTitle(res.title);
            setCategory_def(res.category);
            setCategory(res.category);
            setContent_def(addHtmlEntities(res.content));
            setContent(res.content);
            setUpvotes(res.upvote);
            setDownvotes(res.downvote);
        })
        .catch(() => navigate("/"));
    }, []);

    // Changing variables' values to match input
    const onChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, setFunction: Function) => {
        setFunction(event.target.value);
    };

    // Sending variables to backend to edit post
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const url = `/api/v1/update/${params.id}`;
        if (title.length == 0 || content.length == 0 )
            return;
        const body = {
            title,
            "author": name,
            category,
            "upvote": upvotes,
            "downvote": downvotes,
            content: stripHtmlEntities(content),
        };
        const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
        update(url, token, body)
        .then((response) => {
            if (response.ok) {
            return response.json();
            }
            throw new Error("Network response was not ok.");
        })
        .then((response) => navigate(`/posts/${params.id}`))
        .catch((error) => console.log(error.message));
    };

    // Rendering form to fill in user input fields to edit post
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-sm-12 col-lg-6 offset-lg-3">
                    <h1 className="font-weight-normal mb-5">
                        Edit Your Post
                    </h1>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Title of Post</label>
                            <input
                                defaultValue={title_def}
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
                                defaultValue={category_def}
                                type="text"
                                name="category"
                                id="category"
                                className="form-control"
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event, setCategory)}
                            />
                        </div>
                        <label htmlFor="content">Post Content</label>
                        <textarea
                            defaultValue={content_def}
                            className="form-control"
                            id="content"
                            name="content"
                            rows={5}
                            required
                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event, setContent)}
                        />
                        <button type="submit" className="btn mt-3">
                            Edit Post
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

export default EditPost;