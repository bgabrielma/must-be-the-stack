class CreateSubmissions < ActiveRecord::Migration[8.1]
  def change
    create_table :submissions do |t|
      t.references :lesson, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :score, null: false

      t.timestamps
    end
    add_index :submissions, [ :user_id, :lesson_id ]
  end
end
