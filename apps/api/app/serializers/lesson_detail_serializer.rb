# Only used by LessonsController#show, which withholds this serializer (and
# its :content attribute) entirely for a locked Lesson — see the 403 branch.
class LessonDetailSerializer < ActiveModel::Serializer
  attributes :title, :position, :status, :content, :subject_title

  def status
    object.status_for(scope)
  end

  def subject_title
    object.subject.title
  end
end
