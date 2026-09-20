class User < ApplicationRecord
  # The fields a Profile is judged complete by. `about` is deliberately absent:
  # it is optional, so it can never gate anything (CONTEXT.md, "Profile").
  PROFILE_FIELDS = %i[first_name last_name job_role].freeze

  has_secure_password

  has_many :refresh_tokens, dependent: :destroy
  has_many :user_journeys, dependent: :destroy
  has_many :journeys, through: :user_journeys
  has_many :submissions, dependent: :destroy

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :email, presence: true, uniqueness: true

  # Only enforced in the :profile context (UsersController#update). Signing up
  # and every other save leave a User without a Profile perfectly valid — the
  # 14 users who predate Profiles must not become unsaveable.
  validates(*PROFILE_FIELDS, presence: true, on: :profile)

  # Reusable at the collection level too, e.g. User.with_complete_profile for
  # a future "everyone who finished the capture step" query, not just this
  # single-record check.
  scope :with_complete_profile, -> {
    PROFILE_FIELDS.reduce(all) { |relation, field| relation.where.not(field => [ nil, "" ]) }
  }

  def profile_complete?
    self.class.with_complete_profile.exists?(id: id)
  end
end
