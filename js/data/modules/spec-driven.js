// Module 1: What Spec Kitty is (FR-010, FR-011). Shape: data-model.md "Module (static)".
// Tool-neutral (NFR-007). C-005: exactly one one-line teaser (block "bright-factory-teaser"), nothing more.
// The Spec Kitty words (skills, charter, doctrine, profiles) are here at "recognise the word" depth: the class
// teaches them properly. The command-style block has no body and no `when`: module-view renders it for the
// attendee's tool (FR-025). Pure data: no imports, no DOM, no `when` conditions.

const SPEC_KITTY_WORDS = `
<div class="tiles">
<div class="tile tile--blue"><span class="tile__kicker">Work package</span><strong>One small slice</strong><span>A piece of the work that can be built and reviewed on its own.</span></div>
<div class="tile tile--teal"><span class="tile__kicker">Worktree</span><strong>A separate working folder</strong><span>Of the same repo, so agents can build different work packages at once.</span></div>
<div class="tile tile--purple"><span class="tile__kicker">Charter</span><strong>How this project works</strong><span>Your project's own rules. The spec says what to build; the charter says how.</span></div>
<div class="tile tile--green"><span class="tile__kicker">Doctrine</span><strong>The shared library</strong><span>Proven rules and routines that a charter picks from.</span></div>
<div class="tile tile--pink"><span class="tile__kicker">Agent profile</span><strong>A role to play</strong><span>Implementer, reviewer, architect: the same AI tool in a different part.</span></div>
</div>`;

const habit = (colour, title, where) =>
  `<article class="habit habit--${colour}"><h3>${title}</h3><p class="habit__where">In Spec Kitty: <strong>${where}</strong></p></article>`;

export default {
  id: "spec-driven",
  title: "What Spec Kitty is",
  summary: "Why loose prompting breaks down on bigger work, and the flow Spec Kitty uses instead.",
  minutes: 7,
  optional: false,
  blocks: [
    {
      id: "vibe-coding",
      heading: "Vibe coding",
      body:
        "<p><strong>Vibe coding</strong> means prompting, accepting what the agent makes, and prompting again. It works well for quick prototypes and experiments.</p>",
    },
    {
      id: "where-it-breaks",
      heading: "Where it breaks down",
      body:
        "<p>On bigger work, a few problems show up:</p>" +
        "<ul>" +
        "<li>The agent forgets between sessions.</li>" +
        "<li>It drifts from what you meant.</li>" +
        "<li>There's no record of <em>why</em> something was built.</li>" +
        "<li>\"Done\" is never defined, so the result is hard to review.</li>" +
        "</ul>",
    },
    {
      id: "spec-driven",
      heading: "Spec-driven",
      body:
        "<p><strong>Spec-driven</strong> development writes down your intent and acceptance criteria first, keeps them in Git next to the code, and lets the agent work from them. Spec Kitty gives that a fixed flow.</p>",
    },
    {
      id: "seven-steps",
      heading: "The seven steps",
      // Rendered as a vertical flow (css/style.css .steps); colour shows who leads each step.
      body:
        "<ol class=\"steps\" aria-label=\"The seven steps\">" +
        "<li class=\"step step--you\"><span class=\"step__num\">1</span><span class=\"step__body\"><strong>Spec</strong><span>What and why, plus the acceptance criteria</span><span class=\"who who--you\">You</span></span></li><li class=\"step step--both\"><span class=\"step__num\">2</span><span class=\"step__body\"><strong>Plan</strong><span>How: the technical approach</span><span class=\"who who--both\">Agent drafts, you check</span></span></li><li class=\"step step--agent\"><span class=\"step__num\">3</span><span class=\"step__body\"><strong>Tasks</strong><span>Small work packages</span><span class=\"who who--agent\">Agent</span></span></li><li class=\"step step--agent\"><span class=\"step__num\">4</span><span class=\"step__body\"><strong>Build</strong><span>Code for each work package</span><span class=\"who who--agent\">Agent</span></span></li><li class=\"step step--both\"><span class=\"step__num\">5</span><span class=\"step__body\"><strong>Review</strong><span>A check against the spec</span><span class=\"who who--both\">Another agent and you</span></span></li><li class=\"step step--you\"><span class=\"step__num\">6</span><span class=\"step__body\"><strong>Accept</strong><span>Confirmation the criteria are met</span><span class=\"who who--you\">You</span></span></li><li class=\"step step--you\"><span class=\"step__num\">7</span><span class=\"step__body\"><strong>Merge</strong><span>The work in the main version</span><span class=\"who who--you\">You approve</span></span></li>" +
        "</ol>" +
        "<p class=\"who-legend\"><span class=\"who who--you\">You lead</span><span class=\"who who--agent\">The agent leads</span><span class=\"who who--both\">Together</span></p>",
    },
    {
      id: "skills",
      heading: "Each step is a skill",
      // kind "skills": module-view renders the animated request → matching skill demo (js/views/widgets/skills.js).
      kind: "skills",
      body:
        "<p class=\"lead-in\"><strong>A skill is a playbook your AI tool loads when it's needed.</strong> Spec Kitty installs each step as one, so you can ask in plain words, or start a step with a command like <code>/spec-kitty.specify</code>.</p>",
      skills: [
        { name: "spec-kitty.specify", does: "Turn an idea into a spec" },
        { name: "spec-kitty.plan", does: "Decide how to build it" },
        { name: "spec-kitty.tasks", does: "Split the plan into work packages" },
        { name: "spec-kitty.implement", does: "Build one work package" },
        { name: "spec-kitty.review", does: "Check work against the spec" },
        { name: "spec-kitty.merge", does: "Bring finished work in" },
      ],
      requests: [
        { text: "Write a spec for a simple to-do app", skill: "spec-kitty.specify" },
        { text: "Plan how we're going to build it", skill: "spec-kitty.plan" },
        { text: "Split the plan into work packages", skill: "spec-kitty.tasks" },
        { text: "Build work package 2", skill: "spec-kitty.implement" },
        { text: "Check WP02 against the spec", skill: "spec-kitty.review" },
        { text: "Merge the finished work", skill: "spec-kitty.merge" },
      ],
    },
    {
      id: "command-style",
      kind: "command-style",
    },
    {
      id: "spec-kitty-words",
      heading: "More words you'll hear in class",
      body:
        "<p>You only need to recognise these. The class shows them in action.</p>" + SPEC_KITTY_WORDS,
    },
    {
      id: "habits",
      heading: "Four habits that make the difference",
      // Not a sequence, so not numbered: each habit names the Spec Kitty step where it lives.
      body:
        "<p>Spec Kitty builds these habits into the flow, so you don't have to remember them.</p>" +
        "<div class=\"habits\">" +
        habit("blue", "Say what done looks like.", "the spec and its acceptance criteria") +
        habit("purple", "Teach once, not every prompt.", "the charter") +
        habit("green", "Let it verify.", "build, with tests per work package") +
        habit("orange", "Review before it matters.", "review and accept") +
        "</div>",
    },
    {
      id: "acceptance-criteria",
      heading: "Acceptance criteria",
      body:
        "<p>A good acceptance criterion can be checked with a yes or no by someone who didn't write it.</p>" +
        "<ul>" +
        "<li>Good: \"After I reload the page, my tasks are still there.\"</li>" +
        "<li>Not good: \"The app is easy to use.\" Easy for whom, and how would you check?</li>" +
        "</ul>" +
        "<p>The exercise below lets you practice telling them apart.</p>",
    },
    {
      id: "bright-factory-teaser",
      kind: "note",
      body:
        "<p>In the session we'll zoom in on the Bright Factory: humans define intent and acceptance criteria, agents build it in a traceable way.</p>",
    },
  ],
  exercise: {
    id: "spec-driven-judge",
    type: "judge",
    config: {
      statements: [
        {
          text: "When I add a task with an empty title, the app shows 'Title is required' and doesn't save it.",
          isCriterion: true,
          why: "Anyone can try it and answer yes or no: the message appears and nothing is saved, or not.",
        },
        {
          text: "The app should be fast and user-friendly.",
          isCriterion: false,
          why: "No one can check \"user-friendly\" with a yes or no, and \"fast\" has no number attached.",
        },
        {
          text: "Use React for the front end.",
          isCriterion: false,
          why: "That's a plan decision about how to build it, not a criterion about what the app must do.",
        },
        {
          text: "After I reload the page, my tasks are still there.",
          isCriterion: true,
          why: "Add a task, reload, look: the tasks are there or they aren't.",
        },
        {
          text: "Make it look nice.",
          isCriterion: false,
          why: "\"Nice\" depends on who is looking, so two reviewers could give different answers.",
        },
        {
          text: "Marking a task done moves it to the bottom of the list within one second.",
          isCriterion: true,
          why: "It names a visible result and a time limit, so a reviewer can check both.",
        },
      ],
    },
  },
};
