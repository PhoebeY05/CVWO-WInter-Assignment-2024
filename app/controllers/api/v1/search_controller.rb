class Api::V1::SearchController < ApplicationController

  # GET /api/v1/search/posts
  def index
      @title = Post.where("title LIKE ?", "%#{params[:query]}%")
      @content = Post.where("content LIKE ?", "%#{params[:query]}%")
      @user = Post.where("author = ?", "#{params[:query]}")
      @category = Post.where("category LIKE ?", "%#{params[:query]}%")
      render json: {title: @title, content: @content, user: @user, category: @category}
  end

  # GET /api/v1/search/post/:id
  def post
    @post = Post.find(params[:id])
    render json: @post
  end

end
