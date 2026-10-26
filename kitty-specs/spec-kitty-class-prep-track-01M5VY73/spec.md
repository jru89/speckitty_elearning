# Mission Specification: Spec Kitty Class Prep Track

**Mission Branch**: `feat/spec-kitty-class-prep-track`
**Created**: 2026-10-26
**Status**: Draft
**Input**: User description: a light pre-session e-learning for the Spec Kitty class, built as its own standalone app (see Intent Summary).

## Intent Summary

An attendee of the upcoming Spec Kitty class opens the prep course link before the session. The course is a standalone website on the trainer's GitHub Pages. A short intake (operating system, chip, work or personal device, AI coding tool, experience) tailors the course to them. In about 30 minutes they learn the vocabulary the trainer will use and get Git, Python 3.11+ and an AI coding agent working on their own machine. The live session can then start at "install Spec Kitty" instead of debugging setups.

- **Primary actor**: a class attendee, anywhere from near-beginner to daily AI-agent user, on any laptop or desktop and with any AI coding tool Spec Kitty supports.
- **Secondary actor**: the trainer, who shares the link and receives an attendee's setup summary only when the attendee chooses to send it.
- **Trigger**: the attendee opens the prep course link before the session.
- **Outcome**: the attendee arrives with a verified setup and the basic vocabulary, or has told the trainer in advance why they can't.
- **Invariant**: each attendee's answers and progress are theirs alone. They never mix with another attendee or with another app on the same host.
- **Tone**: light and "for your information". English only.
- **Scope boundary**: this is a new, standalone app in its own repository. It does not extend or depend on the trainer's existing onboarding lab, which served only as context.

```mermaid
flowchart LR
  A[Open prep course link] --> B[Welcome: what Spec Kitty is, session agenda]
  B --> C[Intake: OS, chip, device, AI tool, experience]
  C -->|tablet/phone or locked-down device| X[Tell the trainer before the session]
  C -->|new to the terminal| T[Optional: Terminal in 5 minutes]
  T --> D
  C --> D[1. Words you'll hear]
  D --> E[2. Vibe coding vs spec-driven]
  E --> F[3. Get set up, tailored]
  F --> G[4. Ready check]
  G --> H[Copy my setup summary]
  C -->|daily agent user| G
```

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Get a working setup tailored to my machine (Priority: P1)

An attendee answers the intake and then sees only the setup steps for their own operating system, chip, device situation and chosen AI coding tool. They install Git (including their name and email), Python 3.11+ and their AI coding tool, and check each one with a verification step that works on their platform.

**Why this priority**: a broken setup is what costs the live session the most time. This story alone already delivers the main value of the course.

**Independent Test**: choose a combination in the intake (for example macOS + Apple Silicon + personal + Cursor). Confirm the setup module shows only the steps for that combination, and that every step has a way to check it worked.

**Acceptance Scenarios**:

1. **Given** an attendee who answered "Windows, ARM, personal laptop, Claude Code", **When** they open the setup module, **Then** they see the Windows install and verify steps that apply to ARM, the Claude Code install link with its cost note, and no macOS, Linux or other-tool steps.
2. **Given** an attendee on a work laptop who said they cannot install software themselves, **When** they open the setup module, **Then** they first see guidance on what to ask their IT department or how to use another device, and the trainer contact message.
3. **Given** an attendee who chose "help me choose" for the AI tool, **When** they reach the tool step, **Then** they see the supported tools with whether each is free, has a free tier or needs a paid plan, and can pick one, which updates their answers.
4. **Given** an attendee who completed every setup step, **When** they run the generic agent check (open a folder and ask the agent to list its files), **Then** the module tells them what a successful result looks like and what to do if it fails.

---

### User Story 2 - Learn the vocabulary the trainer will use (Priority: P2)

An attendee reads the short "Words you'll hear" and "Vibe coding vs spec-driven" modules, and checks their understanding with a matching exercise and an acceptance-criterion exercise.

**Why this priority**: the session moves faster when everyone already knows what an agent, a skill, a doctrine and a spec are. But an attendee with a working setup and no vocabulary can still follow along.

**Independent Test**: complete both modules and their exercises. Confirm that every term listed in FR-008 is explained and that both exercises give feedback.

**Acceptance Scenarios**:

1. **Given** an attendee in "Words you'll hear", **When** they finish the matching exercise, **Then** each term is matched to its definition and wrong matches get a short explanation.
2. **Given** an attendee in "Vibe coding vs spec-driven", **When** they judge a statement in the acceptance-criterion exercise, **Then** they are told whether it is a testable acceptance criterion and why.
3. **Given** any AI tool chosen in the intake, **When** the attendee reads the vocabulary, **Then** no explanation depends on one specific tool. Tool-specific names appear only as examples.

---

### User Story 3 - Skip what I already know, catch up on what I don't (Priority: P2)

The intake's experience answer changes what the course suggests. A daily AI-agent user is pointed straight to the ready check. Someone new to the terminal is pointed to an optional "Terminal in 5 minutes" primer first. Nothing is locked.

**Why this priority**: it keeps the course light for experienced attendees and safe for beginners, which matches the mixed audience.

**Independent Test**: answer the intake once as "I use AI agents daily" and once as "new to the terminal". Confirm the suggested next step differs and all modules stay reachable in both cases.

**Acceptance Scenarios**:

1. **Given** an attendee who answered "I use AI agents daily", **When** they finish the intake, **Then** they are offered a direct route to the ready check and can still open every module.
2. **Given** an attendee who answered "new to the terminal", **When** they finish the intake, **Then** the terminal primer is suggested before the setup module, with content for their operating system only.

---

### User Story 4 - Confirm I'm ready and tell the trainer (Priority: P3)

An attendee ticks off the ready check and copies a one-line setup summary to send to the trainer if they want to.

**Why this priority**: it gives the trainer a heads-up about setups in the room, but the class works without it.

**Independent Test**: complete the ready check. Confirm the copied summary contains exactly the intake answers and the ready-check status, and nothing is sent anywhere automatically.

**Acceptance Scenarios**:

1. **Given** an attendee who finished the ready check, **When** they press "Copy my setup summary", **Then** a single line like "macOS · Apple Silicon · personal · Cursor · uses AI daily · all checks passed" is copied, or shown for manual selection if copying is not allowed.
2. **Given** an attendee who answered "tablet or phone", **When** they finish the intake, **Then** they immediately see that this setup needs a laptop or desktop and are asked to contact the trainer before the session.

---

### User Story 5 - My experience stays mine (Priority: P1)

Every attendee uses the same hosted site, but each one's intake answers and progress belong to them alone. If two people share one device, the second person can start fresh without seeing the first person's answers.

**Why this priority**: the trainer hosts one site for the whole class. Mixed answers would show people the wrong install steps.

**Independent Test**: on two separate browsers, answer the intake differently and confirm neither sees the other's answers or progress. On one browser that also has data from another app on the same host, use "Not you? Start fresh" and confirm only this course's data is cleared.

**Acceptance Scenarios**:

1. **Given** two attendees on different devices, **When** both use the course, **Then** neither can see or change the other's answers or progress.
2. **Given** one device with saved data from this course and from another app on the same host, **When** the attendee chooses "Not you? Start fresh", **Then** this course's answers and progress are cleared and the other app's data is unchanged.
3. **Given** the trainer hosts other apps on the same GitHub Pages site, **When** an attendee uses this course, **Then** this course's saved data neither reads nor overwrites those apps' saved data.

---

### User Story 6 - Know what the class is and what to bring (Priority: P3)

Before the intake, the attendee sees a short welcome: what Spec Kitty is (with a link to its repository), the session agenda, what to prepare, and that Spec Kitty itself is installed together in the session.

**Why this priority**: the standalone course is the attendee's first contact with the class. It replaces the separate pre-agenda message, but the course still works without it.

**Independent Test**: open the course with no saved data. Confirm the welcome shows the description, the agenda and the "bring" list, and leads into the intake.

**Acceptance Scenarios**:

1. **Given** a first-time visitor, **When** the course opens, **Then** they see the welcome with a "Start" action that leads to the intake.
2. **Given** a returning attendee with saved answers, **When** the course opens, **Then** they land on their course overview with progress, and the welcome stays reachable.

### Edge Cases

- **Wrong intake answer** (for example "macOS" picked by mistake): "Change my answers" is always available, and the content updates immediately.
- **"Not sure" about the chip**: the intake shows how to find the chip type on that operating system and allows "not sure". In that case the setup shows the steps that work on both chip types, with a note where they differ.
- **Old Python already installed**: the setup explains how to check the version and what to do when it is below 3.11, including the different command names (`python`, `python3`, `py`) per OS.
- **Windows "python" opens the Microsoft Store**: the Windows setup names this trap and how to fix it.
- **ChromeOS**: covered through its Linux environment, with a note that it has to be turned on first and may be unavailable on managed Chromebooks.
- **Corporate proxy or blocked AI tools**: the work-laptop guidance says this may happen and suggests a personal device or contacting the trainer.
- **Storage unavailable** (private window, blocked site data): the course still works for the visit, and the attendee is told that answers will not be remembered.
- **Attendee returns days later**: their answers and progress are still there on the same device and browser.
- **AI tool not in the list**: "Other" is allowed, with a note to confirm with the trainer that Spec Kitty supports it.

## Domain Language

| Canonical term | Meaning | Avoid |
|----------------|---------|-------|
| Prep course | This standalone app as a whole | "onboarding lab", "track", "profile" |
| Intake | The short questionnaire at the start of the course | "survey", "onboarding form" |
| AI coding tool | The agent the attendee uses (Claude Code, Codex, Cursor, etc.) | "the AI", "Claude" as a generic term |
| Setup summary | The one-line, attendee-copied description of their setup | "report", "submission" |
| Ready check | The final checklist module | "test", "exam" |

## Requirements *(mandatory)*

### Functional Requirements

| ID | Title | User Story | Priority | Status |
|----|-------|------------|----------|--------|
| FR-001 | Welcome | As a first-time visitor, I want a short welcome explaining what Spec Kitty is (linking to its repository), the session agenda, what to bring, and that Spec Kitty is installed in the session, with a "Start" action, so that I know what I'm preparing for. | Medium | Open |
| FR-002 | Intake questionnaire | As an attendee, I want to answer five short questions (operating system; chip type where it matters; work or personal device and whether I can install software; AI coding tool or "help me choose"; experience level) before the modules start, so that the course fits my situation. | High | Open |
| FR-003 | Platform coverage | As an attendee, I want the intake to offer Windows, macOS, Linux, ChromeOS and "tablet or phone", and chip choices of Intel/AMD, ARM (including Apple Silicon) and "not sure", so that every device is covered. | High | Open |
| FR-004 | Tailored content | As an attendee, I want each module to show only the content that applies to my intake answers, from one shared set of material, so that I don't read steps for other platforms or tools. | High | Open |
| FR-005 | Change answers | As an attendee, I want to change my intake answers at any time and see the content update immediately, so that a wrong answer doesn't leave me with wrong steps. | High | Open |
| FR-006 | Early stop for unsupported devices | As an attendee on a tablet or phone, or on a device where I can't install software, I want to be told right after the intake to contact the trainer before the session, so that I don't discover the problem in the room. | High | Open |
| FR-007 | Course overview | As an attendee, I want an overview of the modules with my progress and a suggested next step, so that I can do the course in any order and see what's left. | High | Open |
| FR-008 | Module 1: Words you'll hear | As an attendee, I want short, tool-neutral explanations of chatbot vs agent, the agentic loop, model, tools, context window, skills and slash commands, agent instruction files (e.g. CLAUDE.md, AGENTS.md, GEMINI.md), doctrine, charter and agent profile, so that I understand the trainer's vocabulary. | High | Open |
| FR-009 | Module 1 exercise | As an attendee, I want a matching exercise that pairs each FR-008 term with its definition and explains wrong matches, so that I can check my understanding. | Medium | Open |
| FR-010 | Module 2: Vibe coding vs spec-driven | As an attendee, I want to learn why loose prompting breaks down on bigger work, and the seven steps (spec, plan, tasks, build, review, accept, merge) with what each produces. I also want one line each on work packages and worktrees, a one-line Bright Factory teaser, and a note that command names differ per AI tool, so that the session's flow is familiar. | High | Open |
| FR-011 | Module 2 exercise | As an attendee, I want to judge example statements as testable acceptance criteria or not, with an explanation for each, so that I'm ready to write criteria in the hands-on part. | Medium | Open |
| FR-012 | Module 3: Git setup | As an attendee, I want install and verify steps for Git on my platform, including setting my name and email, so that Git works before the session. | High | Open |
| FR-013 | Module 3: Python setup | As an attendee, I want install and verify steps for Python 3.11 or newer on my platform, including the per-OS command name and known traps, so that Python works before the session. | High | Open |
| FR-014 | Module 3: AI coding tool | As an attendee, I want, for my chosen tool, whether it is free, has a free tier or needs a paid plan or API key, a link to its official install guide, and a reminder to log in once, so that my agent works before the session. | High | Open |
| FR-015 | Supported tool list | As an attendee who chose "help me choose", I want to see the AI coding tools Spec Kitty supports, with their cost model, and pick one, so that I choose a tool that works in the class. | Medium | Open |
| FR-016 | Generic agent check | As an attendee, I want one verification that works for any AI coding tool (open a folder, ask the agent to list its files), with what success looks like and what to do on failure, so that I know my agent really works. | High | Open |
| FR-017 | Work-device guidance | As an attendee on a work device, I want guidance on admin rights, IT policies and blocked AI tools, with a personal-device alternative, so that I can sort it out before the session. | High | Open |
| FR-018 | Optional pipx/uv head start | As an attendee, I want an optional, clearly marked step to install pipx or uv, so that installing Spec Kitty in the session is faster. | Low | Open |
| FR-019 | Module 4: Ready check | As an attendee, I want a checklist covering Git and Python versions, the agent check passing, being logged in to my AI tool, and bringing laptop and charger, so that I know I'm ready. | High | Open |
| FR-020 | Setup summary | As an attendee, I want a "Copy my setup summary" action that produces one line with my intake answers and ready-check status, with manual selection as a fallback, so that I can send it to the trainer if I choose. | Medium | Open |
| FR-021 | Experience-based suggestions | As an attendee, I want my experience answer to change the suggested next step (daily agent users to the ready check; terminal beginners to the terminal primer first) without locking any module, so that the course respects my level. | Medium | Open |
| FR-022 | Optional terminal primer | As an attendee new to the terminal, I want an optional "Terminal in 5 minutes" module for my operating system (opening a terminal, moving between folders, running and pasting a command, reading an error), so that I can follow the setup steps. | Medium | Open |
| FR-023 | Start fresh | As an attendee on a shared device, I want "Not you? Start fresh" to clear only this course's answers and progress and show the intake again, so that I don't inherit someone else's setup. | High | Open |
| FR-024 | Persistence on return | As an attendee, I want my answers and progress remembered on the same device and browser when I come back, so that I can do the course in several sittings. | Medium | Open |
| FR-025 | Session framing | As an attendee, I want the course to say that the trainer demos in Claude Code and that my tool's commands may look slightly different, so that I know what to expect when following along. | Medium | Open |

### Non-Functional Requirements

| ID | Title | Requirement | Category | Priority | Status |
|----|-------|-------------|----------|----------|--------|
| NFR-001 | Light course | A first-time attendee can finish the four main modules, excluding install download time and the optional primer, in 35 minutes or less. | Usability | High | Open |
| NFR-002 | Short intake | The intake has at most 5 questions and can be answered in under 2 minutes. | Usability | High | Open |
| NFR-003 | Per-attendee isolation | 0 intake answers or progress items are visible to or changeable by anyone using a different device or browser. | Privacy | High | Open |
| NFR-004 | Isolation from other apps on the host | Using or resetting this course changes 0 saved items belonging to any other app on the same host. | Reliability | High | Open |
| NFR-005 | No data leaves the device | 0 network requests carry intake answers or progress. The setup summary leaves the device only when the attendee copies and sends it. | Privacy | High | Open |
| NFR-006 | Platform coverage | 100% of intake platform combinations (each OS × chip, plus "not sure") lead to install and verify steps or to the trainer-contact message, with no dead ends. | Usability | High | Open |
| NFR-007 | Tool neutrality | 0 vocabulary explanations or verification steps require one specific AI coding tool. Tool names appear only as examples or in tool-specific setup blocks. | Usability | High | Open |
| NFR-008 | Phone-width readable | Every page, the intake and the summary are readable and usable at 360px width without horizontal scrolling, so attendees can read along on a phone while installing on a laptop. | Usability | Medium | Open |
| NFR-009 | Offline after first visit | After one visit, the course content opens without a network connection. | Reliability | Low | Open |
| NFR-010 | Fast first view | The welcome is readable within 2 seconds on a typical broadband connection on mid-range hardware. | Performance | Medium | Open |

### Constraints

| ID | Title | Constraint | Category | Priority | Status |
|----|-------|------------|----------|----------|--------|
| C-001 | Standalone app | The course is its own app in its own repository. It does not extend, import from or depend on the trainer's onboarding lab. | Technical | High | Open |
| C-002 | Static hosting | It is hosted on the trainer's GitHub Pages: no server, no accounts, no database, no analytics. | Technical | High | Open |
| C-003 | English only | All course content is in English. | Business | High | Open |
| C-004 | Spec Kitty installed live | The course does not install or configure Spec Kitty itself. That happens during the session. | Business | High | Open |
| C-005 | Bright Factory reserved | The Bright Factory gets at most a one-line teaser. Its full explanation is reserved for the session. | Business | Medium | Open |
| C-006 | Link, don't copy, tool installs | AI coding tool installs link to each tool's official documentation rather than copying their steps, so the course doesn't go stale. Git and Python steps may be written out. | Business | Medium | Open |
| C-007 | Supported tools | The tool list matches the AI coding tools Spec Kitty supports at build time (currently Claude Code, Codex, Cursor, Gemini, GitHub Copilot, Windsurf, OpenCode, Qwen, Kiro, Vibe, Pi, Letta, Antigravity), plus "Other". | Business | Medium | Open |

### Key Entities

- **Intake answers**: one attendee's choices for operating system, chip type, device situation (work or personal, can install or not), AI coding tool and experience level. They belong to one browser on one device and can be changed or cleared.
- **Course progress**: which modules, exercises and ready-check items this attendee has completed. Kept separately from any other app's data on the same host.
- **Content block**: a piece of module content labelled with the intake answers it applies to (for example "macOS" or "work device"). It is shown only when the attendee's answers match.
- **AI coding tool entry**: a supported tool's name, cost model (free, free tier, paid plan or API key) and official install link.
- **Setup summary**: a one-line text built from the intake answers and ready-check status. It exists only when the attendee copies it.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 90% of attendees who complete the ready check have Git, Python 3.11+ and a working AI coding tool at the start of the session. The Spec Kitty install step starts within 10 minutes of the session start.
- **SC-002**: Every attendee who can't set up (tablet, phone, locked-down device) is identified to the trainer before the session, not in the room.
- **SC-003**: An attendee sees setup steps for exactly one operating system and one AI coding tool, the ones they chose, in 100% of intake combinations, except "not sure" for chip type.
- **SC-004**: An experienced AI-agent user can go from opening the course to a completed ready check in under 10 minutes.
- **SC-005**: In a test with two browsers and a shared-device reset, 0 answers or progress items leak between attendees or into other apps on the host.

## Assumptions

- There are no accounts or named profiles. Individuality comes from per-device, per-browser storage.
- The trainer demos in Claude Code. Attendees using other tools follow along with equivalent commands.
- The supported AI tool list and their cost models are checked once at build time. Keeping them current afterwards is the trainer's job.
- Attendees use their own laptop or desktop. Shared or classroom machines are handled by "Start fresh".
- The trainer shares the course link directly with attendees. The course is open to anyone with the link, with no passphrase (decided in planning, DM-01M5VYBRKQP26GTMKW59AV37NF).
- Discovery decisions are recorded in this mission's `decisions/` folder.
