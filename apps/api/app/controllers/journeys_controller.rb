class JourneysController < ApplicationController
  include Authenticatable

  def index
    render json: Journey.all, scope: current_user, content_type: "application/vnd.api+json"
  end

  def show
    render json: Journey.find(params[:id]), scope: current_user, include: "subjects,subjects.lessons",
           content_type: "application/vnd.api+json"
  end

  # POST /journeys/:id/start — marks a Journey as started for the current user.
  def start
    journey = Journey.find(params[:id])
    UserJourney.find_or_create_by!(user: current_user, journey: journey)

    render json: journey, scope: current_user, content_type: "application/vnd.api+json", status: :created
  end
end
