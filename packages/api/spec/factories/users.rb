FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "correct-horse-battery-staple" }
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    job_role { Faker::Job.title }
    about { Faker::Lorem.sentence }

    # A user who predates Profiles, or who abandoned the capture step — the
    # state the route gate exists for.
    trait :without_profile do
      first_name { nil }
      last_name { nil }
      job_role { nil }
      about { nil }
    end
  end
end
