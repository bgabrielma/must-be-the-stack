class AddProfileToUsers < ActiveRecord::Migration[8.1]
  # All four columns are nullable: the users who predate Profiles have none,
  # and a NOT NULL constraint would make them retroactively invalid. "Required"
  # is enforced at the point of capture (User's :profile validation context)
  # and by the frontend's route gate — see ADR-0015.
  def up
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :job_role, :string
    add_column :users, :about, :text
  end

  def down
    remove_column :users, :first_name
    remove_column :users, :last_name
    remove_column :users, :job_role
    remove_column :users, :about
  end
end
