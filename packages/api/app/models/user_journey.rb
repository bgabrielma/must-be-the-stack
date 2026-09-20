class UserJourney < ApplicationRecord
  belongs_to :user
  belongs_to :journey

  validates :user_id, uniqueness: { scope: :journey_id }
end
