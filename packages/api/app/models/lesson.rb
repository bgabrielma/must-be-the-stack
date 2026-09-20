class Lesson < ApplicationRecord
  belongs_to :subject
  has_many :submissions, dependent: :destroy

  validates :title, presence: true
  validates :content, presence: true
  validates :position, presence: true, uniqueness: { scope: :subject_id }

  # Reusable at the collection level too, e.g. Lesson.passed_by(user) for a
  # future "lessons a user has passed" query, not just this single-record check.
  scope :passed_by, ->(user) {
    joins(:submissions, :subject)
      .where(submissions: { user_id: user.id })
      .where("submissions.score >= subjects.minimum_passing_score")
  }

  def passed_by?(user)
    self.class.passed_by(user).exists?(id: id)
  end

  # Most recent passing Submission, filtered in Ruby off the loaded
  # `submissions` association rather than `Lesson.passed_by`'s SQL scope, so
  # preloading `lessons: :submissions` avoids a query per Lesson.
  def passing_submission_for(user)
    submissions
      .select { |submission| submission.user_id == user.id && submission.score >= subject.minimum_passing_score }
      .max_by(&:created_at)
  end

  # :locked, :active, or :completed. Locked whenever the parent Subject isn't
  # active yet; otherwise the first not-yet-passed Lesson (by position) is
  # :active, earlier ones :completed, later ones :locked.
  def status_for(user)
    return :locked if subject.status_for(user) == :locked
    return :completed if passed_by?(user)

    first_incomplete = subject.lessons.detect { |sibling| !sibling.passed_by?(user) }
    self == first_incomplete ? :active : :locked
  end
end
