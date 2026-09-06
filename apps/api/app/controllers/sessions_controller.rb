class SessionsController < ApplicationController
  REFRESH_TOKEN_COOKIE = :refresh_token

  # POST /login
  def create
    user = User.find_by(email: login_params[:email])

    if user&.authenticate(login_params[:password])
      issue_session(user)
    else
      render_errors("Invalid email or password", status: :unauthorized)
    end
  end

  # POST /refresh
  def refresh
    refresh_token = current_refresh_token

    if refresh_token
      refresh_token.destroy!
      issue_session(refresh_token.user)
    else
      render_errors("Invalid or expired refresh token", status: :unauthorized)
    end
  end

  # DELETE /logout
  def destroy
    current_refresh_token&.destroy!
    cookies.delete(REFRESH_TOKEN_COOKIE)

    head :no_content
  end

  private

  def login_params
    params.permit(:email, :password)
  end

  def current_refresh_token
    RefreshToken.authenticate(cookies[REFRESH_TOKEN_COOKIE])
  end

  def issue_session(user)
    raw_refresh_token = RefreshToken.issue(user)

    cookies[REFRESH_TOKEN_COOKIE] = {
      value: raw_refresh_token,
      httponly: true,
      secure: Rails.env.production?,
      same_site: :strict,
      expires: RefreshToken::TTL.from_now
    }

    render json: { access_token: AccessToken.encode(user) }, status: :ok
  end
end
