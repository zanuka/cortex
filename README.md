# Nocciolo

**Company brain config for AI agents.**

Nocciolo (Italian for kernel / core) fits the vision well — the durable core of project knowledge that agents inherit.

## Goal 

Seed Hindsight memory banks from durable project docs, ADRs, and decisions so agents inherit shared context instead of rediscovering it every session.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status: Early](https://img.shields.io/badge/Status-Early%20%2F%20Public-orange)]()

---

## The Problem

AI coding agents start every session cold.

They re-learn architecture decisions, coding standards, domain invariants, and “why we built it this way” from scattered READMEs, ADRs, comments, and tribal knowledge. That wastes tokens, produces inconsistent output, and breaks long-running agentic workflows.

Traditional documentation is written for humans. Agent memory systems need structured, durable, queryable knowledge with clear missions and boundaries.

## The Vision

Nocciolo is the **company brain config** layer.

It turns the durable knowledge already living in your repository into a properly configured memory bank that agents can retain, recall, and reflect against — starting with [Hindsight](https://hindsight.vectorize.io).

Agents inherit shared context instead of rediscovering it.

## What Nocciolo Does

- **Scans** your project for durable knowledge (READMEs, ADRs, standards, domain docs, schemas)
- **Configures** a Hindsight memory bank with a clear mission, directives, and extraction settings tuned for software projects
- **Seeds** the bank with high-signal facts and decisions so agents start with real context
- **Emits** the configs and MCP snippets needed to wire the bank into Cursor, Claude Code, Roo, and other agent harnesses
- **Stays local-first** — you control the data and the hosting

Later versions will support additional memory backends, event-driven updates, and richer curation tools.

## Quick Start (Coming Soon)

```bash
# From your project root
npx @nocciolo-ai/cli init

# Configure a Hindsight bank for this project
nocciolo configure

# Seed durable knowledge into the bank
nocciolo seed

# Emit MCP / agent config snippets
nocciolo mcp
```

The CLI is under active development. The goal is a zero-to-useful bank in under five minutes.

## Core Principles

- **Durable over ephemeral** — only knowledge that should outlive a single session or model change
- **Local control** — self-hostable, version-controlled, no forced cloud dependency
- **Agent-native** — missions, directives, and structure that map cleanly to how modern memory systems actually work
- **Traditional craft first** — clear architecture, ADRs, and standards remain the source of truth; Nocciolo amplifies them for agents
- **Progressive** — start simple (single bank, one project), grow into multi-bank, multi-repo, and event-driven workflows

## Status

Nocciolo is in the earliest public stage. We are building in the open.

See [ROADMAP.md](./ROADMAP.md) for the high-level phased plan.

## Contributing

Issues, ideas, and PRs are welcome once the foundation lands. For now the best way to help is feedback on the vision and the initial CLI surface.

## License

MIT

