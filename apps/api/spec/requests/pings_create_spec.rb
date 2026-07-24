require "rails_helper"

RSpec.describe "POST /pings", type: :request do
  it "creates a ping and returns a JSON:API-shaped resource" do
    post "/pings", params: { message: "hello" }

    expect(response).to have_http_status(:created)
    expect(response.media_type).to eq("application/vnd.api+json")

    body = JSON.parse(response.body)
    expect(body["data"]["type"]).to eq("pings")
    expect(body["data"]["attributes"]["message"]).to eq("hello")
  end

  it "enqueues a PingNotificationJob for the created ping" do
    expect do
      post "/pings", params: { message: "hello" }
    end.to have_enqueued_job(PingNotificationJob)

    created_id = JSON.parse(response.body)["data"]["id"].to_i
    expect(enqueued_jobs.last["arguments"]).to eq([ created_id ])
  end
end
