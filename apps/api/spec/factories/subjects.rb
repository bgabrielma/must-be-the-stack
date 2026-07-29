FactoryBot.define do
  factory :subject do
    journey
    sequence(:title) { |n| "Subject #{n}" }
    sequence(:position) { |n| n }
    minimum_passing_score { 8 }
  end
end
