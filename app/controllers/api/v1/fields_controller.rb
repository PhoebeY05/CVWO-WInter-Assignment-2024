class Api::V1::FieldsController < ApplicationController
  def index
    @starred = Field.where({ username: params[:username], starred: true }).select(:post_id)
    @starred = Post.where(id: @starred)
    @upvoted = Field.where({ username: params[:username], upvoted: true }).select(:post_id)
    @upvoted = Post.where(id: @upvoted)
    @downvoted = Field.where({ username: params[:username], downvoted: true }).select(:post_id)
    @downvoted = Post.where(id: @downvoted)
    render json: { starred: @starred, upvoted: @upvoted, downvoted: @downvoted }
  end

  def create
    @field = Field.find_by(username: params[:username], post_id: params[:post_id])
    if @field
      @updated = @field.update(field_params)
      render json: @updated
    else
      @field = Field.create!(field_params)
      if @field.save
        render json: @field
      else
        render json: field_params
      end
    end
  end
  def destroy
    Field.where(username: params[:username], post_id: params[:post_id]).destroy_all
    render json: { message: "Unfieldred!" }
  end

  def post
    @user = User.find_by(id: session[:user_id])
    if @user.nil?
      render json: { message: "User not found" }
    else
      @username = @user.username
      @fields = Field.find_by(username: @username, post_id: params[:id])
      if @fields.nil?
        render json: { message: "Post not found" }
      else
        render json: @fields
      end
    end
  end

  private
  def field_params
    params.permit(:username, :post_id, :starred, :upvoted, :downvoted)
  end
end
