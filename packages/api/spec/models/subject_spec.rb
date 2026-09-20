require "rails_helper"

RSpec.describe Subject, type: :model do
  describe "#status_for" do
    it "is :active for the first Subject in a fresh Journey" do
      journey = create(:journey)
      first_subject = create(:subject, journey: journey, position: 1)
      create(:subject, journey: journey, position: 2)
      user = create(:user)

      expect(first_subject.status_for(user)).to eq(:active)
    end

    it "is :locked for Subjects after the active one" do
      journey = create(:journey)
      create(:subject, journey: journey, position: 1)
      second_subject = create(:subject, journey: journey, position: 2)
      user = create(:user)

      expect(second_subject.status_for(user)).to eq(:locked)
    end

    it "is :completed once every Lesson is passed, unlocking the next Subject" do
      journey = create(:journey)
      first_subject = create(:subject, journey: journey, position: 1, minimum_passing_score: 8)
      lesson = create(:lesson, subject: first_subject, position: 1)
      second_subject = create(:subject, journey: journey, position: 2)
      user = create(:user)
      create(:submission, lesson: lesson, user: user, score: 8)

      expect(first_subject.status_for(user)).to eq(:completed)
      expect(second_subject.status_for(user)).to eq(:active)
    end
  end

  describe "#completed_for?" do
    it "is false when the Subject has no Lessons yet" do
      subject_with_no_lessons = create(:subject)
      user = create(:user)

      expect(subject_with_no_lessons.completed_for?(user)).to be(false)
    end
  end
end
