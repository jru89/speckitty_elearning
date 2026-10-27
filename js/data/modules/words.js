// Module 1: Words you'll hear (FR-008, FR-009). Shape: data-model.md "Module (static)".
// Definitions follow research.md R0-03. Tool-neutral (NFR-007): tool names appear only as examples.
// Pure data: no imports, no DOM, no `when` conditions. Tiles are HTML styled by css/style.css; the agentic loop
// is an animated widget (kind "agent-loop").

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

const CHARTER_EXAMPLE = `<pre><code># Charter: team-todo-app

Doctrine we use:
  - Locality of Change: keep changes close to the problem
  - Boy Scout Rule: leave the code you touch a bit better

Our own rules:
  - Every change gets one review before it's merged
  - All screens work on a phone
  - Plain English in everything users read</code></pre>`;

export default {
  id: "words",
  title: "Words you'll hear",
  summary: "The handful of terms the trainer will use, in plain language, with examples.",
  minutes: 12,
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
        "<p class=\"lead-in\"><strong>An agent is a model in a loop.</strong> A chatbot replies, then waits for you. An agent keeps going: it plans, uses a tool, looks at the result and decides what to do next, until the goal is met or it needs you.</p>",
      after:
        "<ul class=\"pills\">" +
        "<li><strong>Model</strong> reasons</li>" +
        "<li><strong>Tools</strong> act</li>" +
        "<li><strong>Context</strong> what it knows about your work</li>" +
        "</ul>" +
        "<p>This loop is what makes agents useful. It's also what lets them drift: each round builds on the last, so a small misunderstanding early on can grow. That's exactly what Spec Kitty helps with.</p>",
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
        "<p>The <strong>model</strong> is the AI \"brain\" inside your AI tool. The tool is the app you use; the model does the thinking. Many tools let you switch models.</p>" +
        "<p><strong>Why it matters:</strong> models differ in how smart, how fast and how expensive they are. A bigger model makes fewer mistakes on hard work, but is slower and costs more. Anthropic's Claude comes as Opus (most capable), Sonnet and Haiku (fastest); xAI's Grok and OpenAI's GPT have similar ranges.</p>" +
        "<h3 class=\"sub\">Which model when</h3>" +
        "<p>You don't need this on day one. When you want to choose, match the model to the job: plan with a strong model, then switch to a fast one to do the work.</p>" +
        MODEL_WHEN +
        "<p><strong>Tokens.</strong> Models read and write in <em>tokens</em>: small pieces of text, roughly three-quarters of a word. You pay per token, longer answers take longer, and the agent's memory (the context window, below) is measured in tokens too.</p>" +
        "<p><strong>Effort.</strong> Many tools let you choose how hard the model thinks before it answers, often called low, medium or high effort (or \"thinking\"):</p>" +
        EFFORT_TILES,
    },
    {
      id: "tools",
      heading: "Tools and MCP",
      // kind "tools-mcp": module-view renders the animated Agent → MCP → tool diagram (js/views/widgets/tools-mcp.js).
      kind: "tools-mcp",
      body:
        "<p class=\"lead-in\"><strong>Tools let it act. MCP lets it plug in.</strong> A <strong>tool</strong> is an action the agent may take: read a file, run a command, search the web, create a ticket. Your AI tool usually asks your permission first, especially for anything that changes files or runs commands.</p>" +
        "<p>The <strong>Model Context Protocol (MCP)</strong> is an open standard that packages tools as plug-ins (\"servers\"), so one agent can use Jira, Confluence, a database or Git without custom glue.</p>",
      after:
        "<p>You won't set up MCP in the class, but you'll hear the word: it's how agents get connected to the systems your team already uses.</p>",
      tools: ["Jira", "Confluence", "Database", "Git"],
      calls: [
        { tool: "Jira", call: "Ask Jira which tickets are still open", result: "14 open tickets, 3 of them blocked" },
        { tool: "Confluence", call: "Open the \"Release checklist\" page in Confluence", result: "12 steps, last edited 2 days ago" },
        { tool: "Database", call: "Count the orders that haven't been paid yet", result: "37 unpaid orders" },
        { tool: "Git", call: "Look up the last 3 changes in Git", result: "Latest change: \"Fix the login button\"" },
      ],
    },
    {
      id: "context",
      heading: "Context: what it always knows",
      // kind "context-stack": module-view renders the animated context window (js/views/widgets/context-stack.js).
      kind: "context-stack",
      body:
        "<p class=\"lead-in\"><strong>Rules and AGENTS.md are what it always knows.</strong> The <strong>context window</strong> is everything the agent can see right now: its working memory for one session, measured in tokens. It's limited, and a new session starts empty.</p>" +
        "<p>Some knowledge belongs on every turn: how the project is built, what never to do, who to ask. Put it in an <strong>agent instruction file</strong> such as <code>AGENTS.md</code> (or <code>CLAUDE.md</code>, <code>GEMINI.md</code>, depending on the tool), one per project or folder. Keep it short: every line costs attention on every prompt.</p>",
      after:
        "<div class=\"example\"><span class=\"example__label\">Example AGENTS.md</span><pre><code># AGENTS.md\n- Run the tests with: npm test\n- Never change the live database\n- Questions about payments: ask the shop team</code></pre></div>" +
        "<p><strong>This is also why Spec Kitty keeps specs and plans in your project folder:</strong> the next session, or another agent, reads them instead of relying on memory.</p>",
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
        "<p>You don't need to type Git commands in the class: your AI tool and Spec Kitty do most of it. But you'll hear these words.</p>",
    },
    {
      id: "skills",
      heading: "Skills: playbooks it loads when needed",
      // kind "skills": module-view renders the animated request → matching skill demo (js/views/widgets/skills.js).
      kind: "skills",
      body:
        "<p class=\"lead-in\"><strong>A skill is a playbook the agent loads when it's needed.</strong> It's a folder with a <code>SKILL.md</code>: when to use it, the steps, any scripts. Until a task matches, the agent only sees each skill's name and a one-line description. Then it reads the whole playbook: expert behaviour, without a giant prompt.</p>" +
        "<p>Spec Kitty installs its workflow as skills, so you can ask in plain words, or start one with a command like <code>/spec-kitty.specify</code> (the exact form differs per tool).</p>",
      after:
        "<table class=\"shaping\"><caption>Shaping an agent</caption>" +
        "<thead><tr><th scope=\"col\">What</th><th scope=\"col\">In context</th></tr></thead><tbody>" +
        "<tr><th scope=\"row\"><strong>Always knows</strong><span>rules, AGENTS.md</span></th><td>Every turn</td></tr>" +
        "<tr><th scope=\"row\"><strong>Loads when needed</strong><span>skills</span></th><td>When a task matches</td></tr>" +
        "<tr><th scope=\"row\"><strong>Can do</strong><span>tools</span></th><td>Listed every turn, used when it acts</td></tr>" +
        "</tbody></table>",
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
      id: "doctrine",
      heading: "Doctrine",
      body:
        "<p><strong>Doctrine</strong> is Spec Kitty's shared library of \"how we work\": rules and routines collected from experience, which any project can pick from. It includes directives (rules that must hold), tactics (proven techniques), procedures (step-by-step routines) and agent profiles (roles).</p>" +
        "<div class=\"tiles\">" +
        "<div class=\"tile tile--blue\"><span class=\"tile__kicker\">Directive</span><strong>Locality of Change</strong><span>Keep changes close to the problem you're solving, so they're small and easy to review.</span></div>" +
        "<div class=\"tile tile--green\"><span class=\"tile__kicker\">Directive</span><strong>Boy Scout Rule</strong><span>Leave the code you touch a bit better than you found it.</span></div>" +
        "<div class=\"tile tile--purple\"><span class=\"tile__kicker\">Procedure</span><strong>Implement, then review</strong><span>One agent builds a piece of work, another checks it against the spec before it's accepted.</span></div>" +
        "</div>",
    },
    {
      id: "charter",
      heading: "Charter",
      body:
        "<p>The <strong>charter</strong> is your project's own pick from the doctrine, plus its own rules. The spec says <em>what</em> to build; the charter says <em>how</em> you build it.</p>" +
        "<div class=\"example\"><span class=\"example__label\">Example charter</span>" +
        CHARTER_EXAMPLE +
        "</div>",
    },
    {
      id: "agent-profile",
      heading: "Agent profile",
      body:
        "<p>An <strong>agent profile</strong> is a role an agent takes on. Each has its own focus and boundaries, so the same AI tool can play different parts. Spec Kitty comes with profiles such as:</p>" +
        "<div class=\"tiles\">" +
        "<div class=\"tile tile--teal\"><span class=\"tile__kicker\">Implementer</span><strong>Implementer Ivan</strong><span>Builds one work package, exactly as the plan says.</span></div>" +
        "<div class=\"tile tile--pink\"><span class=\"tile__kicker\">Reviewer</span><strong>Reviewer Renata</strong><span>Checks work against the spec. She points out problems; she doesn't rewrite the code herself.</span></div>" +
        "<div class=\"tile tile--orange\"><span class=\"tile__kicker\">Architect</span><strong>Architect Alphonso</strong><span>Looks at the big picture: how the parts fit together.</span></div>" +
        "</div>",
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
          question: "Why would you choose a bigger model, or higher effort?",
          options: [
            "It's always faster",
            "It makes fewer mistakes on hard work, but is slower and costs more",
            "It's needed for every small change",
            "It remembers yesterday's session",
          ],
          answer: 1,
          why: "Bigger models and higher effort are for hard problems. For quick edits, a small model or low effort is faster and cheaper.",
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
            "It lets an agent plug into tools like Jira, a database or Git through one standard",
            "It stores your passwords",
            "It's Spec Kitty's name for a work package",
          ],
          answer: 1,
          why: "MCP packages tools as plug-in servers, so any agent that speaks MCP can use them without custom glue.",
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
          question: "What's the difference between AGENTS.md and a skill?",
          options: [
            "There's no difference",
            "AGENTS.md is read on every turn; a skill's full playbook loads only when a task matches",
            "A skill is read on every turn; AGENTS.md loads only when needed",
            "AGENTS.md is for people, skills are for agents",
          ],
          answer: 1,
          why: "Put what it should always know in AGENTS.md, and keep it short. Put specialised how-to in a skill, which loads only when it's needed.",
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
        {
          question: "What's the difference between doctrine and a charter?",
          options: [
            "They mean the same thing",
            "Doctrine is the shared library of how-to; the charter is your project's own pick from it, plus its own rules",
            "The charter is the shared library; doctrine is your project's own rules",
            "Doctrine is only for agents, the charter only for people",
          ],
          answer: 1,
          why: "Doctrine is what every project can choose from. The charter is what your project actually chose.",
        },
        {
          question: "\"Reviewer Renata checks work against the spec and doesn't rewrite the code herself.\" What is she?",
          options: ["A model", "A tool", "An agent profile", "A charter"],
          answer: 2,
          why: "An agent profile is a role with its own focus and boundaries. The same AI tool can take on different profiles.",
        },
      ],
    },
  },
};
