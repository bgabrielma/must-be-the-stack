# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_07_26_180005) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "journeys", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.string "title", null: false
    t.datetime "updated_at", null: false
  end

  create_table "lessons", force: :cascade do |t|
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.integer "position", null: false
    t.bigint "subject_id", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["subject_id", "position"], name: "index_lessons_on_subject_id_and_position", unique: true
    t.index ["subject_id"], name: "index_lessons_on_subject_id"
  end

  create_table "pings", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "message"
    t.datetime "updated_at", null: false
  end

  create_table "refresh_tokens", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.string "token_digest", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["token_digest"], name: "index_refresh_tokens_on_token_digest", unique: true
    t.index ["user_id"], name: "index_refresh_tokens_on_user_id"
  end

  create_table "subjects", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "journey_id", null: false
    t.integer "minimum_passing_score", default: 8, null: false
    t.integer "position", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["journey_id", "position"], name: "index_subjects_on_journey_id_and_position", unique: true
    t.index ["journey_id"], name: "index_subjects_on_journey_id"
  end

  create_table "submissions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "lesson_id", null: false
    t.integer "score", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["lesson_id"], name: "index_submissions_on_lesson_id"
    t.index ["user_id", "lesson_id"], name: "index_submissions_on_user_id_and_lesson_id"
    t.index ["user_id"], name: "index_submissions_on_user_id"
  end

  create_table "user_journeys", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "journey_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["journey_id"], name: "index_user_journeys_on_journey_id"
    t.index ["user_id", "journey_id"], name: "index_user_journeys_on_user_id_and_journey_id", unique: true
    t.index ["user_id"], name: "index_user_journeys_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "lessons", "subjects"
  add_foreign_key "refresh_tokens", "users"
  add_foreign_key "subjects", "journeys"
  add_foreign_key "submissions", "lessons"
  add_foreign_key "submissions", "users"
  add_foreign_key "user_journeys", "journeys"
  add_foreign_key "user_journeys", "users"
end
