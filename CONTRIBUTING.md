# Contributing

Please follow these guidelines to keep the repository healthy.

Branch naming and protection
- Protect `main` (keep branch protection on).
- Use feature branches for work: prefixes such as `feature/`, `fix/`, `copilot/`, `vercel/`.
- Do NOT protect ephemeral feature branches. Keep protection for main and long-lived release branches only.

Pull request rules
- Open PRs against `main`.
- Use the PR template.
- Ensure CI (type-check, lint, build) passes before requesting reviewers.
- After merge, branches will be auto-deleted if the repository setting is enabled, and scheduled pruning will remove stale branches.

Reverts
- Avoid long chains of revert PRs. If a revert is necessary, explain why in the PR body and coordinate with maintainers.

Repository settings (recommended)
- Enable "Delete branch on merge".
- Require status checks before merging to main: the CI workflow should be required.
- Limit who can push to protected branches.

If you have any questions, open an issue or contact maintainers.
