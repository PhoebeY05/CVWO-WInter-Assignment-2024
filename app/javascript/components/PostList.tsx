import React, { useState, useEffect, use } from "react";
import { Link, useNavigate } from "react-router-dom";

const PostList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<{ title: string, author: string, category: string, content: string, id: number, pinned:number }[]>([]);
  const [filtered, setFiltered] = useState<{ title: string, author: string, category: string, content: string, id: number }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [sort, setSort] = useState<string>("");
  const char_limit = 150;

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
      .then((res) => {setPosts(res); setFiltered(res);})
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

  // Function to fit content to card height
  const addHtmlEntities = (str: string) => {
    return String(str).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  };
  const content = (index: number) => {
    return addHtmlEntities(posts[index].content.substring(0, char_limit));
  }

  const deletePost = (event:  React.MouseEvent<HTMLButtonElement, MouseEvent>, id:number) => {
    event.preventDefault()
    const url = `/api/v1/destroy/${id}`;
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')!;
    fetch(url, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": token,
        "Content-Type": "application/json",
      },
    }).then((response) => {
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
      // <div className="col">
        <button
          type="button"
          className="btn btn-outline-danger card-link"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => deletePost(e, id)}
        >
          Delete Post
        </button>
      // </div>
    )
  }

  const editButton = (id:number) => {
    return (
      // <div className="col">
        <Link to={`/posts/${id}/edit`} className="btn btn-outline-warning card-link">
          Edit Post
        </Link>
      // </div>
    )
  }
  // Rendering posts
  const allPosts = filtered.map((post: any, index: number) => (
    <div key={String(index)} className="col-md-6 col-lg-4">
      <div className="card border-dark mb-4 h-100 shadow">
        <div className="card-header">
          <h5 className="card-title pt-2">{post.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{post.category}</h6>
        </div>
        <div className="card-body">
          {post.content.length > char_limit ? <p className="card-text">{content(index)}... <a href={`/posts/${post.id}`} className="fst-italic link-dark">Read more</a></p> : <p className="card-text">{content(index)}</p>}
        </div>
        <div className="card-footer d-flex justify-content-center bg-body border-0">
          <Link to={`/posts/${post.id}`} className="btn btn-outline-primary card-link">
              View Post
          </Link>
          {post.author == localStorage.getItem('username') ? deleteButton(post.id) : ""}
          {post.author == localStorage.getItem('username') ? editButton(post.id) : ""}
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
          <option key={index} value={category}>{category}</option>
        ))
      )
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>, setFunction: Function) => {
    setFunction(event.target.value);
  };

  const filterCategories = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(category)
    const filtered_posts = category == "remove" ? posts : posts.filter((post: any) => post.category == category);
    setFiltered(filtered_posts);
  }

  const sortPosts = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sorted_posts = [...posts]
    if (sort == "upvote") {
      sorted_posts.sort((a: any, b: any) => b.upvote - a.upvote);
    } else if (sort == "downvote") {
      sorted_posts.sort((a: any, b: any) => b.downvote - a.downvote);
    } else if (sort == "date") {
      sorted_posts.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sort == "category") {
      sorted_posts.sort((a: any, b: any) => a.category.localeCompare(b.category));
    }
    setPosts(sorted_posts);
  }
  const createButton = (
    <div className="row d-flex flex-row justify-content-end">
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
              <div className="col-11">
                <select className="form-select form-select-lg ml-5" aria-label="Large select example" onChange={(event) => onChange(event, setSort)}>
                  <option defaultValue={""}>Sort by ...</option>
                  <option value="date">Date Created</option>
                  <option value="category">Category of Post</option>
                  <option value="upvote">Upvotes</option>
                  <option value="downvote">Downvotes</option>
                </select>
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
          {localStorage.getItem('username') != null ? 
            createButton
          : ""}
          <div className="row">
            {posts.length > 0 ? <div className="row row-cols-1 row-cols-md-4 g-4">{allPosts}</div> : noPosts}
          </div>
        </main>
      </div>
    </>
  );
};

export default PostList;