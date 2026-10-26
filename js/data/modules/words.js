// Module 1: Words you'll hear (FR-008, FR-009). Shape: data-model.md "Module (static)".
// Definitions follow research.md R0-03. Tool-neutral (NFR-007): tool names appear only as examples.
// Pure data: no imports, no DOM, no `when` conditions.

export default {
  id: "words",
  title: "Words you'll hear",
  summary: "The handful of terms the trainer will use, in plain language.",
  minutes: 4,
  optional: false,
  blocks: [
    {
      id: "chatbot-vs-agent",
      heading: "Chatbot vs agent",
      body:
        "<p>A <strong>chatbot</strong> answers in text, and you do the work: copy the code, paste it, run it and report errors back.</p>" +
        "<p>An <strong>agent</strong> can act. It reads and edits files, runs commands and checks the results itself. You supervise instead of doing every step.</p>",
    },
    {
      id: "agentic-loop",
      heading: "The agentic loop",
      body:
        "<p>An agent works in a loop: think, use a tool, look at the result, and repeat until the task is done.</p>" +
        "<p>This loop is what makes agents useful. It is also what lets them drift: each step builds on the last, so a small misunderstanding early on can grow.</p>",
    },
    {
      id: "model",
      heading: "Model",
      body:
        "<p>The <strong>model</strong> is the AI \"brain\" your AI coding tool runs, such as Claude, GPT or Gemini. Different tools can run different models, and some let you switch.</p>",
    },
    {
      id: "tools",
      heading: "Tools",
      body:
        "<p><strong>Tools</strong> are the actions an agent is allowed to take: read files, write files, run terminal commands, search the web.</p>" +
        "<p>Your AI coding tool usually asks your permission before using one, especially for anything that changes files or runs commands.</p>",
    },
    {
      id: "context-window",
      heading: "Context window",
      body:
        "<p>The <strong>context window</strong> is the agent's working memory for one session. It is limited, and a new session starts empty: the agent remembers nothing from yesterday.</p>" +
        "<p><strong>This is why Spec Kitty keeps specs and plans in your repo.</strong> The next session, or another agent, can read them instead of relying on memory.</p>",
    },
    {
      id: "skills",
      heading: "Skills and slash commands",
      body:
        "<p>A <strong>skill</strong> is a saved set of instructions the agent loads when a task matches. You often start one with a command such as <code>/something</code>.</p>" +
        "<p>Spec Kitty installs its commands this way. How they're typed differs per tool.</p>",
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
        "<p><strong>Doctrine</strong> is Spec Kitty's reusable knowledge of \"how we work\". It includes:</p>" +
        "<ul>" +
        "<li><strong>directives</strong>: rules that must hold</li>" +
        "<li><strong>tactics</strong>: proven techniques</li>" +
        "<li><strong>procedures</strong>: step-by-step routines</li>" +
        "<li><strong>agent profiles</strong>: roles (see below)</li>" +
        "</ul>",
    },
    {
      id: "charter",
      heading: "Charter",
      body:
        "<p>The <strong>charter</strong> is your project's own selection of doctrine, plus its own rules.</p>" +
        "<p>The spec says <em>what</em> to build; the charter says <em>how</em> you build it.</p>",
    },
    {
      id: "agent-profile",
      heading: "Agent profile",
      body:
        "<p>An <strong>agent profile</strong> is a role an agent takes on, such as implementer, reviewer or architect. Each has its own focus and boundaries, so a reviewer checks work rather than rewriting it.</p>",
    },
    {
      id: "words-done",
      kind: "note",
      body: "<p>That's all the vocabulary you need. Everything else is explained during the session.</p>",
    },
  ],
  exercise: {
    id: "words-match",
    type: "match",
    config: {
      pairs: [
        {
          term: "Agent",
          definition: "An AI that does the work itself, instead of only answering in text for you to copy.",
          whyWrong: "Look for the contrast with a chatbot: the agent is the AI that does the work, not a step, an action or a file.",
        },
        {
          term: "Agentic loop",
          definition: "Think, use a tool, look at the result, repeat until done.",
          whyWrong: "The agentic loop is a cycle of steps, not a thing. Look for the definition that describes a repeating pattern.",
        },
        {
          term: "Context window",
          definition: "Limited working memory that starts empty in every new session.",
          whyWrong: "The context window is about memory: what the agent can hold in one session, and what it forgets afterwards.",
        },
        {
          term: "Tool",
          definition: "One action the agent is allowed to take, such as reading a file or searching the web, usually with your permission.",
          whyWrong: "A tool is one specific action. The agent is the AI that uses the tools.",
        },
        {
          term: "Skill",
          definition: "Saved instructions the agent loads when a task matches, often started with a slash command.",
          whyWrong: "A skill is a packaged set of instructions for a task, not a file the agent reads every time.",
        },
        {
          term: "Agent instruction file",
          definition: "A file in your project, such as AGENTS.md, that the agent always reads.",
          whyWrong: "Close: a skill loads only when a task matches; the instruction file is read every time.",
        },
        {
          term: "Doctrine",
          definition: "Spec Kitty's shared library of directives, tactics, procedures and agent profiles.",
          whyWrong: "Close: the charter is one project's pick; doctrine is the shared library it picks from.",
        },
        {
          term: "Charter",
          definition: "Your project's own choice of how-to rules: what it takes from the library, plus its own.",
          whyWrong: "Close: doctrine is the shared library of how-to; the charter is your project's own pick from it.",
        },
      ],
    },
  },
};
