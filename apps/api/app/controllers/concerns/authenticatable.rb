module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request!
  end

  private

  def authenticate_request!
    @current_user = user_from_access_token

    render_errors("Invalid or expired access token", status: :unauthorized) unless @current_user
  end

  def user_from_access_token
    token = request.headers["Authorization"]&.delete_prefix("Bearer ")
    return nil if token.blank?

    user_id = AccessToken.decode(token)
    user_id && User.find_by(id: user_id)
  end

  def current_user
    @current_user
  end
end
