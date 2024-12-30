class Api::V1::UsersController < ApplicationController

  # GET /api/v1/users/index
  def index
    @user = User.find_by(username: params[:username])
    if @user && @user.authenticate(params[:password])
      render json: @user
    else
      render json: { message: "Invalid username or password" }
    end
  end

  # POST /api/v1/users/create
  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      render json: @user
    else
      render json: { message: "Username already exists!" }
    end
  end

  # GET /api/v1/users/show
  def show
    @user = User.find_by(id: session[:user_id])
    if @user.nil?
      render json: { message: "User not found" }
    else
      render json: @user
    end
  end

  # DELETE /api/v1/users/destroy
  def destroy
    @user = User.find(session[:user_id])
    @user.destroy!
    render json: { message: "User deleted!" }
  end

  private
  def user_params
    params.permit(:username, :password)
  end
end
