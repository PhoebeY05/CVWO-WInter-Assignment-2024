import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewComment from "./NewComment";

const Comment = ({ comment, author }) => {
    const navigate = useNavigate();
    const [replies, setReplies] = useState([]);
    const [body, setBody] = useState("");
    const[editComment, setEditComment] = useState(false);

    // Loading all replies
    useEffect(() => {
        const url = `/api/v1/comments/show/${String(comment.id)}`;
        fetch(url)
            .then((res) => {
                if (res.ok) {
                return res.json();
                }
                throw new Error("Network response was not ok.");
            })
            .then((res) => setReplies(res))
            .catch(() => navigate(`/posts/${String(comment.post_id)}`));
    }, [comment.id]);

    
    const changeComment = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>| React.FormEvent<HTMLFormElement>, comment: any, action: string = "create") => {
        event.preventDefault();
        if (action == "create" && body.length == 0) {
            return;
        }
        const url = action == "create" ? `/api/v1/comments/create` : `/api/v1/comments/${action}/${String(comment.id)}`;
        const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
        const create = () => {
            const request_body = {
                body,
                post_id: Number(comment.post_id), 
                parent_id: Number(comment.id),
                author: localStorage.getItem("username") 
              };
            return fetch(url, {
                method: "POST",
                headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json",
                },
                body: JSON.stringify(request_body),
            });
        }
        const del = () => fetch(url, {
            method: "DELETE",
            headers: {
              "X-CSRF-Token": token,
              "Content-Type": "application/json",
            },
          });
        // Function to send PUT request
        const update = () => {
            const request_body = {
                body: body,
                parent_id: Number(comment.parent_id),
                post_id: Number(comment.post_id),
                author: localStorage.getItem("username"),
            }
            return fetch(url, {
                method: "PUT",
                headers: {
                "X-CSRF-Token": token,
                "Content-Type": "application/json",
                },
                body: JSON.stringify(request_body),
            });
        }
        let request = action === "create" ? create() : action === "update" ? update() : del();
        // Processing DELETE/PUT request
        request
        .then((response) => {
        if (response.ok) {
        return response.json();
        }
        throw new Error("Network response was not ok.");
        })
        .then((response) => location.reload())
        .catch((error) => console.log(error.message));
        };

    const deleteButton = (comment: any) => (
        <div className="row">
            <button
                type="button"
                className="btn btn-danger"
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => changeComment(e, comment, "destroy")}
            >
                Delete Comment
            </button>
        </div>
    )


    const allReplies = replies.map((reply: any, index: number) => (
        <div key={index} className="row">
            <div className="col">
                <p className="text-muted d-flex flex-row justify-content-center p-0"><NewComment text="add a reply" onSubmit={(e: React.FormEvent<HTMLFormElement>) => changeComment(e, reply, "create")} setBody={setBody}/></p>
            </div>
            <Comment comment={reply} author = {author} />
        </div>
    ));
    const noReplies = (
        <div className="row">
            <span className="text-muted fs-6">No replies yet. Why not <NewComment text="add one" onSubmit={(e: React.FormEvent<HTMLFormElement>) => changeComment(e, comment, "create")} setBody={setBody}/>?</span>
        </div>
    )
    const edit = (
        <form id={comment.id} onSubmit={(e: React.FormEvent<HTMLFormElement>) => changeComment(e, comment, "update")}>
            <textarea className="form-control m-3" id="exampleFormControlTextarea1" rows={3} defaultValue={comment.body} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}></textarea>
            <div className="d-flex flex-row justify-content-end mb-2">
                <button className="btn btn-link border-primary border-3 border-opacity-50"  type="submit">Edit Comment</button>
            </div>
        </form>
    )
    const normal = (
        <div>
            <p className="lead">{comment.body}</p>
            <div className="d-flex flex-row justify-content-end mb-1">
                <button className="btn btn-link" onClick={() => setEditComment(true)}>Edit Comment</button>
            </div>
        </div>
    )

    const changePin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>| React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const pinned = localStorage.getItem(`pin_${comment.id}`) == "true"
        localStorage.setItem(`pin_${comment.id}`, String(!(localStorage.getItem(`pin_${comment.id}`) == "true")))
        const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
        const url = `/api/v1/update/${comment.post_id}`;
        const request_body = {
            comment_id: !pinned ? comment.id : 0
        }
        fetch(url, {
            method: "POST",
            headers: {
            "X-CSRF-Token": token,
            "Content-Type": "application/json",
            },
            body: JSON.stringify(request_body),
        })
        .then((response) => {
            if (response.ok) {
            return response.json();
            }
            throw new Error("Network response was not ok.");
        })
        .then((response) => location.reload())
        .catch((error) => console.log(error.message));

    }
    const pin = () => {
        if (localStorage.getItem(`pin_${comment.id}`) == "true") {
            return (
                <div className="col px-3 d-flex justify-content-end">
                    <form onSubmit={changePin} className="m-0 pt-0">
                        <button className= "btn fs-4" type="submit"><img width="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAURJREFUaEPtWUEOwjAM814GvAx4GfwMiLRJVWFT7SbaKtILl6ax46RLyoTB1zQ4fiSBvRX0UOAG4CoSeQK4A7BfafUQOAN4SF6/jWQcsuEM3kh4LFPBlKRXD4EX7W3bQMIiGc04kkAliBRMySgV+F0LUjAlo5VaZGvCxbfLIWJKufh2OSQJdHxQUoEieFnESiZlCmUKKXlT2GQKzcFQxkp5iClF61VAAV7633Um7gVfE7ko5aAo4DnM15iNBPVCoRCwlwivYb4mYOApJRQCbMvAZgaFidosts1JYCsCf6nA8EVsN5A95nrfRNJHTUmh1qKsb6sQXyGHrtxWIb5CDk0CrUn6+XckFdgI1vBFXLbbdJPWmkWRKVQSoNvkIxAwDEbixLbIreBtX6QCCwFLH2pIORIBBou0N1oBCRRjlASYaEXsfQMvZDcxoe1figAAAABJRU5ErkJggg=="/></button>
                    </form>  
                </div>
            )
        } else {
            return (
                <div className="col px-3 d-flex justify-content-end">
                    <form onSubmit={changePin} className="m-0 pt-0">
                        <button className= "btn fs-4" type="submit"><img width="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAYZJREFUaEPtmFEOAiEMRLsnU0+mnkxvptawCSHgzrSAu0n3y49S5rUFWhc5+LccXL8EwL8z6MnATUSuHQCeycddRNbfsFsLwFlEHvAOnCGth16QxCvEiE+zoJmFv70BqHBKE2WcwvIqwmPxkbtw+bNs7tqwUhsufwHA1uweMwDfGKAhVRWUceMQg7pgM0oTZZwk6CM26h3Ql/gCoxrrV8VrC9EbQsXT7YQlA2uAXNffJwje9V8dAZDVKxuMyECUkLOpixLylFBtnPQeYnqYsQLUxNMvaGOyoyHYqLUGeX3+2YG85YuCYABawzy1YXHw3QFhAGpNnEf8ylKDgP0yAOW1B28CdJfmS8EDwKwFGGzNHSOizAAiymMDaYOMJk1iJSykDTKaMImV4uF3hQEYNYnVxMOTGQPA1nOXZm1r0wD4EaHIwFb5WLtRxK/aRAaQSI08xHl/A9/riOjcZhaAZV6AWEYCqADNwon9vxNSnoxmAGj5sNMazDAaABZiNQwAa+R6rTt8Bt5AwVAx/JQL5QAAAABJRU5ErkJggg=="/></button>
                    </form> 
                </div>
            )
        }
    }

    return (
        <div className="border rounded-4 shadow p-4 flex flex-column">
            <div className="row">
                <div className="col px-3 d-flex align-items-center">
                    <p className="fw-bold align-self-center">{comment.author} said ...</p> 
                </div>
                {author == localStorage.getItem("username") && comment.parent_id == 0 ? pin() : null}
                
            </div>
            <div className="row d-flex justify-content-start">
                {comment.author == localStorage.getItem("username") && editComment? edit : comment.author == localStorage.getItem("username") && !editComment ? normal : <p className="lead">{comment.body}</p>}
            </div>
            {comment.author == localStorage.getItem("username") ? deleteButton(comment) : null}
            <hr className="border-1"></hr>
            {replies.length > 0 ? allReplies : noReplies}
            
        </div>
    );
};

export default Comment