class LessonSerializer < ActiveModel::Serializer
  attributes :title, :position, :status

  def status
    object.status_for(scope)
  end
end
