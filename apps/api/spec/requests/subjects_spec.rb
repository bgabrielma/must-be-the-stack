require "rails_helper"

RSpec.describe "Subjects", type: :request do
  let(:user) { create(:user) }
  let(:headers) { { "Authorization" => "Bearer #{AccessToken.encode(user)}" } }

  describe "GET /subjects/:id" do
    it "renders the active Subject's Lessons with lock state" do
      journey = create(:journey)
      subject = create(:subject, journey: journey, position: 1, minimum_passing_score: 8)
      first_lesson = create(:lesson, subject: subject, position: 1)
      second_lesson = create(:lesson, subject: subject, position: 2)

      get "/subjects/#{subject.id}", headers: headers

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      lessons = body["included"].select { |resource| resource["type"] == "lessons" }
      statuses = lessons.to_h { |resource| [ resource["id"], resource["attributes"]["status"] ] }
      expect(statuses[first_lesson.id.to_s]).to eq("active")
      expect(statuses[second_lesson.id.to_s]).to eq("locked")
    end

    it "marks a Lesson completed once a passing Submission exists" do
      subject = create(:subject, minimum_passing_score: 8)
      completed_lesson = create(:lesson, subject: subject, position: 1)
      create(:submission, lesson: completed_lesson, user: user, score: 8)

      get "/subjects/#{subject.id}", headers: headers

      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      lessons = body["included"].select { |resource| resource["type"] == "lessons" }
      statuses = lessons.to_h { |resource| [ resource["id"], resource["attributes"]["status"] ] }
      expect(statuses[completed_lesson.id.to_s]).to eq("completed")
    end

    it "forbids a locked Subject" do
      journey = create(:journey)
      create(:subject, journey: journey, position: 1) # unfinished -> stays active
      locked_subject = create(:subject, journey: journey, position: 2)

      get "/subjects/#{locked_subject.id}", headers: headers

      expect(response).to have_http_status(:forbidden)
    end

    it "requires authentication" do
      subject = create(:subject)

      get "/subjects/#{subject.id}"

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
