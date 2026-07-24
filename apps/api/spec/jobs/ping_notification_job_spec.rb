require "rails_helper"

RSpec.describe PingNotificationJob, type: :job do
  include ActiveJob::TestHelper

  let(:ping) { Ping.create!(message: "hello") }

  before do
    allow(ENV).to receive(:[]).and_call_original
    allow(ENV).to receive(:[]).with("PING_NOTIFICATION_URL").and_return("http://notifications.example.com/pings")
  end

  it "posts the ping's notification payload to the configured endpoint" do
    allow(Net::HTTP).to receive(:post) do |uri, body, headers|
      expect(uri.to_s).to eq("http://notifications.example.com/pings")
      expect(JSON.parse(body, symbolize_names: true)).to eq(ping_id: ping.id, message: ping.message)
      expect(headers).to eq("Content-Type" => "application/json")
    end

    described_class.perform_now(ping.id)

    expect(Net::HTTP).to have_received(:post)
  end

  it "is a no-op when no notification endpoint is configured" do
    allow(ENV).to receive(:[]).with("PING_NOTIFICATION_URL").and_return(nil)
    allow(Net::HTTP).to receive(:post)

    described_class.perform_now(ping.id)

    expect(Net::HTTP).not_to have_received(:post)
  end

  it "retries instead of failing permanently when delivery times out transiently" do
    call_count = 0
    allow(Net::HTTP).to receive(:post) do
      call_count += 1
      raise Net::ReadTimeout if call_count == 1
    end

    perform_enqueued_jobs(only: PingNotificationJob) do
      described_class.perform_later(ping.id)
    end

    expect(call_count).to eq(2)
  end

  it "retries instead of failing permanently when the connection is refused" do
    call_count = 0
    allow(Net::HTTP).to receive(:post) do
      call_count += 1
      raise Errno::ECONNREFUSED if call_count == 1
    end

    perform_enqueued_jobs(only: PingNotificationJob) do
      described_class.perform_later(ping.id)
    end

    expect(call_count).to eq(2)
  end

  it "gives up after its configured retry attempts are exhausted" do
    allow(Net::HTTP).to receive(:post).and_raise(Net::ReadTimeout, "timed out")

    expect do
      perform_enqueued_jobs(only: PingNotificationJob) do
        described_class.perform_later(ping.id)
      end
    end.to raise_error(/timed out/)
  end
end
