require "rails_helper"

RSpec.describe "POST /signup", type: :request do
  it "creates a user and returns a JSON:API-shaped resource" do
    post "/signup", params: { email: "ada@example.com", password: "correct-horse-battery-staple" }

    expect(response).to have_http_status(:created)
    expect(response.media_type).to eq("application/json")

    body = JSON.parse(response.body)
    expect(body["data"]["type"]).to eq("users")
    expect(body["data"]["attributes"]["email"]).to eq("ada@example.com")
    expect(body["data"]["attributes"]).not_to have_key("password")
    expect(body["data"]["attributes"]).not_to have_key("password_digest")

    expect(User.find_by(email: "ada@example.com")).to be_present
  end

  it "rejects a duplicate email" do
    User.create!(email: "ada@example.com", password: "correct-horse-battery-staple")

    post "/signup", params: { email: "ada@example.com", password: "another-password" }

    expect(response).to have_http_status(:unprocessable_content)
  end
end
