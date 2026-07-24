require "rails_helper"

RSpec.describe Ping, type: :model do
  it "is valid with a message" do
    ping = build(:ping)

    expect(ping).to be_valid
  end
end
