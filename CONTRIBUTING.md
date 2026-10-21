# Contributing

## Workflow
1. Create a focused branch from the agreed base branch.
2. Keep changes small and related to one task.
3. Follow the architecture and security documents.
4. Add or update tests for changed behavior.
5. Run lint, typecheck, tests, and production build where available.
6. Update documentation for schema, environment, deployment, or behavior changes.
7. Open a pull request with summary, testing evidence, screenshots for UI changes, and known risks.

## Branch naming
- `feat/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`
- `chore/<short-description>`

## Commit style
Prefer concise conventional commits, for example:
- `feat(catalog): add category filters`
- `fix(checkout): prevent duplicate order creation`
- `docs(architecture): document R2 image storage`

## Required review checks
- No secrets or personal/customer data.
- No public exposure of supplier costs or supplier URLs.
- No client-trusted prices, inventory, roles, or payment status.
- Responsive and accessible behavior checked.
- Tests and build status reported honestly.
