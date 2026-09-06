# The nested/list-context serializer, used wherever a Lesson appears via
# `include:` on another resource (e.g. SubjectSerializer's `has_many
# :lessons`). LessonsController#show uses LessonDetailSerializer instead —
# a separate class, not this one with extra fields — so a locked Lesson's
# :content can be withheld by omitting the serializer entirely (see
# LessonDetailSerializer's own comment) rather than conditionally hiding
# one attribute within a shared serializer.
class LessonSerializer < ActiveModel::Serializer
  attributes :title, :position, :status, :score

  def status
    object.status_for(scope)
  end

  # nil for anything not completed yet; see Lesson#passing_submission_for for
  # which Submission is shown when there are several passing attempts.
  def score
    object.passing_submission_for(scope)&.score
  end
end
