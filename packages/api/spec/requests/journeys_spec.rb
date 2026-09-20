require "rails_helper"

RSpec.describe "Journeys", type: :request do
  let(:user) { create(:user) }
  let(:headers) { { "Authorization" => "Bearer #{AccessToken.encode(user)}" } }

  describe "GET /journeys" do
    it "requires authentication" do
      get "/journeys"

      expect(response).to have_http_status(:unauthorized)
    end

    it "lists Journeys with per-user status and Subject counts" do
      journey = create(:journey, title: "Software Design")
      subject_with_lessons = create(:subject, journey: journey, position: 1, minimum_passing_score: 8)
      create(:lesson, subject: subject_with_lessons, position: 1)

      get "/journeys", headers: headers

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      attributes = body["data"].first["attributes"]
      expect(attributes["title"]).to eq("Software Design")
      expect(attributes["status"]).to eq("not_started")
      expect(attributes["subjects-count"]).to eq(1)
      expect(attributes["completed-subjects-count"]).to eq(0)
    end

    it "paginates, defaulting to the first page" do
      create_list(:journey, 3)

      get "/journeys", headers: headers, params: { per_page: 2 }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["data"].size).to eq(2)
    end

    it "returns the requested page" do
      journeys = create_list(:journey, 3).sort_by(&:id)

      get "/journeys", headers: headers, params: { per_page: 1, page: 2 }

      expect(response).to have_http_status(:ok)
      ids = JSON.parse(response.body)["data"].map { |resource| resource["id"].to_i }
      expect(ids).to eq([ journeys.second.id ])
    end

    it "caps per_page instead of returning everything" do
      create_list(:journey, JourneysController::MAX_PER_PAGE + 5)

      get "/journeys", headers: headers, params: { per_page: 999999 }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["data"].size).to eq(JourneysController::MAX_PER_PAGE)
    end
  end

  describe "GET /journeys/:id" do
    it "includes each Subject's lock state and lesson counts" do
      journey = create(:journey)
      active_subject = create(:subject, journey: journey, position: 1, minimum_passing_score: 8)
      create(:lesson, subject: active_subject, position: 1)
      locked_subject = create(:subject, journey: journey, position: 2)

      get "/journeys/#{journey.id}", headers: headers

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      included_subjects = body["included"].select { |resource| resource["type"] == "subjects" }
      statuses = included_subjects.to_h { |resource| [ resource["id"], resource["attributes"]["status"] ] }
      expect(statuses[active_subject.id.to_s]).to eq("active")
      expect(statuses[locked_subject.id.to_s]).to eq("locked")
    end

    it "marks a Subject completed once every Lesson is passed" do
      journey = create(:journey)
      completed_subject = create(:subject, journey: journey, position: 1, minimum_passing_score: 8)
      lesson = create(:lesson, subject: completed_subject, position: 1)
      create(:submission, lesson: lesson, user: user, score: 8)

      get "/journeys/#{journey.id}", headers: headers

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      included_subjects = body["included"].select { |resource| resource["type"] == "subjects" }
      statuses = included_subjects.to_h { |resource| [ resource["id"], resource["attributes"]["status"] ] }
      expect(statuses[completed_subject.id.to_s]).to eq("completed")
    end

    it "404s for an unknown Journey" do
      get "/journeys/999999", headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /journeys/:id/start" do
    it "marks the Journey as started for the current user" do
      journey = create(:journey)

      post "/journeys/#{journey.id}/start", headers: headers

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body)["data"]["attributes"]["status"]).to eq("in_progress")
      expect(UserJourney.exists?(user: user, journey: journey)).to be(true)
    end

    it "is idempotent when called twice" do
      journey = create(:journey)

      post "/journeys/#{journey.id}/start", headers: headers
      post "/journeys/#{journey.id}/start", headers: headers

      expect(response).to have_http_status(:created)
      expect(UserJourney.where(user: user, journey: journey).count).to eq(1)
    end
  end
end
