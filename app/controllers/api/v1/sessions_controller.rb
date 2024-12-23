class Api::V1::SessionsController < ApplicationController
  def create
    user = User.find_by(username: params[:username])
    if user.present? && user.authenticate(params[:password])
      session[:user_id] = user.id
      render json: user
    else
      render json: { message: user }
    end
  end
  def destroy
    session.delete("user_id")
    render json: { message: "Signed out!" }
  end
end
