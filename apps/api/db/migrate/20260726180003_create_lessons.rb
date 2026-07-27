class CreateLessons < ActiveRecord::Migration[8.1]
  def up
    create_table :lessons do |t|
      t.references :subject, null: false, foreign_key: true
      t.string :title, null: false
      t.integer :position, null: false
      t.text :content, null: false

      t.timestamps
    end
    add_index :lessons, [ :subject_id, :position ], unique: true
  end

  def down
    drop_table :lessons
  end
end
