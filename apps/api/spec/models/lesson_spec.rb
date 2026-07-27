require "rails_helper"

RSpec.describe Lesson, type: :model do
  describe "#status_for" do
    it "is :active for the first Lesson in the active Subject" do
      curriculum_subject = create(:subject, minimum_passing_score: 8)
      first_lesson = create(:lesson, subject: curriculum_subject, position: 1)
      create(:lesson, subject: curriculum_subject, position: 2)
      user = create(:user)

      expect(first_lesson.status_for(user)).to eq(:active)
    end

    it "is :locked for Lessons after the active one" do
      curriculum_subject = create(:subject)
      create(:lesson, subject: curriculum_subject, position: 1)
      second_lesson = create(:lesson, subject: curriculum_subject, position: 2)
      user = create(:user)

      expect(second_lesson.status_for(user)).to eq(:locked)
    end

    it "is :completed once a passing Submission exists, unlocking the next Lesson" do
      curriculum_subject = create(:subject, minimum_passing_score: 8)
      first_lesson = create(:lesson, subject: curriculum_subject, position: 1)
      second_lesson = create(:lesson, subject: curriculum_subject, position: 2)
      user = create(:user)
      create(:submission, lesson: first_lesson, user: user, score: 8)

      expect(first_lesson.status_for(user)).to eq(:completed)
      expect(second_lesson.status_for(user)).to eq(:active)
    end

    it "is :locked even for the first Lesson when the parent Subject itself is locked" do
      journey = create(:journey)
      create(:subject, journey: journey, position: 1) # not completed -> stays active
      locked_subject = create(:subject, journey: journey, position: 2)
      lesson_in_locked_subject = create(:lesson, subject: locked_subject, position: 1)
      user = create(:user)

      expect(lesson_in_locked_subject.status_for(user)).to eq(:locked)
    end
  end

  describe "#passed_by?" do
    it "is false for a Submission scoring below the Subject's minimum passing score" do
      curriculum_subject = create(:subject, minimum_passing_score: 8)
      lesson = create(:lesson, subject: curriculum_subject, position: 1)
      user = create(:user)
      create(:submission, lesson: lesson, user: user, score: 7)

      expect(lesson.passed_by?(user)).to be(false)
    end
  end
end
