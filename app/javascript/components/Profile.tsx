import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import { create, del } from "../functions/requests"
import { getUsername } from "../functions/username"
import { logout } from "../functions/logout"

const Profile = () => {
    const [posts, setPosts] = useState<{ title: string, author: string, category: string, content: string, id: number, pinned: number }[]>([]);
    const [stars, setStars] = useState<{ title: string, author: string, category: string, content: string, id: number }[]>([]);
    const [upvotes, setUpvotes] = useState<{ title: string, author: string, category: string, content: string, id: number }[]>([]);
    const [downvotes, setDownvotes] = useState<{ title: string, author: string, category: string, content: string, id: number }[]>([]);
    const [comments, setComments] = useState<{ id: number, body: string, post_id: number, parent_id: number, author: string}[]>([]);
    const [parent, setParent] = useState<{ title: string, author: string,  category: string, content: string, id: number }[]>([]);
    const char_limit = 100
    const [name, setName] = useState<string | null>("");

    const addHtmlEntities = (str: string) => {
        return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    };

    const content = (index: number) => {
        const result_content = addHtmlEntities(posts[index].content);
        if (result_content.length > char_limit) {
            const shown = result_content.substring(0, char_limit) + "...";
            return (
                <td className="lead">{shown}<Link to={`/posts/${posts[index].id}`} className="link-opacity-50-hover">Read more</Link></td>
            )
        } else {
            return (
                <td className="lead">{result_content}</td>
            )
        }
    }
    const date_created = (date:string) => date.substring(0, 10);

    useEffect(() => {
        getUsername().then((res) => res.message == "User not found" ? setName(null) : setName(res.username));
    }, [])

    // Loading posts, comments, starred, upvoted & downvoted
    useEffect(() => {
      if (!name) return;
  
      const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
      Promise.all([
          create("/api/v1/search/posts", token, { query: name }).then((res) => res.json()),
          create(`/api/v1/comments`, token, { username: name }).then((res) => res.json()),
          create(`/api/v1/fields/index`, token, { username: name }).then((res) => res.json()),
      ])
          .then(([postsRes, commentsRes, fieldsRes]) => {
              setPosts(postsRes.user || []);
              setParent(commentsRes.posts || []);
              setComments(commentsRes.comments || []);
              setStars(fieldsRes.starred || []);
              setUpvotes(fieldsRes.upvoted || []);
              setDownvotes(fieldsRes.downvoted || []);
          })
          .catch((error) => {
              console.log(error.message);
          });
  }, [name]);
  
    
    

    const myPosts = posts.map((post: any, index: number) => (
      <div key={index}>
        <a href={`/posts/${post.id}`} className="list-group-item list-group-item-action">
          <div className="d-flex w-100 justify-content-between">
            <h5 className="mb-1 lead fw-bold">{post.title}</h5>
            <small className="text-body-secondary">Created on {date_created(post.created_at)}</small>
          </div>
          <p className="mb-1">{content(index)}</p>
          <small className="text-body-secondary">Category: {post.category}</small>
        </a>
      </div>
    ))


    const myStars = stars.map((star: any, index: number) => (
        <li key={index} className="list-group-item lead">
          <Link to={`/posts/${star.id}`} className="link-opacity-50-hover d-flex flex-column">{star.title}</Link>
          <p className="h6">by {star.author}</p>
          <p className="">Category: {star.category}</p>
        </li>
    ))
    const myUpvotes = upvotes.map((upvote: any, index: number) => (
      <li key={index} className="list-group-item lead">
        <Link to={`/posts/${upvote.id}`} className="link-opacity-50-hover d-flex flex-column">{upvote.title}</Link>
        <p className="h6">by {upvote.author}</p>
        <p className="">Category: {upvote.category}</p>
      </li>
    ))

    const myDownvotes = downvotes.map((downvote: any, index: number) => (
      <li key={index} className="list-group-item lead">
        <Link to={`/posts/${downvote.id}`} className="link-opacity-50-hover d-flex flex-column">{downvote.title}</Link>
        <p className="h6">by {downvote.author}</p>
        <p className="">Category: {downvote.category}</p>
      </li>
    ))

    const myComments = comments.map((comment: any, index: number) => (
      <tr key={index}>
        <td>{comment.body}</td>
        <td><Link to={`/posts/${parent[index].id}`} className="text-dark">{parent[index].title}</Link></td>
      </tr>
    ))

    const deleteAccount = () => {
      const token = document.getElementsByName("csrf-token")[0].getAttribute('content')!;
      const url = `/api/v1/users/destroy`;
      del(url, token)
        .then((response) => {
          if (response.ok) {
            window.location.href = "/";
          } 
        })
        .catch((error) => console.log(error.message));
    }

    return (
        <div className="container mt-4">
          <div className="row d-flex flex-row">
            <div className="col-8">
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                      <span className="h2" >My Posts: <span className="badge rounded-pill text-bg-secondary">{posts.length}</span></span>
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse">
                    <div className="accordion-body">
                      <div className="list-group mt-4">
                        {posts.length > 0 ? myPosts : ""}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      <span className="h2" >My Comments: <span className="badge rounded-pill text-bg-secondary">{comments.length}</span></span>
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" >
                    <div className="accordion-body">
                      <table className="table table-bordered border-primary shadow">
                        <thead>
                          <tr>
                            <th scope="col">Comment</th>
                            <th scope="col">Post</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comments.length > 0 ? myComments : ""}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 d-flex flex-column">
              <div className="row-">
                <div className="accordion" id="accordionExample2">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        <span className="h2" >Starred Posts: <span className="badge rounded-pill text-bg-secondary">{stars.length}</span></span>
                      </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse">
                      <div className="accordion-body">
                        <div className="card">
                          <ul className="list-group list-group-flush">
                            {stars.length > 0 ? myStars : ""}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                        <span className="h2" >My Upvotes: <span className="badge rounded-pill text-bg-secondary">{upvotes.length}</span></span>
                      </button>
                    </h2>
                    <div id="collapseFour" className="accordion-collapse collapse">
                      <div className="accordion-body">
                      <div className="card">
                          <ul className="list-group list-group-flush">
                            {upvotes.length > 0 ? myUpvotes : ""}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFour">
                        <span className="h2" >My Downvotes: <span className="badge rounded-pill text-bg-secondary">{downvotes.length}</span></span>
                      </button>
                    </h2>
                    <div id="collapseFive" className="accordion-collapse collapse">
                      <div className="accordion-body">
                      <div className="card">
                          <ul className="list-group list-group-flush">
                            {downvotes.length > 0 ? myDownvotes : ""}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <form className="col" onSubmit={logout}>
              <button type="submit" className="btn btn-outline-danger btn-lg my-3">Logout</button>
            </form>
            <form className="col d-flex justify-content-end" onSubmit={deleteAccount}>
              <button type="submit" className="btn btn-outline-danger btn-lg my-3">Delete Account</button>
            </form>
          </div>
      </div>
    );
}

export default Profile