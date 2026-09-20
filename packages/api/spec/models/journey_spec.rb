require "rails_helper"

RSpec.describe Journey, type: :model do
  describe "#status_for" do
    it "is :not_started when the user has no UserJourney" do
      journey = create(:journey)
      user = create(:user)

      expect(journey.status_for(user)).to eq(:not_started)
    end

    it "is :in_progress when started but not every Subject is completed" do
      journey = create(:journey)
      create(:subject, journey: journey)
      user = create(:user)
      create(:user_journey, user: user, journey: journey)

      expect(journey.status_for(user)).to eq(:in_progress)
    end

    it "is :completed once every currently-authored Subject is finished" do
      journey = create(:journey)
      first_subject = create(:subject, journey: journey, position: 1, minimum_passing_score: 8)
      lesson = create(:lesson, subject: first_subject, position: 1)
      user = create(:user)
      create(:user_journey, user: user, journey: journey)
      create(:submission, lesson: lesson, user: user, score: 8)

      expect(journey.status_for(user)).to eq(:completed)
    end

    it "reopens to :in_progress if a new Subject is added after completion" do
      journey = create(:journey)
      first_subject = create(:subject, journey: journey, position: 1, minimum_passing_score: 8)
      lesson = create(:lesson, subject: first_subject, position: 1)
      user = create(:user)
      create(:user_journey, user: user, journey: journey)
      create(:submission, lesson: lesson, user: user, score: 8)
      expect(journey.status_for(user)).to eq(:completed)

      create(:subject, journey: journey, position: 2)

      expect(journey.reload.status_for(user)).to eq(:in_progress)
    end
  end
end
