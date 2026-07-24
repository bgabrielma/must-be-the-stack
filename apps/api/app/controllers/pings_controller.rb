class PingsController < ApplicationController
  def index
    render json: Ping.all, content_type: "application/vnd.api+json"
  end
end
