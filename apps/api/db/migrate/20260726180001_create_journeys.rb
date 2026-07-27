class CreateJourneys < ActiveRecord::Migration[8.1]
  def change
    create_table :journeys do |t|
      t.string :title, null: false
      t.text :description

      t.timestamps
    end
  end
end
