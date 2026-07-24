class RefreshToken < ApplicationRecord
  TTL = 30.days

  belongs_to :user

  # Issues and persists a new refresh token for the given user, returning the
  # raw token to hand to the client. Only a digest of the token is stored, so
  # the raw value must be captured here — it cannot be recovered later.
  def self.issue(user)
    raw_token = SecureRandom.hex(32)

    user.refresh_tokens.create!(
      token_digest: digest(raw_token),
      expires_at: TTL.from_now
    )

    raw_token
  end

  # Finds the unexpired refresh token record matching a raw token, or nil.
  def self.authenticate(raw_token)
    return nil if raw_token.blank?

    find_by(token_digest: digest(raw_token))&.then { |token| token.expired? ? nil : token }
  end

  def self.digest(raw_token)
    Digest::SHA256.hexdigest(raw_token)
  end

  def expired?
    expires_at.past?
  end
end
