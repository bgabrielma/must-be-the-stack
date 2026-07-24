require "rails_helper"

RSpec.describe "GET /pings", type: :request do
  it "returns a JSON:API-shaped list of pings" do
    Ping.create!(message: "hello")

    get "/pings"

    expect(response).to have_http_status(:ok)
    expect(response.media_type).to eq("application/vnd.api+json")

    body = JSON.parse(response.body)
    expect(body["data"]).to be_an(Array)
    expect(body["data"].first["type"]).to eq("pings")
    expect(body["data"].first["attributes"]["message"]).to eq("hello")
  end
end
