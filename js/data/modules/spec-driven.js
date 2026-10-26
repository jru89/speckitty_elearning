// Module 2: Vibe coding vs spec-driven (FR-010, FR-011). Shape: data-model.md "Module (static)".
// Tool-neutral (NFR-007). C-005: exactly one one-line teaser (block "bright-factory-teaser"), nothing more.
// The command-style block has no body and no `when`: module-view renders it for the attendee's tool (FR-025).
// Pure data: no imports, no DOM, no `when` conditions.

export default {
  id: "spec-driven",
  title: "Vibe coding vs spec-driven",
  summary: "Why loose prompting breaks down on bigger work, and the flow Spec Kitty uses instead.",
  minutes: 3,
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
        "<li>The agent forgets between sessions, because its context window starts empty.</li>" +
        "<li>It drifts from what you meant.</li>" +
        "<li>There's no record of <em>why</em> something was built.</li>" +
        "<li>\"Done\" is never defined, so the result is hard to review.</li>" +
        "</ul>",
    },
    {
      id: "spec-driven",
      heading: "Spec-driven",
      body:
        "<p><strong>Spec-driven</strong> development writes down your intent and acceptance criteria first, keeps them in Git next to the code, and lets the agent work from them.</p>",
    },
    {
      id: "seven-steps",
      heading: "The seven steps",
      body:
        "<table>" +
        "<thead><tr><th>Step</th><th>Produces</th><th>Who leads</th></tr></thead>" +
        "<tbody>" +
        "<tr><td>Spec</td><td>What and why, plus acceptance criteria</td><td>You</td></tr>" +
        "<tr><td>Plan</td><td>How: the technical approach</td><td>Agent drafts, you check</td></tr>" +
        "<tr><td>Tasks</td><td>Work packages</td><td>Agent</td></tr>" +
        "<tr><td>Build</td><td>Code, per work package</td><td>Agent</td></tr>" +
        "<tr><td>Review</td><td>A check against the spec</td><td>Another agent and/or you</td></tr>" +
        "<tr><td>Accept</td><td>Confirmation the criteria are met</td><td>You</td></tr>" +
        "<tr><td>Merge</td><td>The work in the main code</td><td>You approve</td></tr>" +
        "</tbody>" +
        "</table>",
    },
    {
      id: "work-packages-worktrees",
      heading: "Work packages and worktrees",
      body:
        "<p>A <strong>work package</strong> is one small, reviewable slice of the work.</p>" +
        "<p>A <strong>worktree</strong> is a separate working folder of the same repo, so several agents can build different work packages at once without stepping on each other.</p>",
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
    {
      id: "command-style",
      kind: "command-style",
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
