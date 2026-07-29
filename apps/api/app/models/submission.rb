class Submission < ApplicationRecord
  belongs_to :lesson
  belongs_to :user

  validates :score, presence: true, numericality: { only_integer: true, in: 0..10 }
end
