class SubjectSerializer < ActiveModel::Serializer
  attributes :title, :position, :minimum_passing_score, :status, :lessons_count, :completed_lessons_count,
             :journey_title
  has_many :lessons, serializer: LessonSerializer

  def status
    object.status_for(scope)
  end

  def journey_title
    object.journey.title
  end

  def lessons_count
    object.lessons.size
  end

  def completed_lessons_count
    object.lessons.count { |lesson| lesson.passed_by?(scope) }
  end
end
