class CreateJourneys < ActiveRecord::Migration[8.1]
  def up
    create_table :journeys do |t|
      t.string :title, null: false
      t.text :description

      t.timestamps
    end
  end

  def down
    drop_table :journeys
  end
end
