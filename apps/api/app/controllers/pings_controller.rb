class PingsController < ApplicationController
  def index
    render json: Ping.all, content_type: "application/vnd.api+json"
  end

  def create
    ping = nil

    # PingNotificationJob sets enqueue_after_transaction_commit, so calling
    # perform_later here is safe even though we're inside a transaction: the
    # job is only handed to Solid Queue once this transaction commits.
    ActiveRecord::Base.transaction do
      ping = Ping.create!(message: params[:message])
      PingNotificationJob.perform_later(ping.id)
    end

    render json: ping, content_type: "application/vnd.api+json", status: :created
  end
end
