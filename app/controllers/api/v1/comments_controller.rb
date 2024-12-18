class Api::V1::CommentsController < ApplicationController
  before_action :set_comment, only: %i[show edit update destroy]

  def index
    @post = Post.find(params[:id])
    @comments = Comment.where(post_id: @post.id)
    render json: @comments
  end

  def show
    @replies = Comment.where(parent_id: @comment.id)
    render json: @replies
  end

  def all
    @comments = Comment.where(author: params[:author])
    @posts = @comments.map{ |comment| Post.find(comment.post_id) }
    render json: { comments: @comments, posts: @posts }
  end

  def edit
  end

  def create
    comment = Comment.create!(comment_params)
    if comment
      render json: comment
    else
      render json: comment_params
    end
  end

  def update
    @comment.update(comment_params)
    render json: @comment
  end

  # DELETE /comments/1 or /comments/1.json
  def destroy
    @comment.destroy!
    render json: { message: "Comment deleted!" }
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_comment
      @comment = Comment.find(params.require(:id))
    end

    # Only allow a list of trusted parameters through.
    def comment_params
      params.require(:comment).permit(:body, :post_id, :parent_id, :author)
    end
end
