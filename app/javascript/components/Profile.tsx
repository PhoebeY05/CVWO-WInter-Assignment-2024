import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<{ title: string, author: string, category: string, content: string, id: number, pinned: number }[]>([]);
    const [stars, setStars] = useState<{ title: string, author: string, category: string, content: string, id: number }[]>([]);
    const [comments, setComments] = useState<{ id: number, body: string, post_id: number, parent_id: number, author: string}[]>([]);
    const [parent, setParent] = useState<{ title: string, author: string,  category: string, content: string, id: number }[]>([]);
    const char_limit = 100

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

    // Loading my posts
    useEffect(() => {
        const url = "/api/v1/search/posts";
        fetch(url, {
          method: "POST",
          headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: localStorage.getItem("username")
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((response) => setPosts(response.user))
          .catch((error) => console.log(error.message));
      }, []);
    
    // Loading my starred posts
    useEffect(() => {
        const url = "/api/v1/stars/index";
        fetch (url, {
          method: "POST",
          headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: localStorage.getItem("username")
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Network response was not ok.");
          })
          .then((response) => setStars(response))
          .catch((error) => console.log(error.message));
      }, []);
    
    // Loading my comments
    useEffect(() => {
        const url = "/api/v1/comments/all";
        const request_body = {
          author: localStorage.getItem("username")
        }
        fetch(url, {
          method: "POST",
          headers: {
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')!,
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
          .then((response) => {setParent(response.posts); setComments(response.comments)})
          .catch((error) => console.log(error.message));
      }, []);
  

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

    const myComments = comments.map((comment: any, index: number) => (
      <tr key={index}>
        <td>{comment.body}</td>
        <td><Link to={`/posts/${parent[index].id}`} className="text-dark">{parent[index].title}</Link></td>
      </tr>
    ))

    const logout = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        sessionStorage.clear();
        localStorage.clear();
        navigate("/");
        location.reload();
    }

    return (
        <div className="container mt-4">
          <div className="row d-flex flex-row">
            <div className="col-8">
              <span className="display-6 bg-body-tertiary p-3 rounded border" >My Posts: <span className="badge rounded-pill text-bg-danger">{posts.length}</span></span>
              <div className="list-group mt-4">
                {posts.length > 0 ? myPosts : ""}
              </div>
            </div>
            <div className="col-4 d-flex flex-column">
              <div className="row-">
                <div className="card">
                  <div className="card-header display-6">
                    Starred Posts:
                    <span className="badge rounded-pill text-bg-danger mx-3">{stars.length}</span>
                  </div>
                  <ul className="list-group list-group-flush">
                    {stars.length > 0 ? myStars : ""}
                  </ul>
                </div>
              </div>
              <div className="row-cols mt-3"> 
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
           <form onSubmit={logout}>
            <button type="submit" className="btn btn-danger position-absolute bottom-0 start-0 mb-5 mx-5">Logout</button>
           </form>
      </div>
    );
}

export default Profile