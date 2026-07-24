class User < ApplicationRecord
  has_secure_password

  has_many :refresh_tokens, dependent: :destroy

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :email, presence: true, uniqueness: true
end
