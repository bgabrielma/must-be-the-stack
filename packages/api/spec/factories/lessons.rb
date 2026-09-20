FactoryBot.define do
  factory :lesson do
    subject
    sequence(:title) { |n| "Lesson #{n}" }
    sequence(:position) { |n| n }
    content { Faker::Lorem.paragraph }
  end
end
