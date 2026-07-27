class SubjectsController < ApplicationController
  include Authenticatable
  include Lockable

  def show
    subject = Subject.find(params[:id])
    return if render_unless_unlocked(subject)

    render json: subject, scope: current_user, include: "lessons", content_type: "application/vnd.api+json"
  end
end
