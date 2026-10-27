// Module 3: Words you'll hear (FR-008, FR-009). Shape: data-model.md "Module (static)".
// Definitions follow research.md R0-03. Tool-neutral (NFR-007): tool names appear only as examples.
// Kept short on purpose: each topic is a definition plus its animation; the extra depth sits in a closed
// "Want to go deeper?" fold (details.deeper). Spec Kitty's own words live in the spec-driven module.
// Pure data: no imports, no DOM, no `when` conditions.

const deeper = (summary, inner) => `<details class="deeper"><summary>Want to go deeper? ${summary}</summary>${inner}</details>`;

const EFFORT_TILES = `
<div class="tiles">
<div class="tile tile--teal"><span class="tile__kicker">Low effort</span><strong>Quick answers</strong><span>Fix a typo, rename something, a small question. Fast and cheap.</span></div>
<div class="tile tile--blue"><span class="tile__kicker">Medium effort</span><strong>Everyday work</strong><span>The usual default: add a feature, explain some code.</span></div>
<div class="tile tile--purple"><span class="tile__kicker">High effort</span><strong>Hard problems</strong><span>Plan a feature, hunt a tricky bug. Slower, uses more tokens, so it costs more.</span></div>
</div>`;

const MODEL_WHEN = `
<div class="model-when">
<article class="job job--blue"><h3>Plan and design</h3><p>Strongest reasoning. Pays off before any code is written.</p><ul class="job__models"><li>Opus 5.5</li><li>GPT-5.6 Sol</li></ul></article>
<article class="job job--purple"><h3>Creative</h3><p>Writing, screens, naming, slides.</p><ul class="job__models"><li>Opus 5.5</li></ul></article>
<article class="job job--green"><h3>Execute</h3><p>A clear plan or ticket: edits, tests, refactors. Fast.</p><ul class="job__models"><li>Composer 2.5</li><li>Grok 4.7</li></ul></article>
<article class="job job--orange"><h3>Quick questions</h3><p>Look-ups and small explanations.</p><ul class="job__models"><li>Composer 2.5</li></ul></article>
</div>
<p class="caption">Model names as of October 2026. They change every few months; the jobs don't.</p>`;

const SHAPING = `
<table class="shaping"><caption>What's in context, and when</caption>
<thead><tr><th scope="col">What</th><th scope="col">In context</th></tr></thead><tbody>
<tr><th scope="row"><strong>Always knows</strong><span>rules, AGENTS.md</span></th><td>Every turn</td></tr>
<tr><th scope="row"><strong>Loads when needed</strong><span>skills</span></th><td>When a task matches</td></tr>
<tr><th scope="row"><strong>Can do</strong><span>tools</span></th><td>Listed every turn, used when it acts</td></tr>
</tbody></table>`;

export default {
  id: "words",
  title: "Words you'll hear",
  summary: "The AI terms the trainer will use, in plain language, with examples.",
  minutes: 7,
  optional: false,
  blocks: [
    {
      id: "chatbot-vs-agent",
      heading: "Chatbot vs agent",
      body:
        "<p>A <strong>chatbot</strong> answers in text, and you do the work: copy the code, paste it, run it and report errors back.</p>" +
        "<p>An <strong>agent</strong> can act. It reads and edits files, runs commands and checks the results itself. You supervise instead of doing every step.</p>" +
        "<div class=\"example\"><span class=\"example__label\">Example</span><p>Ask ChatGPT in your browser to \"add a dark mode to my website\" and you get code to paste in yourself. Ask an agent, like Claude Code, Codex or Copilot in VS Code, and it opens your files, changes the styling, runs the site and checks that it works.</p></div>",
    },
    {
      id: "agentic-loop",
      heading: "The agentic loop",
      // kind "agent-loop": module-view renders the animated ring and agent trace (js/views/widgets/agent-loop.js).
      kind: "agent-loop",
      body:
        "<p class=\"lead-in\"><strong>An agent is a model in a loop.</strong> It plans, uses a tool, looks at the result and decides what to do next, until the goal is met or it needs you.</p>",
      after:
        "<p>Each round builds on the last, so a small misunderstanding early on can grow. Spec Kitty's spec and review steps catch that.</p>",
      trace: [
        { step: "goal", text: "Why does the login button do nothing?" },
        { step: "plan", text: "Start with the login page code." },
        { step: "act", text: "read_file src/login.js" },
        { step: "observe", text: "The button calls submitForm(), which doesn't exist." },
        { step: "decide", text: "Find out what the function is really called." },
        { step: "act", text: "search \"function send\"" },
        { step: "observe", text: "It's called sendForm()." },
        { step: "decide", text: "Fix the call, then run the tests." },
        { step: "act", text: "edit_file src/login.js · run_tests" },
        { step: "observe", text: "All 12 tests pass." },
        { step: "done", text: "Goal met: the button works. Tell you what changed." },
      ],
    },
    {
      id: "model",
      heading: "Model",
      body:
        "<p>The <strong>model</strong> is the AI \"brain\" inside your AI tool. The tool is the app you use; the model does the thinking. Anthropic's Claude comes as Opus (most capable), Sonnet and Haiku (fastest); Grok and GPT have similar ranges.</p>" +
        "<p>A bigger model makes fewer mistakes on hard work, but is slower and costs more. Models read and write in <strong>tokens</strong>, small pieces of text of about three-quarters of a word, and you pay per token.</p>" +
        deeper(
          "Which model when, and effort",
          "<p>Match the model to the job: plan with a strong model, then switch to a fast one to do the work.</p>" +
            MODEL_WHEN +
            "<p><strong>Effort.</strong> Many tools let you choose how hard the model thinks before it answers, often called low, medium or high effort (or \"thinking\"):</p>" +
            EFFORT_TILES,
        ),
    },
    {
      id: "tools",
      heading: "Tools and MCP",
      // kind "tools-mcp": module-view renders the animated Agent → MCP → tool diagram (js/views/widgets/tools-mcp.js).
      kind: "tools-mcp",
      body:
        "<p class=\"lead-in\"><strong>Tools let it act. MCP lets it plug in.</strong> A <strong>tool</strong> is an action the agent may take: read a file, run a command, search the web. Your AI tool usually asks your permission first.</p>" +
        "<p>The <strong>Model Context Protocol (MCP)</strong> is an open standard for plugging apps into an agent, so one agent can use your calendar, Notion or GitHub without custom glue.</p>",
      after: "<p>You won't set up MCP in the class, but you'll hear the word.</p>",
      tools: ["Calendar", "Notion", "GitHub", "Web"],
      calls: [
        { tool: "Calendar", call: "Ask your calendar what's planned on Friday", result: "Dinner at 19:00, nothing else" },
        { tool: "Notion", call: "Open your \"Trip to Lisbon\" notes in Notion", result: "Flights booked, hotel still to pick" },
        { tool: "GitHub", call: "Look up the last 3 changes on GitHub", result: "Latest change: \"Fix the login button\"" },
        { tool: "Web", call: "Search the web for tomorrow's bus times", result: "Every 15 minutes from 07:00" },
      ],
    },
    {
      id: "context",
      heading: "Context: what it knows",
      // kind "context-stack": module-view renders the animated context window (js/views/widgets/context-stack.js).
      kind: "context-stack",
      body:
        "<p class=\"lead-in\"><strong>The context window is everything the agent can see right now.</strong> It's its working memory for one session, measured in tokens. It's limited, and a new session starts empty. Files like <code>AGENTS.md</code> give it standing instructions; skills add a playbook only when needed.</p>",
      after:
        "<p><strong>That's why Spec Kitty keeps specs and plans in your project folder:</strong> the next session reads them instead of relying on memory.</p>" +
        deeper(
          "AGENTS.md and skills",
          "<p>What the agent should know on every turn goes in an <strong>agent instruction file</strong> such as <code>AGENTS.md</code> (or <code>CLAUDE.md</code>, depending on the tool). Keep it short: every line costs attention on every prompt. Specialised how-to goes in a skill, which loads only when it's needed.</p>" +
            "<div class=\"example\"><span class=\"example__label\">Example AGENTS.md</span><pre><code># AGENTS.md\n- This is my recipe website\n- Start it with: npm start\n- Never delete anything in the photos folder\n- Write all page texts in plain English</code></pre></div>" +
            SHAPING,
        ),
      layers: [
        { label: "Built-in instructions", kind: "base", size: 22, note: "The tool's own instructions come first." },
        { label: "Always-on rules", kind: "base", size: 10, note: "Rules you've set for every project." },
        { label: "AGENTS.md · project", kind: "always", size: 9, note: "Your project's AGENTS.md: read on every turn." },
        { label: "AGENTS.md · this folder", kind: "always", size: 6, note: "A folder can add its own, more specific file." },
        { label: "Skill, when a task matches", kind: "skill", size: 11, note: "A skill's full playbook loads only when your task matches it." },
        { label: "Your prompt", kind: "prompt", size: 6, note: "And finally, what you just asked. All of this shares one window." },
      ],
    },
    {
      id: "git",
      heading: "Git in one minute",
      body:
        "<p><strong>Git</strong> keeps a history of every change in a project, so you can see what changed, when and why, and go back.</p>" +
        "<ul>" +
        "<li>A <strong>repository</strong> (repo) is a project folder that Git keeps a history for.</li>" +
        "<li>A <strong>commit</strong> is one saved change, with a short note on what changed.</li>" +
        "<li>A <strong>branch</strong> is a separate line of work, so you can try something without touching the main version.</li>" +
        "<li><strong>Merging</strong> brings a finished branch back into the main version.</li>" +
        "</ul>" +
        "<p>You don't need to type Git commands in the class: your AI tool and Spec Kitty do most of it.</p>",
    },
    {
      id: "words-done",
      kind: "note",
      body: "<p>That's all the vocabulary you need. Everything else is explained during the session. Try the quiz below to check yourself.</p>",
    },
  ],
  exercise: {
    id: "words-quiz",
    type: "quiz",
    config: {
      questions: [
        {
          question: "What makes an agent different from a chatbot?",
          options: [
            "It can act itself: open files, make changes and run commands",
            "It always uses a bigger model",
            "It remembers everything from earlier sessions",
            "It only works without an internet connection",
          ],
          answer: 0,
          why: "A chatbot only answers in text. An agent takes actions with tools and checks the results itself.",
        },
        {
          question: "Which describes the agentic loop?",
          options: [
            "Plan, act with a tool, observe the result, decide what's next, and repeat",
            "Write all the code first, then test it once at the end",
            "Ask the same question until you like the answer",
            "Copy code from a chatbot into your editor",
          ],
          answer: 0,
          why: "The agent goes round plan, act, observe and decide until the goal is met, or until it needs you.",
        },
        {
          question: "Why would you choose a bigger model?",
          options: [
            "It's always faster",
            "It makes fewer mistakes on hard work, but is slower and costs more",
            "It's needed for every small change",
            "It remembers yesterday's session",
          ],
          answer: 1,
          why: "Bigger models are for hard problems. For quick edits, a smaller one is faster and cheaper.",
        },
        {
          question: "What is a token?",
          options: [
            "A password for your AI tool",
            "A small piece of text, roughly three-quarters of a word",
            "One saved change in Git",
            "A Spec Kitty command",
          ],
          answer: 1,
          why: "Models read and write in tokens. You pay per token, and memory is measured in tokens too.",
        },
        {
          question: "What does MCP (the Model Context Protocol) do?",
          options: [
            "It makes the model think harder",
            "It lets an agent plug into apps like your calendar, Notion or GitHub through one standard",
            "It stores your passwords",
            "It's Spec Kitty's name for a work package",
          ],
          answer: 1,
          why: "MCP is one standard way to plug apps into an agent, so no custom glue is needed for each app.",
        },
        {
          question: "Why does Spec Kitty keep specs and plans in your project folder?",
          options: [
            "So they look tidy",
            "Because the agent's memory (context window) starts empty in every new session",
            "Because agents can't read chat messages",
            "So nobody else can see them",
          ],
          answer: 1,
          why: "The agent forgets everything between sessions. Written specs and plans are how the next session knows what to build.",
        },
        {
          question: "What is a commit in Git?",
          options: [
            "One saved change, with a short note on what changed",
            "A separate line of work",
            "A promise to finish a task",
            "The folder Git keeps a history for",
          ],
          answer: 0,
          why: "A commit saves one change in the history. A branch is a separate line of work; the repository is the folder.",
        },
      ],
    },
  },
};
