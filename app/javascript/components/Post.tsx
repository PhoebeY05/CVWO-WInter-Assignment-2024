import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NewComment from "./NewComment";
import Comment from "./Comment";
import {del, update, create} from "../functions/requests"
import { getUsername } from "../functions/username"
import { addHtmlEntities } from "../functions/prep"

const Post = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<{ title: string, author: string, category: string, content: string, upvote: number, downvote: number, id: number, pinned:number, anonymous: boolean }>({
    title: '',
    author: '',
    category: '',
    content: '',
    upvote: 0,
    downvote: 0,
    id: 0,
    pinned: 0,
    anonymous: false
  });
  const [comments, setComments] = useState<{ id: number, body: string, post_id: number, parent_id: number }[]>([]);
  const [upvoted, setUpvoted] = useState(false)
  const [downvoted, setDownvoted] = useState(false) 
  const [starred, setStarred] = useState(false)
  const [name, setName] = useState(null)

  // Get username of current user
  useEffect(() => {
    getUsername().then((res) => res.message ? setName(null) : setName(res.username));
  }, [params.id])

  // Loading post
  useEffect(() => {
    const url_p = `/api/v1/show/${params.id}`;
    fetch(url_p)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => setPost(response))
      .catch(() => navigate("/"));
  }, [params.id]);

  // Loading comments (pinned comments first)
  useEffect(() => {
    const url_c = `/api/v1/index/${params.id}`;
    fetch(url_c)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => setComments(res.sort((a: { id: number; }, b: { id: number; }) => post.pinned == a.id ? -1 : post.pinned == b.id ? 1 : a.id - b.id)))
      .catch(() => navigate("/"));
    }, [post.pinned]);
  
  // Loading Fields
  useEffect(() => {
    const url_f = `/api/v1/fields/${params.id}`;
    fetch(url_f)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => {
        if (!res.message) {
          setUpvoted(res.upvoted)
          setDownvoted(res.downvoted)
          setStarred(res.starred)
        }
      })
      .catch(() => navigate("/"));
     
    }, [params.id]);

  // Adding HTML entities  
  const postContent = addHtmlEntities(post.content);

  // Update(star, upvote, downvote)/Delete post
  const changePost = (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>, action: string, change: string = "upvote", direction: string = "plus") => {
    event.preventDefault()
    // Check if user is logged in
    if (!name)
      return;
    let url = `/api/v1/${action}/${params.id}`;
    const destination = action == "destroy" ? "/" : `/posts/${params.id}`
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')!;
    // Updating Fields
    const addOne = (val : number) => val + 1;
    const minusOne = (val: number) => val - 1;
    let request_body = post;
    const changeField = (val : number) => {
      change == "upvote" ? setUpvoted(!upvoted) : setDownvoted(!downvoted)
      const url_f = "/api/v1/fields/create";
      const field_body = {
        username: name,
        post_id: params.id,
        upvoted: change == "upvote" ? !upvoted : upvoted,
        downvoted: change == "downvote" ? !downvoted : downvoted
      }
      create(url_f, token, field_body)
      return direction == "plus" ? addOne(val) : val >= 1 ? minusOne(val) : val;
    } 
    // Updating post
    request_body = change == "upvote" ? {...post, upvote: changeField(post.upvote)} : {...post, downvote: changeField(post.downvote)}
    setPost(request_body)
    let request = action === "update" ? update(url, token, request_body) : del(url, token);

    // Processing DELETE/PUT request
    request
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response was not ok.");
    })
    .then((response) => navigate(destination))
    .catch((error) => console.log(error.message));
  };

  // Recording user's stars
  const changeStar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const request_body = {
      username: name,
      post_id: params.id,
      starred: !starred,
      upvoted: upvoted,
      downvoted: downvoted
    };
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')!;
    const url = `/api/v1/fields/create`;
    create(url, token, request_body)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => navigate(`/posts/${params.id}`))
      .catch((error) => console.log(error.message));
    setStarred(!starred);
  } 


  // Rendering comments
  const allComments = comments.filter((comment) => comment.id !== undefined && comment.parent_id === 0).map((comment: any, index: number) => (
    <div key={String(index)} className="row">
      <Comment comment={comment} author={post.author} pinned={post.pinned} />
    </div>
  ));

  // Rendering prompt if no comments
  const noComments = (
    <div className="d-flex align-items-center justify-content-center mt-4">
      <span className="fst-italic fs-5">
        No comments yet. Why not <NewComment identifier={`comment_${post.id}`} text="be the first" post_id={post.id} parent_id={0}/>?
      </span>
    </div>
  );

  // Rendering starred property
  const star = () => {
    if (!starred || name == null) {
      return (
        <form onSubmit={changeStar} className="m-0 pt-0">
          <button className= "btn fs-4" type="submit">☆</button>
        </form>  
      ) 
    } else {
      return (
        <form onSubmit={changeStar} className="m-0 pt-0">
          <button className= "btn fs-4" type="submit">★</button>
        </form> 
      )
    }
  }

  // Downvote/Upvote Component and Functionality (increase/undo)
  const downVote = () => {
    if (!downvoted || name == null) {
      return (
        <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => changePost(event, "update", "downvote")} className="m-0 pt-0">
          <button className= "btn fs-4" type="submit"><img width="30" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAaVJREFUaEPtWUFuAzEIJD9rX5b2ZWleli5SHVkOGANjVRvhyx7iDTMDA3ZyoZOvy8nxUxH47wwiMvBBRFci4qdn/RDR9/EeP8MLQeAWAN8AM/jPMPpDAQSBRwZAFkMROOp/zIAlinf/NMFWsJXq8ALy7i8CVha8inr3VwYqA4MCVUK9INVGa5Alz2NvXULRc74lSuT0ykdu8d4wCxYJxA1iBwH13jALFr2o7CCgCjMLxiXEJLxrBwG+en5JQKxg/BLfd/ulfpmXqbDfHc8iwDGkUtpBwg1+xXBNJImE2hkCmdDK1RTY3PAHRgqQ/kWhIyp1vCWBVglwLCnFCBKh0mnkPQQ0Ehk/pMB7PNCXNcrUafBRAlpnWqrZiadCeLwl1DKRNXXYtGOHixLImBpSOlETjwJ4wXj3myMlk4HZkJM6Exx8yDSKJNakDk9aKwWIDHAMy9Qw0yJNvOIHntT3nSdaVAYaGanOR6KZyf1SUWgC2pBrgaHgkSYeldGuo3DB4F84OSp4jhpW83l+votAP6khf6dqjHYSWFYxs7EIZNRDvHv6DPwC/GVtMYS+tZ0AAAAASUVORK5CYII="/></button>
        </form>  
      )
    } else {
      return (
        <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => changePost(event, "update", "downvote", "minus")} className="m-0 pt-0">
          <button className= "btn fs-4" type="submit"><img width="30" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAVxJREFUaEPtmVEOwiAQRLc305OpJ9ObaVdtQpqywM5QrFl++mEhM7vzKMRJDj6mg+uXMDC6g4wOnETkIiL6bBkPEbnN8/TpHgwDd4f4RbCKP7vVzxVgGHgiAlANYWDOf3QAiWBEKCIE7oQRoYhQRAjZhD9z40OG1PCvdyHvOR8paG6uHrk37w1WB9BsM41k7w2WAeSiwhS/rLWp1TKgEVITvzD06nndElKCWCfpfXfkyIpXUSUD+s7IKJniaw2MNFEscPGFb3ZG8JDdOtM81xrQOXvyUIyOuTUZxO5holp8CwOpp55QN4n3GugJdUuk30VtntAR6ipo1/H2GmBD3RwdL8TrAjCgdotHIsSCGhLPMoBAjUQYgngdJc+X2gUtE2KEBzg6LIg9JmjimQzUQk0V38uABTUMbU8G0rW3oKZAu5eB9EtN+Ts1d0Kmt9Q4inf5KQx0KWvDoofvwAs3Lj8xV3Zs/gAAAABJRU5ErkJggg=="/></button>
        </form>  
      )
    }
  }

  const upVote = () => {
    if (!upvoted || name == null) {
      return (
        <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => changePost(event, "update", "upvote")} className="m-0 pt-0">
          <button className= "btn fs-4" type="submit"><img width="30" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAZpJREFUaEPtmeFuwyAMhN0nW/dkW5+s3ZNttRTUlBkOzLlVJPOrUgjcB3fETU5y8HY6uH5JgHfvYOQOnEXkS0R+NsjvCNgoABV/rQR/isiNDREF8GsIVfEKQW0RAGoVtY7V6BBsgJ74AnS5/6DlgQlgiVexH3fvayb2jQbBArBCq4LL+BroGoISahaAFdq9QAuQkgcGQMs6tc+tfssQqwCj4ov/Z/vDI3cFwCvGyoM71F4AFFq0crRQewFQaBEALdQeAK91aihKqGcBWOJpoZ4BYIsvEEuhHgVYDS3KhDvUowCroUUA7lCPAERZhxJqBPAq8e5Q9wBGanvLGmhRLDsiizUr195knon2JXRLlGfcZtHXA7BOBrRSUQDNcXsAraMTQbAtpKuvxZ75RgNNhsTq9doSaMzZ/l0NaLIEMFYgd2C/KGmhDPHj3dHIgfGvT1ooLZQWckXn6abZB9Ns/5eXErNLsnSQLN28KfXU97SHKQPA+79BId7+dlpFlM+p9QcMZKVunY9uLtcZOzA6V0i/BAhZ1olBD78Df9sqbTFsV3baAAAAAElFTkSuQmCC"/></button>
        </form>  
      )
    } else {
      return (
        <form onSubmit={(event: React.FormEvent<HTMLFormElement>) => changePost(event, "update", "upvote", "minus")} className="m-0 pt-0">
          <button className= "btn fs-4" type="submit"><img width="30" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAVJJREFUaEPtmUESgjAMRcPN9GTqydSTKZmBDdM2afJDgUlXLkD/a//rWJjo5GM6eX5KgNErGLkCNyJ6ENF3gXxGwEYBcPj3JvCdiD5oiCiAXyEoh2cI6IgA4KpwdUoDDoEGaIVfgV7zB5gPSABNeDgECqAkrdR1iNQogJK0EgDEBwRAT3W2UG4IL4AnPMQHDwAivBvCCmCRVnLCJLUVwCKtBGDywQKArI5b6l6AyPAmH3oA9gjfDaEFiJBWckIltRYgQloJQCW1BmDP6nRLLQGMDK/yoQVwhPArRNWHFsCI3te8qPrQAuBDOe8+RxnFrC2AEVtn7RzNx9DiEw1JYs3se6vmyuC6eaFLAM0y167JFZgfYmWFskKeGcgKke8tUe5CWaGskHMLukKFPOcG1cG9NceIXWh9ndp7+OHw1f/52mIgALS/FXJdAoRMa8eXnn4F/pNfQzEzutmhAAAAAElFTkSuQmCC"/></button>
        </form>  
      )
    }
  }
  
  // Buttons available if user is author of post
  const buttons = () => {
    return (
      <div className="row d-flex justify-content-end">
        <div className="col-auto w-50">
          <button
            type="button"
            className="btn btn-danger w-100 "
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => changePost(e, "destroy")}
          >
            Delete Post
          </button>
        </div>
        <div className="col-auto w-50">
          <Link to={`/posts/${post.id}/edit`} className="btn btn-warning w-100 ">
            Edit Post
          </Link>
        </div>
      </div>
    )
  }
  // Adding new comment to post
  const addComment = (
    <div className="col d-flex justify-content-end">
      <NewComment identifier={`comment_${post.id}`}  text="Add Comment" post_id={post.id} parent_id={0}/>
    </div>
  )

  // Rendering post
  return (
    <div className="">
      <div className="hero position-relative d-flex align-items-center justify-content-center">
        <div className="overlay bg-dark position-absolute" />
        <h1 className="display-4 position-relative mt-4">
          {post.title}
        </h1>
      </div>
      {/* Post information */}
      <div className="container py-4">
        <div className="row d-flex justify-content-center border border-3 border-black pt-2">
          <div className="col col-sm-2 pt-3">
            <p className="lead">Author: {post.anonymous ? "Anonymous" : post.author }</p>
          </div>
          <div className="col col-sm-2 pt-3">
            <p className="lead">Category: {post.category}</p>
          </div>
          <div className="col col-sm-2">
            <div className="row d-inline-flex flex-row">
              <div className="col-8 pt-3">
                <p className="lead mb-0">Upvotes: {post.upvote}</p>
              </div>
              <div className="col-2 pt-1 d-flex justify-content-center">
                {upVote()}
              </div>
            </div>
          </div>
          <div className="col col-sm-2">
            <div className="row d-inline-flex flex-row">
              <div className="col-8 pt-3">
                <p className="lead mb-0">Downvotes: {post.downvote}</p>
              </div>
              <div className="col-2 pt-1 d-flex justify-content-center">
                {downVote()}
              </div>
            </div>
          </div>
          <div className="col col-sm-2">
            <div className="row">
              <div className="col col-sm-4 pt-3">
                <p className="lead mb-0">Starred: </p>
              </div>
              <div className="col col-sm-4 pt-2">
                {star()}
              </div>
            </div>
          </div>
        </div>
        {/* Post body */}
        <div className="row p-4 border border-3 border-top-0 border-black">
          <div className="col">
            <p className="mb-2 h3">Post Content: </p>
            <div
              className="font-monospace"
              dangerouslySetInnerHTML={{
                __html: `${postContent}`,
              }}
            />
          </div>
          <div className="col d-flex flex-column align-self-start">
            {post.author === name ? buttons() : ""}
            <div className="row d-flex justify-content-end mt-3 ">
              <div className="col">
                <span className="lead fw-medium">Comments:</span>
              </div>
              {name != null ? addComment : ""}
              {comments.length === 0 ? noComments : allComments}
            </div>
          </div>
        </div> 
        <Link to="/" className="btn btn-outline-dark mt-3">
          Back to Posts
        </Link>
      </div>
    </div>
  );
};

export default Post;