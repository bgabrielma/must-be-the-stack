class PingSerializer < ActiveModel::Serializer
  attributes :message, :created_at
end
