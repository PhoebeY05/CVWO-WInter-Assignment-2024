import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { del } from "../functions/requests"
import { getUsername } from "../functions/username"

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<{ title: string, author: string, category: string, content: string, id: number, pinned:number, upvote: number, downvote: number }[]>([]);
  const [filtered, setFiltered] = useState<{ title: string, author: string, category: string, content: string, id: number, pinned:number, upvote: number, downvote: number }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<string>(sessionStorage.getItem("sort") || "");
  const [name, setName] = useState(null);
  const [count, setCount] = useState<number[]>([])
  const [ascending, setAscending] = useState<boolean>(sessionStorage.getItem("ascending") === "true"|| false);
  const char_limit = 150;

  useEffect(() => {
    getUsername().then((res) => res.message ? setName(null) : setName(res.username))
  }, [])

  const loadPosts = (res: { title: string, author: string, category: string, content: string, id: number, pinned: number, upvote: number, downvote: number }[]) => {
    setPosts(res);
    setFiltered(res);
  }
  // Loading all posts
  useEffect(() => {
    const url = "/api/v1/posts/index";
    fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => loadPosts(res.reverse()))
      .catch(() => navigate("/"));  
  }, []);

  // Loading all categories
  useEffect(() => {
    posts.forEach((post) => {
      if (!categories.includes(post.category)) {
        setCategories([...categories, post.category]);
      }
    })
  }, [posts, categories])

  // Loading all comment count 
  useEffect(() => {
    const url = `/api/v1/comments/count`;
    fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((res) => setCount(res))
      .catch(() => navigate("/"));
  }, [posts])

  // Function to fit content to card height
  const addHtmlEntities = (str: string) => {
    return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };
  const content = (post_content:string) => {
    return addHtmlEntities(post_content.substring(0, char_limit));
  }

  const deletePost = (event:  React.MouseEvent<HTMLButtonElement, MouseEvent>, id:number) => {
    event.preventDefault()
    const url = `/api/v1/destroy/${id}`;
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')!;
    del(url, token)
    .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((response) => location.reload())
      .catch((error) => console.log(error.message));
  };

  const deleteButton = (id:number) => {
    return (
        <button
          type="button"
          className="btn btn-outline-danger card-link"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => deletePost(e, id)}
        >
          Delete Post
        </button>
    )
  }

  const editButton = (id:number) => {
    return (
        <Link to={`/posts/${id}/edit`} className="btn btn-outline-warning card-link">
          Edit Post
        </Link>
    )
  }
  // Rendering posts
  const allPosts = filtered.map((post: any, index: number) => (
    <div key={String(index)} className="col-md-6 col-lg-4">
      <div className="card border-dark mb-4 h-100 shadow">
        <div className="card-header">
          <h5 className="card-title pt-2">{post.title}</h5>
          <div className="d-flex justify-content-between mt-2">
            <small className="card-subtitle text-muted"><img width="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAYVJREFUaEPtllGuAiEMRZmd6crUlenOdJpIMpkUem+HaTWBn/ciBc4pUGYpf96WP+cvUyB7B39hBy6llJc3EVkCAn1bweVvbVePSIbA/QuvJf2x/ij9cIsW6MFXaEoiUgCBpyWiBFrwkm25wE/lzEA7ESHQg6/nXS6zJmHymQHwbdIDEfg6UpMwK9OZAmy10eLTBJALuz3jrXgzwWaA4wgh8NtqI//Lo7ZvZvZlwGgBT7U59KCNFEAubKvabCWg8lkHjBJA4HvVhn7ARgow8LIuG9+9hkd3gIVh480ackSAhWHjTfgjVYiFYeMheK8AC8PGw/AeARaGjafgWQEWho2n4RkBFoaNd8GjAiwMG++GRwXeygqt5z4U3ivwM/BeAe3xC8888y20P0J7gTT4ETuQCu8VsKoG9T1vTWb1Ix9zWhVqzRsKP3oHwuFHCqTAowLWMUztR+5AKqC1+BSwMnR2P7IDTBk9g7fLOAXOSPluzrkDAUn2L4HcAf/sASOnQECSu0t8AG1ZazGSy339AAAAAElFTkSuQmCC"/>: {post.author}</small>
            <small className="card-subtitle text-muted"><img width="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAZtJREFUaEPtWAFOwzAM9F4GvAx4GfAy2KFGiqwkZy+p24IjTa02z/H5rrHrm1x83S4evySAoxlMBs7MwLOIvIoIrp71KSLv9//hWq/V/n59jyT08UDwJWAE/6IArPZHAXx70t6w1clZ7e//AWAnls4wY2DWn5uB2Q0ZQK1Ck/0oKJODaldmz35PAA9lIBnon9UmyeUzcCUJeQszqwOz/tx1YHbD8FZidfO12h9lYHX7u9ofBeCVzCH2rL85JCjPpgnAk609bEcM7PLQVSDgH5+n7Tvc410a680KNvKduI4JAWJgMFoAQ4F4eiFrUopdz7cl+OKDgogG4AneBMIDgJ1YlvZX25QZEoLFfQ8gRjR6zkQLmSWgWlbMvhVcLym67ehKKZIBDWCkb5xIAFFWa1AWzgBjqGbzlAC0LLq63pCYAEdKyAPALLdIADqorq7vRU5n/xQPsda1PufLGL810u8m2sPAikp8aCFbAaA0aqwPMlVhGP3pZm7vdrpum8FIaRW+tvtm66BlwPobr2zC7RNAeMrVhslAMjCZgR/NQIkxpyQ+7QAAAABJRU5ErkJggg=="/>: {post.category || "Uncategorised"}</small>
            <small className="card-subtitle text-muted"><img width="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAZpJREFUaEPtmeFuwyAMhN0nW/dkW5+s3ZNttRTUlBkOzLlVJPOrUgjcB3fETU5y8HY6uH5JgHfvYOQOnEXkS0R+NsjvCNgoABV/rQR/isiNDREF8GsIVfEKQW0RAGoVtY7V6BBsgJ74AnS5/6DlgQlgiVexH3fvayb2jQbBArBCq4LL+BroGoISahaAFdq9QAuQkgcGQMs6tc+tfssQqwCj4ov/Z/vDI3cFwCvGyoM71F4AFFq0crRQewFQaBEALdQeAK91aihKqGcBWOJpoZ4BYIsvEEuhHgVYDS3KhDvUowCroUUA7lCPAERZhxJqBPAq8e5Q9wBGanvLGmhRLDsiizUr195knon2JXRLlGfcZtHXA7BOBrRSUQDNcXsAraMTQbAtpKuvxZ75RgNNhsTq9doSaMzZ/l0NaLIEMFYgd2C/KGmhDPHj3dHIgfGvT1ooLZQWckXn6abZB9Ns/5eXErNLsnSQLN28KfXU97SHKQPA+79BId7+dlpFlM+p9QcMZKVunY9uLtcZOzA6V0i/BAhZ1olBD78Df9sqbTFsV3baAAAAAElFTkSuQmCC"/>: {post.upvote}</small>
            <small className="card-subtitle text-muted"><img width="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAaVJREFUaEPtWUFuAzEIJD9rX5b2ZWleli5SHVkOGANjVRvhyx7iDTMDA3ZyoZOvy8nxUxH47wwiMvBBRFci4qdn/RDR9/EeP8MLQeAWAN8AM/jPMPpDAQSBRwZAFkMROOp/zIAlinf/NMFWsJXq8ALy7i8CVha8inr3VwYqA4MCVUK9INVGa5Alz2NvXULRc74lSuT0ykdu8d4wCxYJxA1iBwH13jALFr2o7CCgCjMLxiXEJLxrBwG+en5JQKxg/BLfd/ulfpmXqbDfHc8iwDGkUtpBwg1+xXBNJImE2hkCmdDK1RTY3PAHRgqQ/kWhIyp1vCWBVglwLCnFCBKh0mnkPQQ0Ehk/pMB7PNCXNcrUafBRAlpnWqrZiadCeLwl1DKRNXXYtGOHixLImBpSOlETjwJ4wXj3myMlk4HZkJM6Exx8yDSKJNakDk9aKwWIDHAMy9Qw0yJNvOIHntT3nSdaVAYaGanOR6KZyf1SUWgC2pBrgaHgkSYeldGuo3DB4F84OSp4jhpW83l+votAP6khf6dqjHYSWFYxs7EIZNRDvHv6DPwC/GVtMYS+tZ0AAAAASUVORK5CYII="/>: {post.downvote}</small>
            <small className="card-subtitle text-muted"><img width="20" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAl1JREFUaEPtmT1OBDEMhb0NFRUXAg4EVwAaLsCBgANBRUUDsjRBweOf58Qzy0pMA8sm8ftsx5mYA534czhx/fQPcOwIVkbgiojuBBD/rT0vyy+vy8/7CvhZgCa6F5rRxVAMNAwzAjAr2gJ8GAHJArCnZJpkPI6MTYFkAJ6JyEuVluMsgJ/2uYnmuW3+ZbAWDIECWOJZJBuTYhFP8xgvorzmdbRQBODlO+ylSIQDEjooAtA8D3kGEK0N0SLi2vMAtMUqvW4xpuxaAKlFBr3tTdPs835Y7TUUYMu0sUBk+qoaLIAvsWqUOudEdLbM+SSiD0MVOo6ncwFhiP5ZRUEDkOGLxF8sVeRmsfS0fH4XxtFx/TQZBQhATvIA2KOPRNTEN+MMcdspQcfJwMkorNJIi0BI3Vlhr74Z6dKvjY4rAZD575VaVBg6TvOFq0cTlwFAUwMdVwKQSSE2iG5OdFwPUbIHoiq0wTn2s6SsiNAmDqm3VCzWDku6tgegA2QHCO11YqXXqjDQMb4xBHQeWQBaFPbcC/DLpFfjtbvAHhCweM6Av3ahSV+gIgCGtO7DldGw7sbhazwC4EHwdzMg3p07FI+kUF9oop5Q5IzWUml9pahFE3YksgA83oOQABGwVYVTEY28ZhmJDpkR8a2/lOoxjQIwmPbWmu2bhn2f6LCsBGAPen3T3rMz3bxfTJUAmrOmPbxnBKSt1GaMhFrfbxWBXcSPlNHeEXIT83ebp4yMRGUEdvN6D1EFcBTxFSm0e8pUphCftsP/XRytOpUAVRqm1pnZA1OGqyb/A1R5cnSdb21TpDFhL4sxAAAAAElFTkSuQmCC"/>: {count[post.id]}</small>
          </div>
        </div>
        <div className="card-body">
          {post.content.length > char_limit ? <p className="card-text">{content(post.content)}... <a href={`/posts/${post.id}`} className="fst-italic link-dark">Read more</a></p> : <p className="card-text">{content(post.content)}</p>}
        </div>
        <div className="card-footer d-flex justify-content-center bg-body border-0">
          <Link to={`/posts/${post.id}`} className="btn btn-outline-primary card-link">
              View Post
          </Link>
          {post.author == name ? deleteButton(post.id) : ""}
          {post.author == name ? editButton(post.id) : ""}
        </div>
      </div>
    </div>
  ));

  const noPosts = (
    <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
      <h4>
        No posts yet. Why not <Link to="/new_post">create one</Link>?
      </h4>
    </div>
  );

  const Categories = () => {
    if (categories.length > 0) {
      return (
        categories.map((category: any, index: number) => (
          <option key={index} value={category}>{category || "No Category"}</option>
        ))
      )
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>, setFunction: Function) => {
    setFunction(event.target.value);
  };

  const filterCategories = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const filtered_posts = category == "remove" ? posts : posts.filter((post: any) => post.category == category);
    setFiltered(filtered_posts);
  }

  const sortPosts = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sorted_posts = [...filtered]
    const sort_helper = (a: any, b:any) => {
      sessionStorage.setItem("sort", sort);
      sessionStorage.setItem("ascending", ascending.toString());
      if (sort == "upvote") {
        return b.upvote - a.upvote;
      } else if (sort == "downvote") {
        return b.downvote - a.downvote;
      } else if (sort == "date") {
        return  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sort == "category") {
        return a.category.localeCompare(b.category);
      } else if (sort == "comments") {
        return count[b.id] - count[a.id];
      }
    }
    if (!ascending) {
      sorted_posts.sort(sort_helper);
    } else {
      sorted_posts.sort(sort_helper).reverse();
    }
    setFiltered(sorted_posts)
  }
  const createButton = (
    <div className="col offset-md-3 d-flex flex-row justify-content-end mb-3">
        <Link to="/new_post" className="btn fs-5 btn-outline-dark border-3 shadow-lg rounded-3">
          Create New Post
        </Link>
      </div> 
  )
  // Rendering list of posts
  return (
    <>
      <section className="jumbotron jumbotron-fluid text-center">
        <div className="container py-5">
          <h1 className="display-4">Web Forum</h1>
          <p className="lead text-muted">
            What posts are you interested in today?
          </p>
        </div>
      </section>
      <div className="pb-5">
        <main className="container">
          <div className="row d-flex flex-row justify-content-center">
            <form onSubmit={sortPosts} className="row gx-3 gy-2 align-items-center">
              <div className="col-9">
                <select className="form-select form-select-lg ml-5" aria-label="Large select example" onChange={(event) => onChange(event, setSort)}>
                  <option defaultValue={""}>Sort by ...</option>
                  <option value="date">Date Created</option>
                  <option value="category">Category of Post</option>
                  <option value="upvote">Upvotes</option>
                  <option value="downvote">Downvotes</option>
                  <option value="comments">Comment Count</option>
                </select>
              </div>
              <div className="col-1 mx-auto">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={(event) => setAscending(!ascending)}></input>
                  <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Ascending</label>
                </div>
              </div>
              <div className="col-sm-1 d-flex flex-row justify-content-end mr-5 pl-0">
                <button type="submit" className="btn btn-outline-success btn-lg">Sort</button>
              </div>
            </form>
          </div>
          <div className="row d-flex flex-row justify-content-center mb-5">
            <form onSubmit={filterCategories} className="row gx-3 gy-2 align-items-center">
              <div className="col-11">
                <select className="form-select form-select-lg ml-5" aria-label="Large select example" onChange={(event) => onChange(event, setCategory)}>
                  <option defaultValue={""}>Filter by Categories</option>
                  {Categories()}
                  <option value="remove">Remove Filter</option>
                </select>
              </div>
              <div className="col-sm-1 d-flex flex-row justify-content-end mr-5 pl-0">
                <button type="submit" className="btn btn-outline-success btn-lg">Filter</button>
              </div>
            </form>
          </div>
          <div className="row">
            {name && posts.length > 0 ? createButton : ""}
          </div>
          
          <div className="row">
            {posts.length > 0 ? <div className="row row-cols-1 row-cols-md-4 g-4">{allPosts}</div> : noPosts}
          </div>
        </main>
      </div>
    </>
  );
};

export default PostList;