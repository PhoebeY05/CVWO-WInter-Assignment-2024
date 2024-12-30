class Api::V1::PostsController < ApplicationController
  before_action :set_post, only: %i[show destroy update patch]

  # GET /api/v1/posts/index
  def index
    post = Post.all.order(created_at: :desc)
    render json: post
  end

  # POST /api/v1/posts/create
  def create
    post = Post.create!(post_params)
    if post
      render json: post
    else
      render json: post_params
    end
  end
  
  # GET /api/v1/show/:id
  def show
    render json: @post
  end

  # DELETE /api/v1/destroy/:id
  def destroy
    @post&.destroy
    render json: { message: "Post deleted!" }
  end

  # PUT /api/v1/update/:id
  def update
    @post.update(post_params)
    render json: @post
  end

  # POST /api/v1/update/:id
  def patch
    @post.pinned = params[:comment_id]
    @post.save
    render json: @post
  end

  private
  def post_params
    params.permit(:title, :author, :category, :upvote, :downvote, :content, :pinned, :anonymous)
  end
  
  # Set @post as post found by its id
  def set_post
    @post = Post.find(params[:id])
  end
end
