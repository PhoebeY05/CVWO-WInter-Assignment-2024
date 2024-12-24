import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { del } from "../functions/requests"
import { getUsername } from "../functions/username"

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<{ title: string, author: string, category: string, content: string, id: number, pinned:number }[]>([]);
  const [filtered, setFiltered] = useState<{ title: string, author: string, category: string, content: string, id: number }[]>([]);
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

  const loadPosts = (res: { title: string, author: string, category: string, content: string, id: number, pinned:number }[]) => {
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
          <h6 className="card-subtitle mb-2 text-muted">{post.category || "Uncategorised"}</h6>
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