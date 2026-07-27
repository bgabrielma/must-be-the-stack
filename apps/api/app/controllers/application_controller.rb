class ApplicationController < ActionController::API
  include ActionController::Cookies

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActionController::ParameterMissing, with: :render_bad_request

  private

  def render_not_found
    render_errors("Not found", status: :not_found)
  end

  def render_bad_request(exception)
    render_errors(exception.message, status: :bad_request)
  end

  # Renders a 403 and returns true when `condition` holds, so callers can
  # `return if render_forbidden_if(resource.status_for(current_user) == :locked, "...")`.
  # The condition itself is decided by the caller, not baked into this helper.
  def render_forbidden_if(condition, message)
    return false unless condition

    render_errors(message, status: :forbidden)
    true
  end

  # Renders a JSON:API-shaped top-level "errors" member [ADR-0008]. The
  # Content-Type is plain application/json — the frontend/backend contract is
  # the body shape (data/attributes/relationships/included), not strict
  # JSON:API content negotiation.
  def render_errors(messages, status:)
    render json: { errors: Array(messages).map { |message| { detail: message } } },
           content_type: "application/json",
           status: status
  end
end
