require "rails_helper"

RSpec.describe Submission, type: :model do
  it "is valid with a score between 0 and 10" do
    expect(build(:submission, score: 0)).to be_valid
    expect(build(:submission, score: 10)).to be_valid
  end

  it "is invalid with a score outside 0..10" do
    expect(build(:submission, score: 11)).not_to be_valid
    expect(build(:submission, score: -1)).not_to be_valid
  end
end
