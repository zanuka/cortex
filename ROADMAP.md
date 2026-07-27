# Nocciolo Roadmap

High-level phased plan. This is a living document — priorities will shift based on real usage and feedback as we build in public.

## Phase 0 — Foundation (Now)

- [x] Repository created
- [x] README + vision
- [ ] Basic project structure and TypeScript CLI skeleton
- [ ] MIT license, contributing guidelines, CODE_OF_CONDUCT
- [ ] GitHub project board / issue templates for public development

**Goal:** Clean starting point that makes the vision obvious and invites early feedback.

## Phase 1 — Core CLI + Hindsight Bank Config

- [ ] `nocciolo init` — detect project root, scaffold `.nocciolo/` config
- [ ] Bank template generation for Hindsight (mission, directives, extraction settings)
- [ ] Sensible defaults for typical full-stack / web projects
- [ ] `nocciolo configure` — interactive + non-interactive bank setup
- [ ] Basic validation and dry-run support

**Goal:** A developer can point Nocciolo at a repo and get a ready-to-apply Hindsight bank template in under a minute.

## Phase 2 — Knowledge Curation & Seeding

- [ ] Project scanner for durable sources (README, `/docs`, ADRs, AGENTS.md, standards, key schemas)
- [ ] Extraction heuristics that prefer decisions, invariants, and architecture over ephemeral content
- [ ] `nocciolo seed` — retain high-signal knowledge into the configured bank with provenance
- [ ] Incremental / re-seed support
- [ ] Simple provenance tracking (source file + commit)

**Goal:** Agents start sessions with real project context instead of an empty bank.

## Phase 3 — Local Hosting & Agent Integration

- [ ] Docker / local Hindsight helper (`nocciolo docker` or equivalent)
- [ ] MCP endpoint generation for Cursor, Claude Code, Roo, Codex, etc.
- [ ] `nocciolo mcp` — emit ready-to-paste configs and rules
- [ ] Optional updates to `AGENTS.md` / Cursor rules that tell agents to prefer the project bank
- [ ] Single-bank focus (multi-bank later)

**Goal:** End-to-end path from repo → configured bank → agent that actually uses it.

## Phase 4 — Reliability & Developer Experience

- [ ] Status / health commands
- [ ] Better error messages and recovery paths
- [ ] Config schema + validation
- [ ] Test coverage for core extraction and template logic
- [ ] Documentation site or expanded examples

**Goal:** The tool feels solid enough for daily use on real projects.

## Phase 5 — Advanced & Extensibility

- [ ] File watcher / event-driven re-seeding
- [ ] Multi-provider support (Hindsight first, then others)
- [ ] Multi-bank and multi-repo company brains
- [ ] Mental model curation helpers
- [ ] Lightweight inspection UI (optional, later)
- [ ] Deeper ADR and decision-record parsers

**Goal:** Nocciolo becomes the durable knowledge layer that agentic workflows can reliably build on.

---

### Guiding Constraints

- Prefer local control and self-hosting
- Amplify existing engineering practices (ADRs, standards, clear architecture) rather than replace them
- Keep the CLI fast and the happy path short
- Stay focused on knowledgebases and agent context before expanding into broader agent orchestration

Feedback and real-world usage will reshape this plan. Open issues or discussions are the best way to influence direction.
