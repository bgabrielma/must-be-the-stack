class ApplicationController < ActionController::API
  include ActionController::Cookies

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

  private

  def render_not_found
    render_errors("Not found", status: :not_found)
  end

  # Renders a JSON:API top-level "errors" member [ADR-0008].
  def render_errors(messages, status:)
    render json: { errors: Array(messages).map { |message| { detail: message } } },
           content_type: "application/vnd.api+json",
           status: status
  end
end
