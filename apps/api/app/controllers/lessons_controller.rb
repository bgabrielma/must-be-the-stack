class LessonsController < ApplicationController
  include Authenticatable

  def show
    lesson = Lesson.find(lesson_id)
    return if render_forbidden_if(lesson.status_for(current_user) == :locked, "This Lesson is locked")

    render json: lesson, serializer: LessonDetailSerializer, scope: current_user,
           content_type: "application/json"
  end

  private

  def lesson_id
    params.require(:id)
  end
end
