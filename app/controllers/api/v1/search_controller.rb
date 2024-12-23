class Api::V1::SearchController < ApplicationController
  def index
      @title = Post.where("title LIKE ?", "%#{params[:query]}%")
      @content = Post.where("content LIKE ?", "%#{params[:query]}%")
      @user = Post.where("author = ?", "#{params[:query]}")
      @category = Post.where("category LIKE ?", "%#{params[:query]}%")
      render json: {title: @title, content: @content, user: @user, category: @category}
  end
  def post
    @post = Post.find(params[:id])
    render json: @post
  end
  def comment
    @comment = Comment.find(params[:id])
    render json: @comment
  end

end
