# Static curriculum seed data, committed by the developer per the Discovery
# phase workflow (ADR-0001) — not generated at runtime. Safe to run repeatedly.

journey = Journey.find_or_create_by!(title: "Software Design") do |j|
  j.description = "Master the fundamentals of designing systems that scale."
end

curriculum = [
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
]

curriculum.each_with_index do |subject_attrs, subject_index|
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

puts "Seeded #{Journey.count} Journey(s), #{Subject.count} Subject(s), #{Lesson.count} Lesson(s)."
