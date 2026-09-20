class UsersController < ApplicationController
  include Authenticatable

  # GET /user — the signed-in user. Singular on purpose: it takes no id, so
  # one user's Profile is never reachable through another's access token.
  def show
    render json: current_user, content_type: "application/json", status: :ok
  end

  # POST /user — updates the Profile fields only. Email and password are not
  # editable here; both carry their own security questions (see #25's scope).
  def update
    current_user.assign_attributes(profile_params)

    if current_user.save(context: :profile)
      render json: current_user, content_type: "application/json", status: :ok
    else
      render_errors(current_user.errors.full_messages, status: :unprocessable_content)
    end
  end

  private

  def profile_params
    params.permit(:first_name, :last_name, :job_role, :about)
  end
end
