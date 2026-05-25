# Infrastructure — {Project Name}

The project-owned operational source of truth for the **devops** agent. This is
the devops equivalent of `design-system.md`: the toolkit ships static devops
*rules* (`.claude/agent-rules/devops/rules/`); this file holds the project-specific
*decisions* — what is actually deployed, where, and how.

Keep it current — the devops agent reads it to understand the live system.

---

## Deploy targets

| Environment | Platform | URL | Notes |
| ----------- | -------- | --- | ----- |
| Production  | {e.g. Railway / Vercel / Fly} | {url} | |
| Staging     | {platform} | {url} | |
| Preview     | {platform / per-PR} | — | |

## Services

List each deployed service/app and its role.

| Service | Platform | Runtime | Notes |
| ------- | -------- | ------- | ----- |
| {web}   | {platform} | {e.g. Node 22} | |
| {api}   | {platform} | {runtime} | |
| {worker}| {platform} | {runtime} | |

## Data stores

| Store | Type | Provider | Backup policy |
| ----- | ---- | -------- | ------------- |
| {primary db} | {Postgres / ...} | {provider} | {cadence, retention} |

## Environment variables

The canonical inventory. Keep `.env.example` in sync with this table. Never
record secret *values* here — only names, purpose, and where the value lives.

| Variable | Purpose | Set in |
| -------- | ------- | ------ |
| {DATABASE_URL} | {…} | {platform secret store} |

## Domains & DNS

| Domain | Points to | Registrar / DNS |
| ------ | --------- | --------------- |
| {example.com} | {production} | {provider} |

## CI/CD pipeline

- **Trigger**: {e.g. push to main, PR}
- **Stages**: {lint → test → build → deploy}
- **Quality gates**: {what blocks a deploy}
- **Deploy method**: {auto on merge / manual promote}
- **Rollback**: {how to roll back a bad deploy}

## Monitoring & alerts

- **Logs**: {where}
- **Metrics / uptime**: {where}
- **On-call / alert channel**: {where alerts land}

## Operational notes

Anything else the devops agent should know: known gotchas, manual steps,
maintenance windows, scaling limits, cost ceilings.
