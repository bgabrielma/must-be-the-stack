require "net/http"

# Delivers a notification about a newly created Ping to an external endpoint.
#
# Demonstrates the async job pattern later grading/notification jobs (Quiz,
# Project, webhook) will extend: explicit retry_on (Solid Queue does not
# retry automatically) and enqueue_after_transaction_commit when triggered
# from inside a DB transaction (see docs/adr/0005-solid-queue-for-background-jobs.md).
class PingNotificationJob < ApplicationJob
  queue_as :default

  # Enqueued from PingsController#create inside a DB transaction; deferring
  # enqueue until commit avoids Solid Queue picking up the job before the
  # Ping row is actually visible to other connections.
  self.enqueue_after_transaction_commit = true

  # Net::HTTP.post can raise on a slow/unresponsive endpoint
  # (Net::OpenTimeout/Net::ReadTimeout, both Timeout::Error), a refused
  # connection (Errno::ECONNREFUSED), or a DNS failure (SocketError) — all
  # transient. Solid Queue does not retry jobs automatically, so this has to
  # be explicit.
  retry_on Timeout::Error, Errno::ECONNREFUSED, SocketError, wait: :polynomially_longer, attempts: 5

  def perform(ping_id)
    ping = Ping.find(ping_id)

    deliver(ping_id: ping.id, message: ping.message)
  end

  private

  # Posts the notification payload to the configured endpoint. Delivery is a
  # no-op when no endpoint is configured (e.g. development/test), so the job
  # still exercises the real code path without requiring an external service.
  def deliver(payload)
    url = ENV["PING_NOTIFICATION_URL"]
    return unless url

    uri = URI.parse(url)
    Net::HTTP.post(uri, payload.to_json, "Content-Type" => "application/json")
  end
end
