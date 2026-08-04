# Contributing to Nocciolo

Thanks for your interest in contributing. Nocciolo is being developed in public and we welcome thoughtful collaboration.

## Getting Started

1. Read the [README](./README.md) and [ROADMAP](./ROADMAP.md) to understand the current focus.
2. Review [AGENTS.md](./AGENTS.md) — it contains the project principles that apply to both human and AI contributors.
3. Look at open issues. Early-stage issues are the best place to start.

## Development Setup

```bash
git clone <repo-url>
cd nocciolo
pnpm install
pnpm build
pnpm test
node dist/cli.js --help
```

Useful scripts: `pnpm build`, `pnpm test`, `pnpm typecheck`, `pnpm start -- <command>`.

## How to Contribute

### Issues

- Search existing issues before opening a new one.
- Use clear titles and include reproduction steps or concrete examples when reporting bugs.
- For feature ideas, explain the problem you’re trying to solve and how it fits the current roadmap.

### Pull Requests

- Keep PRs focused. Small, reviewable changes are preferred over large ones.
- Update documentation (README, ROADMAP, AGENTS.md) when behavior or public surface changes.
- Prefer adding tests for core domain logic (extraction, bank templates, etc.) when practical.
- Follow the coding standards outlined in `AGENTS.md` and the Cursor rules.

### Commit Messages

Use clear, conventional messages:

```
feat: add bank template validation
fix: handle missing ADR directory gracefully
docs: clarify durable knowledge criteria
chore: update dependencies
```

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Questions

Open a discussion or issue. Early feedback on architecture and DX is especially valuable while the foundation is still forming.
