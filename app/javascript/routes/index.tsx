import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostList from "../components/PostList";
import Post from "../components/Post";
import NewPost from "../components/NewPost";
import Profile from  "../components/Profile";
import Login from "../components/Login";
import Register from "../components/Register";
import Results from "../components/Results";
import EditPost from "../components/EditPost";

// Routes to render the React components
export default (
  <Router>
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/posts/:id" element={<Post />} />
      <Route path="/posts/:id/edit" element={<EditPost />} />
      <Route path="/new_post" element={<NewPost />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  </Router>
);