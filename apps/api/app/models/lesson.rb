class Lesson < ApplicationRecord
  belongs_to :subject
  has_many :submissions, dependent: :destroy

  validates :title, presence: true
  validates :content, presence: true
  validates :position, presence: true, uniqueness: { scope: :subject_id }

  def passed_by?(user)
    submissions.where(user: user).where("score >= ?", subject.minimum_passing_score).exists?
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
