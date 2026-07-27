class SignupsController < ApplicationController
  def create
    user = User.new(user_params)

    if user.save
      render json: user, content_type: "application/json", status: :created
    else
      render_errors(user.errors.full_messages, status: :unprocessable_content)
    end
  end

  private

  def user_params
    params.permit(:email, :password)
  end
end
