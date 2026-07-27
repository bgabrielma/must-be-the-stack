class Subject < ApplicationRecord
  belongs_to :journey
  has_many :lessons, -> { order(:position) }, dependent: :destroy

  validates :title, presence: true
  validates :position, presence: true, uniqueness: { scope: :journey_id }
  validates :minimum_passing_score, presence: true,
                                    numericality: { only_integer: true, in: 0..10 }

  def completed_for?(user)
    lessons.any? && lessons.all? { |lesson| lesson.passed_by?(user) }
  end

  # A user works one Subject at a time per Journey: the first not-yet-completed
  # Subject (by position) is :active, earlier ones are :completed, later ones :locked.
  def status_for(user)
    return :completed if completed_for?(user)

    first_incomplete = journey.subjects.detect { |sibling| !sibling.completed_for?(user) }
    self == first_incomplete ? :active : :locked
  end
end
