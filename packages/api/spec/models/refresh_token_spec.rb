require "rails_helper"

RSpec.describe RefreshToken, type: :model do
  let(:user) { User.create!(email: "ada@example.com", password: "correct-horse-battery-staple") }

  describe ".issue" do
    it "creates a persisted token for the user and returns the raw token" do
      raw_token = RefreshToken.issue(user)

      expect(raw_token).to be_a(String)
      expect(user.refresh_tokens.count).to eq(1)
    end

    it "does not persist the raw token in the database" do
      raw_token = RefreshToken.issue(user)

      expect(RefreshToken.last.token_digest).not_to eq(raw_token)
    end
  end

  describe ".authenticate" do
    it "finds the refresh token record matching a raw token" do
      raw_token = RefreshToken.issue(user)

      found = RefreshToken.authenticate(raw_token)

      expect(found).to eq(RefreshToken.last)
    end

    it "returns nil for an unknown raw token" do
      expect(RefreshToken.authenticate("not-a-real-token")).to be_nil
    end

    it "returns nil for an expired token" do
      raw_token = RefreshToken.issue(user)
      RefreshToken.last.update!(expires_at: 1.day.ago)

      expect(RefreshToken.authenticate(raw_token)).to be_nil
    end
  end
end
