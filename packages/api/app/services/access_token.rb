# Issues and verifies short-lived, stateless JWT access tokens (ADR-0007).
#
# Access tokens are never checked against the database or any
# revocation/blocklist — a valid signature and unexpired `exp` claim is
# sufficient. Revoking a session only removes its RefreshToken; already
# issued access tokens remain valid until they naturally expire.
class AccessToken
  TTL = 15.minutes
  ALGORITHM = "HS256"

  # Returns a signed JWT encoding the user's id, expiring in TTL.
  def self.encode(user)
    payload = { sub: user.id, exp: TTL.from_now.to_i }
    JWT.encode(payload, secret, ALGORITHM)
  end

  # Returns the user id encoded in a valid, unexpired token, or nil if the
  # token is missing, malformed, expired, or has an invalid signature.
  def self.decode(token)
    decoded, = JWT.decode(token, secret, true, algorithm: ALGORITHM)
    decoded["sub"]
  rescue JWT::DecodeError
    nil
  end

  def self.secret
    Rails.application.secret_key_base
  end
end
