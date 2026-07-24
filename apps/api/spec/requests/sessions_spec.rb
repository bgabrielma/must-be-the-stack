require "rails_helper"

RSpec.describe "Sessions", type: :request do
  let!(:user) { User.create!(email: "ada@example.com", password: "correct-horse-battery-staple") }

  describe "POST /login" do
    it "issues an access token in the body and a refresh token cookie" do
      post "/login", params: { email: "ada@example.com", password: "correct-horse-battery-staple" }

      expect(response).to have_http_status(:ok)

      body = JSON.parse(response.body)
      expect(body["access_token"]).to be_present
      expect(AccessToken.decode(body["access_token"])).to eq(user.id)

      expect(response.cookies["refresh_token"]).to be_present
      expect(user.refresh_tokens.count).to eq(1)
    end

    it "sets the refresh token cookie as httpOnly" do
      post "/login", params: { email: "ada@example.com", password: "correct-horse-battery-staple" }

      set_cookie_header = response.headers["Set-Cookie"]
      expect(set_cookie_header).to match(/refresh_token=.*HttpOnly/i)
    end

    it "rejects invalid credentials" do
      post "/login", params: { email: "ada@example.com", password: "wrong-password" }

      expect(response).to have_http_status(:unauthorized)
      expect(response.cookies["refresh_token"]).to be_nil
    end
  end

  describe "POST /refresh" do
    it "mints a new access token and rotates the refresh token cookie" do
      post "/login", params: { email: "ada@example.com", password: "correct-horse-battery-staple" }
      original_refresh_cookie = response.cookies["refresh_token"]
      original_access_token = JSON.parse(response.body)["access_token"]

      post "/refresh"

      expect(response).to have_http_status(:ok)
      new_access_token = JSON.parse(response.body)["access_token"]
      expect(new_access_token).to be_present
      expect(AccessToken.decode(new_access_token)).to eq(user.id)

      new_refresh_cookie = response.cookies["refresh_token"]
      expect(new_refresh_cookie).to be_present
      expect(new_refresh_cookie).not_to eq(original_refresh_cookie)

      # old refresh token is invalidated (rotated) — it can no longer refresh
      cookies["refresh_token"] = original_refresh_cookie
      post "/refresh"
      expect(response).to have_http_status(:unauthorized)

      # user still has exactly one live refresh token (the rotated one)
      expect(user.refresh_tokens.count).to eq(1)
      _ = original_access_token
    end

    it "rejects a refresh with no cookie" do
      post "/refresh"

      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects a refresh with an unknown token" do
      cookies["refresh_token"] = "bogus-token"

      post "/refresh"

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /logout" do
    it "deletes only the current session's refresh token, leaving other sessions valid" do
      post "/login", params: { email: "ada@example.com", password: "correct-horse-battery-staple" }
      device_a_cookie = response.cookies["refresh_token"]

      # simulate a second device/session for the same user
      device_b_raw_token = RefreshToken.issue(user)
      expect(user.refresh_tokens.count).to eq(2)

      cookies["refresh_token"] = device_a_cookie
      delete "/logout"

      expect(response).to have_http_status(:no_content)
      expect(user.refresh_tokens.count).to eq(1)
      expect(RefreshToken.authenticate(device_b_raw_token)).to be_present

      # the logged-out device's refresh token can no longer mint access tokens
      cookies["refresh_token"] = device_a_cookie
      post "/refresh"
      expect(response).to have_http_status(:unauthorized)
    end

    it "clears the refresh token cookie" do
      post "/login", params: { email: "ada@example.com", password: "correct-horse-battery-staple" }

      delete "/logout"

      expect(response.cookies["refresh_token"]).to be_nil
    end
  end

  it "supports the full signup -> login -> refresh -> logout cycle over real HTTP" do
    post "/signup", params: { email: "grace@example.com", password: "another-strong-password" }
    expect(response).to have_http_status(:created)

    post "/login", params: { email: "grace@example.com", password: "another-strong-password" }
    expect(response).to have_http_status(:ok)
    access_token = JSON.parse(response.body)["access_token"]
    expect(AccessToken.decode(access_token)).to be_present

    post "/refresh"
    expect(response).to have_http_status(:ok)
    refreshed_access_token = JSON.parse(response.body)["access_token"]
    expect(AccessToken.decode(refreshed_access_token)).to be_present

    delete "/logout"
    expect(response).to have_http_status(:no_content)

    post "/refresh"
    expect(response).to have_http_status(:unauthorized)
  end
end
