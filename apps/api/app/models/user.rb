class User < ApplicationRecord
  has_secure_password

  has_many :refresh_tokens, dependent: :destroy
  has_many :user_journeys, dependent: :destroy
  has_many :journeys, through: :user_journeys
  has_many :submissions, dependent: :destroy

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :email, presence: true, uniqueness: true
end
