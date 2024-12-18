class Api::V1::UsersController < ApplicationController
  before_action :set_user, only: %i[ update destroy]

  def index
    @user = User.find_by(username: params[:username])
    if @user && @user.authenticate(params[:password])
      render json: @user
    else
      render json: { message: "Invalid username or password" }
    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      render json: @user
    else
      render json: { message: "Username already exists!" }
    end
  end


  def show
    @user = User.find(session[:user_id])
    render json: @user
  end

  def update
    @user.update(user_params)
    render json: @user
  end

  def destroy
    @user.destroy!
    render json: { message: "User deleted!" }
  end

  private
  def set_user
    @user = User.find(params[:username])
  end

  def user_params
    params.permit(:username, :password)
  end
end
