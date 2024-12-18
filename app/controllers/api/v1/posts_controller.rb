class Api::V1::PostsController < ApplicationController
  before_action :set_post, only: %i[show destroy update patch]


  def index
    post = Post.all.order(created_at: :desc)
    render json: post
  end

  def create
    post = Post.create!(post_params)
    if post
      render json: post
    else
      render json: post_params
    end
  end

  def show
    render json: @post
  end

  def destroy
    @post&.destroy
    render json: { message: "Post deleted!" }
  end

  def update
    @post.update(post_params)
    render json: @post
  end

  def patch
    @post.pinned = params[:comment_id]
    @post.save
    render json: @post
  end
  private

  def post_params
    params.permit(:title, :author, :category, :upvote, :downvote, :starred, :content, :pinned)
  end

  def set_post
    @post = Post.find(params[:id])
  end
end
