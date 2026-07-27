FactoryBot.define do
  factory :submission do
    lesson
    user
    score { 8 }
  end
end
