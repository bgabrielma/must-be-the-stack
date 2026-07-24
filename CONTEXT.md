# must-be-the-stack

A gamified developer-learning app: delivers one concept at a time toward a study goal (e.g. system design), evaluates the learner's understanding, and gates progress until they demonstrate it.

## Language

**Journey**:
An open-ended career or study area a user pursues (e.g. "Software Design"). Contains Subjects and never itself "completes."
_Avoid_: Career, Path, Track, Course.

**Subject**:
A finite, completable unit of study within a Journey (e.g. "Cache"). Has a fixed set of Lessons, sized dynamically by the system to cover the Subject's fundamentals. A user works one Subject at a time per Journey; completing it unlocks the next.
_Avoid_: Course, Topic, Module.

**Lesson**:
A single concept-sized unit within a Subject, analogous to one course video. Ends in an Exercise that must be passed to unlock the next Lesson.
_Avoid_: Video, Unit, Step.

**Exercise**:
The graded activity that closes a Lesson. The system decides per Lesson whether it's a Quiz (theory) or a Project (hands-on).
_Avoid_: Assignment, Task, Assessment.

**Quiz**:
An open-ended Exercise (answered via text or voice) for theory-heavy Lessons, graded 0–10 by an LLM against the Lesson's concept.
_Avoid_: Test, Questionnaire.

**Project**:
A hands-on Exercise submitted as a GitHub repo + branch, forked from a generated Template Repo, and graded by the Evaluator.
_Avoid_: Assignment, Task.

**Submission**:
A user's attempt at an Exercise. Scored 0–10; resubmission is unlimited until the Subject's minimum passing score is met.
_Avoid_: Attempt (ambiguous — Submission is the record, attempt is the act).

**Rubric**:
The AI-generated scoring criteria for a Project, produced alongside the Exercise during generation and reviewed before publish. For Projects, the Rubric also defines the executable test suite baked into the Template Repo.
_Avoid_: Grading criteria, Checklist.

**Discovery phase**:
The manual, developer-driven step of researching external sources (Reddit, GitHub repos, roadmap sites, articles) to inform a Subject's curriculum before authoring its Lessons and Rubrics. Not an automated system step: the developer does this research and authoring themselves using their own Claude subscription, then commits the result as static seed data (see [ADR-0001](docs/adr/0001-shared-curriculum-per-subject.md)).
_Avoid_: Research phase.

**Template Repo**:
The starter GitHub repository generated for a Project Exercise, pre-wired with the grading workflow (the Rubric's test suite). A Submission's workflow file is checked against it — any mismatch or absence is rejected before evaluation runs.
_Avoid_: Starter repo, Boilerplate.

**Evaluator**:
The component that executes a Project Submission's grading workflow and scores the result against its Rubric.
_Avoid_: Grader (reserve for the general grading concept — Evaluator is specifically the execution agent).

**Socratic Guide**:
A chat assistant scoped to a Lesson, offering guiding questions rather than answers when a user is stuck on its content or Exercise. History is persisted per Lesson (retained across visits) and fully isolated from grading — no chat content is ever passed to a Quiz or Project's scoring call.
_Avoid_: Chatbot, Tutor, Hint system.

**Streak**:
The count of consecutive days with at least one completed Lesson. Drives notification tone.
_Avoid_: Combo, Chain.

**Gating** / **Unlock**:
The constraint that a user must pass a Lesson's Exercise to unlock the next Lesson, and complete a Subject (one at a time) to unlock the next Subject.
_Avoid_: Progression (too vague — Gating is the mechanism, not the outcome).
