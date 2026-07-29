# Static curriculum content, committed by the developer per the Discovery
# phase workflow (ADR-0001) — not generated at runtime. Safe to run repeatedly.
# Shared by curriculum:seed (development) and curriculum:seed_e2e (test) so
# both seed identical content — the Playwright specs assert against these
# exact titles. Scoped in a module rather than left at the top level of this
# file, so its constant/method don't leak onto every Rake task's global scope.
module CurriculumSeeder
  CURRICULUM = [
    {
      title: "Caching Fundamentals",
      lessons: [
        { title: "Why Cache?", content: "Caching trades memory for latency: keeping a copy of expensive-to-compute or expensive-to-fetch data close at hand so repeat requests skip the slow path entirely." },
        { title: "Cache Invalidation Strategies", content: "The hard part of caching isn't storing data — it's knowing when a cached value is stale. TTLs, write-through, and event-based invalidation each trade freshness for complexity differently." }
      ]
    },
    {
      title: "Databases",
      lessons: [
        { title: "What a Database Does", content: "A database's job is durable, concurrent, queryable storage — guarantees a plain file on disk doesn't give you for free." },
        { title: "Indexing & Query Plans", content: "An index trades write speed and storage for read speed, letting the query planner skip a full table scan for a targeted lookup." },
        { title: "Replication & Failover", content: "Replication keeps copies of your data on multiple nodes so a single machine failing doesn't take your database down. Leader-follower: writes go to a leader, which streams changes to followers." },
        { title: "Sharding Strategies", content: "Sharding splits a dataset across multiple database instances by some key (e.g. user id) so no single node has to hold or serve all the data." }
      ]
    },
    {
      title: "Distributed Systems",
      lessons: [
        { title: "CAP Theorem", content: "Under a network partition, a distributed system must choose between consistency and availability — it cannot guarantee both." },
        { title: "Consensus Algorithms", content: "Consensus algorithms like Raft and Paxos let a cluster of nodes agree on a single value even when some nodes fail or messages are delayed." }
      ]
    },
    {
      title: "Consistency Models",
      lessons: [
        { title: "Strong vs Eventual Consistency", content: "Strong consistency guarantees every read sees the latest write; eventual consistency only guarantees reads converge to the latest write given enough time." },
        { title: "Read-Your-Writes Guarantees", content: "A read-your-writes guarantee ensures a user always sees their own prior writes, even on a system that's otherwise only eventually consistent." }
      ]
    }
  ].freeze

  def self.seed!
    journey = Journey.find_or_create_by!(title: "Software Design") do |j|
      j.description = "Master the fundamentals of designing systems that scale."
    end

    CURRICULUM.each_with_index do |subject_attrs, subject_index|
      subject = Subject.find_or_create_by!(journey: journey, title: subject_attrs[:title]) do |s|
        s.position = subject_index + 1
        s.minimum_passing_score = 8
      end

      subject_attrs[:lessons].each_with_index do |lesson_attrs, lesson_index|
        Lesson.find_or_create_by!(subject: subject, title: lesson_attrs[:title]) do |l|
          l.position = lesson_index + 1
          l.content = lesson_attrs[:content]
        end
      end
    end

    journey
  end
end

namespace :curriculum do
  desc "Seed the static curriculum data (development only)"
  task seed: :environment do
    abort "curriculum:seed only runs in development." unless Rails.env.development?

    CurriculumSeeder.seed!
    puts "Seeded #{Journey.count} Journey(s), #{Subject.count} Subject(s), #{Lesson.count} Lesson(s)."
  end

  # Fixture emails/passwords here are matched by literal string in the
  # apps/e2e Playwright specs — see ADR-0013. Exercise/grading (issue #6)
  # doesn't exist yet, so a real user has no in-app way to pass a Lesson;
  # these Submission rows are the only way to reach the completed/in-progress
  # screens until that ships.
  desc "Seed curriculum content + fixture users/progress for Playwright E2E (test only)"
  task seed_e2e: :environment do
    abort "curriculum:seed_e2e only runs in the test environment." unless Rails.env.test?

    journey = CurriculumSeeder.seed!
    subjects = journey.subjects.order(:position).to_a
    completed_subject, in_progress_subject = subjects[0], subjects[1]

    progress_user = User.find_or_create_by!(email: "e2e-in-progress@example.com") do |u|
      u.password = "e2e-fixture-password"
    end
    UserJourney.find_or_create_by!(user: progress_user, journey: journey)
    completed_subject.lessons.each do |lesson|
      FactoryBot.create(:submission, user: progress_user, lesson: lesson, score: completed_subject.minimum_passing_score)
    end
    in_progress_subject.lessons.first(2).each do |lesson|
      FactoryBot.create(:submission, user: progress_user, lesson: lesson, score: in_progress_subject.minimum_passing_score)
    end

    completed_user = User.find_or_create_by!(email: "e2e-completed@example.com") do |u|
      u.password = "e2e-fixture-password"
    end
    UserJourney.find_or_create_by!(user: completed_user, journey: journey)
    subjects.each do |subject|
      subject.lessons.each do |lesson|
        FactoryBot.create(:submission, user: completed_user, lesson: lesson, score: subject.minimum_passing_score)
      end
    end

    # No progress needed — exists purely so the signup E2E test can provoke
    # "Email has already been taken" against a real, live backend.
    User.find_or_create_by!(email: "e2e-existing@example.com") do |u|
      u.password = "e2e-fixture-password"
    end

    puts "Seeded E2E fixtures: #{Journey.count} Journey(s), #{Subject.count} Subject(s), " \
         "#{Lesson.count} Lesson(s), #{User.count} User(s), #{Submission.count} Submission(s)."
  end
end
