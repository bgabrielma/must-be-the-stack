class CreateUserJourneys < ActiveRecord::Migration[8.1]
  def change
    create_table :user_journeys do |t|
      t.references :user, null: false, foreign_key: true
      t.references :journey, null: false, foreign_key: true

      t.timestamps
    end
    add_index :user_journeys, [ :user_id, :journey_id ], unique: true
  end
end
