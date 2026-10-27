// Module 1: Words you'll hear (FR-008, FR-009). Shape: data-model.md "Module (static)".
// Definitions follow research.md R0-03. Tool-neutral (NFR-007): tool names appear only as examples.
// Pure data: no imports, no DOM, no `when` conditions. Diagrams are inline SVG/HTML styled by css/style.css.

// The agentic loop as a circle: four steps around the goal (arcs on r=140 around 210,210).
const LOOP_DIAGRAM = `
<figure class="diagram">
<svg class="loop" viewBox="0 0 420 420" role="img" aria-labelledby="loop-title loop-desc">
<title id="loop-title">The agentic loop</title>
<desc id="loop-desc">Four steps in a circle around your goal: 1 plan the next step, 2 act by using a tool, 3 observe the result, 4 adjust and repeat until the goal is reached.</desc>
<defs>
<marker id="loop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#9aa0ff"/></marker>
<radialGradient id="loop-core" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#7d6bff"/><stop offset="100%" stop-color="#3b2a9e"/></radialGradient>
</defs>
<g fill="none" stroke-width="5" stroke-linecap="round" marker-end="url(#loop-arrow)">
<path d="M249 75 A140 140 0 0 1 345 171" stroke="#0A84FF"/>
<path d="M345 249 A140 140 0 0 1 249 345" stroke="#64D2FF"/>
<path d="M171 345 A140 140 0 0 1 75 249" stroke="#30D158"/>
<path d="M75 171 A140 140 0 0 1 171 75" stroke="#FF9F0A"/>
</g>
<circle cx="210" cy="210" r="62" fill="url(#loop-core)"/>
<text x="210" y="204" class="loop-core">Your</text>
<text x="210" y="228" class="loop-core">goal</text>
<circle cx="210" cy="70" r="30" fill="#0A84FF"/><text x="210" y="79" class="loop-num">1</text>
<circle cx="350" cy="210" r="30" fill="#64D2FF"/><text x="350" y="219" class="loop-num loop-num--dark">2</text>
<circle cx="210" cy="350" r="30" fill="#30D158"/><text x="210" y="359" class="loop-num loop-num--dark">3</text>
<circle cx="70" cy="210" r="30" fill="#FF9F0A"/><text x="70" y="219" class="loop-num loop-num--dark">4</text>
<text x="210" y="124" class="loop-label">Plan</text>
<text x="292" y="215" class="loop-label" text-anchor="end">Act</text>
<text x="210" y="306" class="loop-label">Observe</text>
<text x="128" y="215" class="loop-label" text-anchor="start">Adjust</text>
</svg>
</figure>
<ol class="legend">
<li><span class="dot" style="background:#0A84FF"></span><strong>Plan:</strong> the model decides the next step towards your goal.</li>
<li><span class="dot" style="background:#64D2FF"></span><strong>Act:</strong> it uses a tool: open a file, edit it, run a command.</li>
<li><span class="dot" style="background:#30D158"></span><strong>Observe:</strong> it reads what happened: the output, an error, a test result.</li>
<li><span class="dot" style="background:#FF9F0A"></span><strong>Adjust:</strong> it changes its plan if needed, and goes round again until the goal is reached.</li>
</ol>`;

const EFFORT_TILES = `
<div class="tiles">
<div class="tile tile--teal"><span class="tile__kicker">Low effort</span><strong>Quick answers</strong><span>Fix a typo, rename something, a small question. Fast and cheap.</span></div>
<div class="tile tile--blue"><span class="tile__kicker">Medium effort</span><strong>Everyday work</strong><span>The usual default: add a feature, explain some code.</span></div>
<div class="tile tile--purple"><span class="tile__kicker">High effort</span><strong>Hard problems</strong><span>Plan a feature, hunt a tricky bug. Slower, uses more tokens, so it costs more.</span></div>
</div>`;

const MODEL_TILES = `
<div class="tiles">
<div class="tile tile--orange"><span class="tile__kicker">Anthropic · Claude</span><strong>Opus, Sonnet, Haiku</strong><span>Opus is the most capable and the slowest. Sonnet is the all-rounder. Haiku is the fastest and cheapest.</span></div>
<div class="tile tile--pink"><span class="tile__kicker">xAI · Grok</span><strong>Grok and Grok fast</strong><span>The full Grok model for harder reasoning, and faster, cheaper variants for quick tasks.</span></div>
</div>`;

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
  minutes: 8,
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
      body:
        "<p>An agent works in a loop until the job is done:</p>" +
        LOOP_DIAGRAM +
        "<div class=\"example\"><span class=\"example__label\">Example</span><p>You ask: \"the login button doesn't work, fix it\". It <strong>plans</strong> to look at the login code, <strong>acts</strong> by opening the file, <strong>observes</strong> a typo, and <strong>adjusts</strong>: fixes it, runs the app, checks again.</p></div>" +
        "<p>This loop is what makes agents useful. It's also what lets them drift: each round builds on the last, so a small misunderstanding early on can grow. That's exactly what Spec Kitty helps with.</p>",
    },
    {
      id: "model",
      heading: "Model",
      body:
        "<p>The <strong>model</strong> is the AI \"brain\" inside your AI tool. The tool is the app you use; the model does the thinking. Many tools let you switch models.</p>" +
        "<p><strong>Why it matters:</strong> models differ in how smart, how fast and how expensive they are. A bigger model makes fewer mistakes on hard work, but is slower and costs more. Companies offer a range, from big to small:</p>" +
        MODEL_TILES +
        "<p><strong>Tokens.</strong> Models read and write in <em>tokens</em>: small pieces of text, roughly three-quarters of a word. You pay per token, longer answers take longer, and the agent's memory (the context window, below) is measured in tokens too.</p>" +
        "<p><strong>Effort.</strong> Many tools let you choose how hard the model thinks before it answers, often called low, medium or high effort (or \"thinking\"):</p>" +
        EFFORT_TILES,
    },
    {
      id: "tools",
      heading: "Tools",
      body:
        "<p><strong>Tools</strong> are the actions an agent is allowed to take: read files, write files, run terminal commands, search the web.</p>" +
        "<p>Your AI tool usually asks your permission before using one, especially for anything that changes files or runs commands.</p>",
    },
    {
      id: "context-window",
      heading: "Context window",
      body:
        "<p>The <strong>context window</strong> is the agent's working memory for one session, measured in tokens. It's limited, and a new session starts empty: the agent remembers nothing from yesterday.</p>" +
        "<p><strong>This is why Spec Kitty keeps specs and plans in your project folder.</strong> The next session, or another agent, can read them instead of relying on memory.</p>",
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
      heading: "Skills and slash commands",
      body:
        "<p>A <strong>skill</strong> is a saved set of instructions the agent loads when a task matches. You often start one with a command such as <code>/something</code>.</p>" +
        "<p>Spec Kitty installs its commands this way, for example <code>/spec-kitty.specify</code> to start writing a spec. How they're typed differs per tool.</p>",
    },
    {
      id: "instruction-files",
      heading: "Agent instruction files",
      body:
        "<p>An <strong>agent instruction file</strong> is a file in your project that the agent always reads, for example to learn the project's conventions. Its name depends on the tool, such as <code>CLAUDE.md</code>, <code>AGENTS.md</code> or <code>GEMINI.md</code>.</p>",
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
            "Plan, act with a tool, observe the result, adjust and repeat",
            "Write all the code first, then test it once at the end",
            "Ask the same question until you like the answer",
            "Copy code from a chatbot into your editor",
          ],
          answer: 0,
          why: "The agent goes round plan, act, observe and adjust until the goal is reached.",
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
