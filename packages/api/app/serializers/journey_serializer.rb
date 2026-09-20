class JourneySerializer < ActiveModel::Serializer
  attributes :title, :description, :status, :subjects_count, :completed_subjects_count
  has_many :subjects, serializer: SubjectSerializer

  def status
    object.status_for(scope)
  end

  def subjects_count
    object.subjects.size
  end

  def completed_subjects_count
    object.subjects.count { |subject| subject.completed_for?(scope) }
  end
end
