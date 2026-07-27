class SubjectsController < ApplicationController
  include Authenticatable

  def show
    subject = Subject.find(subject_id)
    return if render_forbidden_if(subject.status_for(current_user) == :locked, "This Subject is locked")

    render json: subject, scope: current_user, include: "lessons", content_type: "application/json"
  end

  private

  def subject_id
    params.require(:id)
  end
end
