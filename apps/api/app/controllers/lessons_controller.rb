class LessonsController < ApplicationController
  include Authenticatable
  include Lockable

  def show
    lesson = Lesson.find(params[:id])
    return if render_unless_unlocked(lesson)

    render json: lesson, serializer: LessonDetailSerializer, scope: current_user,
           content_type: "application/vnd.api+json"
  end
end
