require "rails_helper"

RSpec.describe "Users", type: :request do
  let(:user) { create(:user) }
  let(:headers) { { "Authorization" => "Bearer #{AccessToken.encode(user)}" } }

  describe "GET /user" do
    it "requires authentication" do
      get "/user"

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns the signed-in user's email and Profile fields" do
      user.update!(
        first_name: "Ada",
        last_name: "Lovelace",
        job_role: "Backend Engineer",
        about: "Learning system design one concept at a time."
      )

      get "/user", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.media_type).to eq("application/json")

      attributes = JSON.parse(response.body)["data"]["attributes"]
      expect(attributes["email"]).to eq(user.email)
      expect(attributes["first-name"]).to eq("Ada")
      expect(attributes["last-name"]).to eq("Lovelace")
      expect(attributes["job-role"]).to eq("Backend Engineer")
      expect(attributes["about"]).to eq("Learning system design one concept at a time.")
      expect(attributes["profile-complete"]).to be(true)
    end

    it "reports an incomplete Profile for a user who predates Profiles" do
      user = create(:user, :without_profile)

      get "/user", headers: { "Authorization" => "Bearer #{AccessToken.encode(user)}" }

      attributes = JSON.parse(response.body)["data"]["attributes"]
      expect(attributes["first-name"]).to be_nil
      expect(attributes["profile-complete"]).to be(false)
    end

    it "never exposes the password digest" do
      get "/user", headers: headers

      attributes = JSON.parse(response.body)["data"]["attributes"]
      expect(attributes).not_to have_key("password")
      expect(attributes).not_to have_key("password-digest")
    end
  end

  describe "POST /user" do
    let(:user) { create(:user, :without_profile) }

    it "requires authentication" do
      post "/user", params: { first_name: "Ada", last_name: "Lovelace", job_role: "Backend Engineer" }

      expect(response).to have_http_status(:unauthorized)
    end

    it "persists the Profile fields" do
      post "/user", headers: headers, params: {
        first_name: "Ada",
        last_name: "Lovelace",
        job_role: "Backend Engineer",
        about: "Learning system design one concept at a time."
      }

      expect(response).to have_http_status(:ok)

      attributes = JSON.parse(response.body)["data"]["attributes"]
      expect(attributes["first-name"]).to eq("Ada")
      expect(attributes["profile-complete"]).to be(true)

      expect(user.reload).to have_attributes(
        first_name: "Ada",
        last_name: "Lovelace",
        job_role: "Backend Engineer",
        about: "Learning system design one concept at a time."
      )
    end

    it "accepts a blank about line" do
      post "/user", headers: headers, params: {
        first_name: "Ada",
        last_name: "Lovelace",
        job_role: "Backend Engineer",
        about: ""
      }

      expect(response).to have_http_status(:ok)
      expect(user.reload.about).to eq("")
      expect(user).to be_profile_complete
    end

    it "rejects a missing required field with a validation error" do
      post "/user", headers: headers, params: {
        first_name: "Ada",
        last_name: "",
        job_role: "Backend Engineer"
      }

      expect(response).to have_http_status(:unprocessable_content)

      body = JSON.parse(response.body)
      expect(body["errors"]).to include(
        a_hash_including("detail" => a_string_matching(/last name can't be blank/i))
      )

      expect(user.reload.first_name).to be_nil
    end

    it "ignores email and password, which are not editable here" do
      original_email = user.email

      post "/user", headers: headers, params: {
        first_name: "Ada",
        last_name: "Lovelace",
        job_role: "Backend Engineer",
        email: "someone-else@example.com",
        password: "a-brand-new-password"
      }

      expect(response).to have_http_status(:ok)
      expect(user.reload.email).to eq(original_email)
      expect(user.authenticate("a-brand-new-password")).to be_falsey
    end
  end
end
