class PingsController < ApplicationController
  def index
    render json: Ping.all, content_type: "application/vnd.api+json"
  end

  def create
    # PingNotificationJob sets enqueue_after_transaction_commit, so calling
    # perform_later here is safe even though we're inside a transaction: the
    # job is only handed to Solid Queue once this transaction commits.
    ping = ActiveRecord::Base.transaction do
      Ping.create!(message: params[:message]).tap do |created|
        PingNotificationJob.perform_later(created.id)
      end
    end

    render json: ping, content_type: "application/vnd.api+json", status: :created
  end
end
