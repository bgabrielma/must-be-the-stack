class UserSerializer < ActiveModel::Serializer
  attributes :email, :created_at, :first_name, :last_name, :job_role, :about, :profile_complete

  def profile_complete
    object.profile_complete?
  end
end
