require "rails_helper"

RSpec.describe PingNotificationJob, type: :job do
  include ActiveJob::TestHelper

  let(:ping) { Ping.create!(message: "hello") }

  it "delivers a notification for the given ping" do
    delivered = nil
    allow_any_instance_of(PingNotificationJob).to receive(:deliver) { |_job, payload| delivered = payload }

    described_class.perform_now(ping.id)

    expect(delivered).to eq(ping_id: ping.id, message: ping.message)
  end

  it "retries instead of failing permanently when delivery times out transiently" do
    call_count = 0
    allow_any_instance_of(PingNotificationJob).to receive(:deliver) do
      call_count += 1
      raise Timeout::Error, "timed out" if call_count == 1
    end

    perform_enqueued_jobs(only: PingNotificationJob) do
      described_class.perform_later(ping.id)
    end

    expect(call_count).to eq(2)
  end

  it "gives up after its configured retry attempts are exhausted" do
    allow_any_instance_of(PingNotificationJob).to receive(:deliver).and_raise(Timeout::Error, "timed out")

    expect do
      perform_enqueued_jobs(only: PingNotificationJob) do
        described_class.perform_later(ping.id)
      end
    end.to raise_error(/timed out/)
  end
end
