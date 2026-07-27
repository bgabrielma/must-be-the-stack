class JourneysController < ApplicationController
  include Authenticatable

  DEFAULT_PER_PAGE = 25
  MAX_PER_PAGE = 100

  def index
    journeys = Journey.limit(per_page).offset((page - 1) * per_page)

    render json: journeys, scope: current_user, content_type: "application/json"
  end

  def show
    render json: Journey.find(journey_id), scope: current_user, include: "subjects,subjects.lessons",
           content_type: "application/json"
  end

  def start
    journey = Journey.find(journey_id)
    UserJourney.find_or_create_by!(user: current_user, journey: journey)

    render json: journey, scope: current_user, content_type: "application/json", status: :created
  end

  private

  def journey_id
    params.require(:id)
  end

  def page
    [ pagination_params[:page].to_i, 1 ].max
  end

  def per_page
    requested = pagination_params[:per_page].to_i
    return DEFAULT_PER_PAGE if requested <= 0

    [ requested, MAX_PER_PAGE ].min
  end

  def pagination_params
    params.permit(:page, :per_page)
  end
end
