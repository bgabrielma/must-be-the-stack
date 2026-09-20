require "rails_helper"

RSpec.describe AccessToken do
  let(:user) { User.create!(email: "ada@example.com", password: "correct-horse-battery-staple") }

  describe ".encode" do
    it "returns a JWT string encoding the user's id" do
      token = AccessToken.encode(user)

      decoded = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: "HS256")
      expect(decoded.first["sub"]).to eq(user.id)
    end

    it "sets an expiry in the near future" do
      freeze_time = Time.zone.parse("2026-07-24 12:00:00")

      travel_to(freeze_time) do
        token = AccessToken.encode(user)
        decoded = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: "HS256")

        expect(Time.zone.at(decoded.first["exp"])).to eq(freeze_time + AccessToken::TTL)
      end
    end
  end

  describe ".decode" do
    it "returns the user id for a valid token" do
      token = AccessToken.encode(user)

      expect(AccessToken.decode(token)).to eq(user.id)
    end

    it "returns nil for a garbage token" do
      expect(AccessToken.decode("not-a-jwt")).to be_nil
    end

    it "returns nil for an expired token" do
      token = travel_to(31.minutes.ago) { AccessToken.encode(user) }

      expect(AccessToken.decode(token)).to be_nil
    end

    it "returns nil for a token signed with a different secret" do
      bogus_payload = { sub: user.id, exp: 1.hour.from_now.to_i }
      bogus_token = JWT.encode(bogus_payload, "wrong-secret", "HS256")

      expect(AccessToken.decode(bogus_token)).to be_nil
    end
  end
end
