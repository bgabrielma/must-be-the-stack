FactoryBot.define do
  factory :journey do
    sequence(:title) { |n| "Journey #{n}" }
    description { Faker::Lorem.sentence }
  end
end
