FactoryBot.define do
  factory :ping do
    message { Faker::Lorem.sentence }
  end
end
