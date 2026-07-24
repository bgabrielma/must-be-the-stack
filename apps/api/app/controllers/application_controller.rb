class ApplicationController < ActionController::API
  include ActionController::Cookies

  private

  # Renders a JSON:API top-level "errors" member [ADR-0008].
  def render_errors(messages, status:)
    render json: { errors: Array(messages).map { |message| { detail: message } } },
           content_type: "application/vnd.api+json",
           status: status
  end
end
