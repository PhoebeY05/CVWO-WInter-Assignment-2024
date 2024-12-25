import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewComment from "./NewComment";
import { create, update, del } from "../functions/requests"
import { getUsername } from "../functions/username"

const Comment = ({ comment, author, pinned }) => {
    const navigate = useNavigate();
    const [replies, setReplies] = useState([]);
    const [body, setBody] = useState("");
    const[editComment, setEditComment] = useState(false);
    const [name, setName] = useState(null);
    const [anonymous, setAnonymous] = useState(false);

    useEffect(() => {
        getUsername().then((res) => res.message ? setName(null) : setName(res.username))  
    }, [comment.id])

    
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
        event.stopPropagation();
        const url = `/api/v1/comments/${action}/${String(comment.id)}`;
        const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
        const existing_comment = {
            body: body,
            parent_id: Number(comment.parent_id),
            post_id: Number(comment.post_id),
            author: name,
            anonymous: comment.anonymous
        }
        let request = action === "update" ? update(url, token, existing_comment) : del(url, token);
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
                <p className="text-muted d-flex flex-row justify-content-center p-0"><NewComment identifier={`reply_${comment.id}`} text="add a reply" post_id={Number(comment.post_id)} parent_id={Number(comment.id)}/></p>
            </div>
            <Comment comment={reply} author={author} pinned={pinned} />
        </div>
    ));
    const noReplies = (
        <div className="row">
            <span className="text-muted fs-6">No replies yet. Why not <NewComment identifier={`reply_${comment.id}`} text="add one" post_id={Number(comment.post_id)} parent_id={Number(comment.id)}/>?</span>
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
        const pinned_comment = pinned == comment.id
        const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
        const url = `/api/v1/update/${comment.post_id}`;
        const request_body = {
            comment_id: !pinned_comment ? comment.id : 0
        }
        create(url, token, request_body)
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
        if (pinned == comment.id) {
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
        <div className="border rounded-4 shadow p-4 d-flex flex-column">
            <div className="row">
                <div className="col px-3 d-flex align-items-center">
                    <p className="fw-bold align-self-center">{comment.anonymous ? "Anonymous" : comment.author} said ...</p> 
                </div>
                {author == name && comment.parent_id == 0 ? pin() : null}
            </div>
            <div className="row d-flex justify-content-start">
                {comment.author == name && editComment? edit : comment.author == name && !editComment ? normal : <p className="lead">{comment.body}</p>}
            </div>
            {comment.author == name ? deleteButton(comment) : null}
            <hr className="border-1"></hr>
            {replies.length > 0 ? allReplies : noReplies}
        </div>
    );
};

export default Comment