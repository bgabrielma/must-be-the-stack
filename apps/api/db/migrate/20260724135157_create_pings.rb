class CreatePings < ActiveRecord::Migration[8.1]
  def change
    create_table :pings do |t|
      t.string :message

      t.timestamps
    end
  end
end
