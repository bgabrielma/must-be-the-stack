class Journey < ApplicationRecord
  has_many :subjects, -> { order(:position) }, dependent: :destroy
  has_many :user_journeys, dependent: :destroy

  validates :title, presence: true

  def started_by?(user)
    user_journeys.exists?(user: user)
  end

  # A Journey completes once every currently-authored Subject is finished,
  # and reopens automatically if a new Subject is later added (CONTEXT.md).
  def completed_for?(user)
    return false if subjects.none?

    subjects.all? { |subject| subject.completed_for?(user) }
  end

  # :not_started, :in_progress, or :completed, for the Home screen.
  def status_for(user)
    return :not_started unless started_by?(user)

    completed_for?(user) ? :completed : :in_progress
  end
end
