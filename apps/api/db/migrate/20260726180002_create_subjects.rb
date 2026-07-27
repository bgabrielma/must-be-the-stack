class CreateSubjects < ActiveRecord::Migration[8.1]
  def change
    create_table :subjects do |t|
      t.references :journey, null: false, foreign_key: true
      t.string :title, null: false
      t.integer :position, null: false
      t.integer :minimum_passing_score, null: false, default: 8

      t.timestamps
    end
    add_index :subjects, [ :journey_id, :position ], unique: true
  end
end
