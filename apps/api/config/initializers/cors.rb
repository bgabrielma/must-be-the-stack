# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.
#
# This is a separate concern from per-controller authentication (the
# `Authenticatable` concern's `before_action`): CORS is a browser-enforced
# policy answering "which origins/methods may even attempt a request," and
# runs before any Rails routing or controller code sees the request.
# Authentication answers "is this specific request allowed to read/write
# this resource" and is deliberately opt-in per controller (SessionsController
# and SignupsController skip it — they're the public entry points). Neither
# replaces the other.
#
# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("FRONTEND_ORIGIN", "http://localhost:5173")

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      credentials: true
  end
end
