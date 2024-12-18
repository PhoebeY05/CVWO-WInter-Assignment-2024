class Api::V1::StarsController < ApplicationController
  def index
    @stars = Star.where("username = ?", params[:username]).select(:post_id)
    @posts = Post.where(id: @stars)
    render json: @posts
  end

  def create 
    @star = Star.create!(star_params)
    if @star.save
      render json: @star
    else
      render json: star_params
    end
  end
  def destroy
    Star.where(username: params[:username], post_id: params[:post_id]).destroy_all
    render json: { message: "Unstarred!" }
  end

  private
  def star_params
    params.permit(:username, :post_id)
  end
end
