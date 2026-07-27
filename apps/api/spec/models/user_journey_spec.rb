require "rails_helper"

RSpec.describe UserJourney, type: :model do
  it "is invalid when the user already started the same Journey" do
    journey = create(:journey)
    user = create(:user)
    create(:user_journey, user: user, journey: journey)

    duplicate = build(:user_journey, user: user, journey: journey)

    expect(duplicate).not_to be_valid
  end
end
