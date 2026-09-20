require "rails_helper"

RSpec.describe "Lessons", type: :request do
  let(:user) { create(:user) }
  let(:headers) { { "Authorization" => "Bearer #{AccessToken.encode(user)}" } }

  describe "GET /lessons/:id" do
    it "renders an unlocked Lesson's content" do
      subject = create(:subject, minimum_passing_score: 8)
      lesson = create(:lesson, subject: subject, position: 1, content: "Replication keeps copies of your data.")

      get "/lessons/#{lesson.id}", headers: headers

      expect(response).to have_http_status(:ok)
      attributes = JSON.parse(response.body)["data"]["attributes"]
      expect(attributes["status"]).to eq("active")
      expect(attributes["content"]).to eq("Replication keeps copies of your data.")
    end

    it "forbids a locked Lesson and withholds its content" do
      subject = create(:subject, minimum_passing_score: 8)
      create(:lesson, subject: subject, position: 1)
      locked_lesson = create(:lesson, subject: subject, position: 2, content: "secret content")

      get "/lessons/#{locked_lesson.id}", headers: headers

      expect(response).to have_http_status(:forbidden)
      expect(response.body).not_to include("secret content")
    end

    it "renders a completed Lesson's content for review" do
      subject = create(:subject, minimum_passing_score: 8)
      lesson = create(:lesson, subject: subject, position: 1)
      create(:submission, lesson: lesson, user: user, score: 8)

      get "/lessons/#{lesson.id}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["data"]["attributes"]["status"]).to eq("completed")
    end

    it "requires authentication" do
      lesson = create(:lesson)

      get "/lessons/#{lesson.id}"

      expect(response).to have_http_status(:unauthorized)
    end

    it "404s for an unknown Lesson" do
      get "/lessons/999999", headers: headers

      expect(response).to have_http_status(:not_found)
    end
  end
end
