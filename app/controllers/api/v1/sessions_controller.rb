class Api::V1::SessionsController < ApplicationController
  def create
    session.delete("user_id")
    user = User.find_by(username: params[:username])
    if user.present? && user.authenticate(params[:password])
      session[:user_id] = user.id
      render json: user
    else
      render json: { message: user }
    end
  end

end
