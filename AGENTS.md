# Repository Guidelines

## Project Structure

```
k6/           # k6 load test scripts (JavaScript)
zap/          # OWASP ZAP reports (gitignored)
nuclei/       # Nuclei vulnerability scan reports (gitignored)
lighthouse/   # Lighthouse audit reports (gitignored)
compose.yml   # Docker Compose: k6, InfluxDB, Grafana, ZAP, Nuclei, Lighthouse
```

## Build, Test, and Development Commands

- `pnpm install` installs project dependencies.
- `pnpm lint` runs Oxlint via Vite+.
- `pnpm lint:fix` auto-fixes lint issues.
- `pnpm check` runs format, lint, and type-check via Vite+.
- `pnpm fmt` auto-fixes formatting and lint issues.
- `docker compose up` starts all services.
- `docker compose up -d influxdb grafana` starts only the backing services.
- `docker compose run --rm k6 run /k6/sample.js` executes the sample load test.
- `docker compose run --rm -e K6_OUT= k6 run /k6/sample.js` runs k6 without InfluxDB output.
- `docker compose run --rm zap zap-baseline.py -t https://umaxica.com/ -r baseline-report.html` runs a ZAP baseline scan.
- `docker compose run --rm nuclei` runs a Nuclei vulnerability scan.
- `docker compose run --rm lighthouse` runs a Lighthouse performance audit.
- `docker compose down -v` stops services and removes local metric volumes.

Grafana: `localhost:3000` / InfluxDB: `localhost:8086`

## Coding Style & Naming Conventions

- Formatter/Linter: Vite+ (Oxfmt + Oxlint). Run `pnpm check` before committing.
- Package manager: pnpm (do not use npm, yarn, or bun).
- k6 scripts: JavaScript, 2-space indent, semicolons
- File names: lowercase kebab-case (e.g., `login-loadtest.js`, `checkout-loadtest.js`)
- Place all k6 scripts in `k6/`
- ZAP reports go to `zap/` (gitignored)
- Nuclei reports go to `nuclei/` (gitignored)
- Lighthouse reports go to `lighthouse/` (gitignored)

## Testing Guidelines

No automated test suite yet. Validate by running k6 scripts via Docker Compose and confirming metrics reach Grafana/InfluxDB. Document required environment variables for new scripts.

## Commit & Pull Request Guidelines

Short, imperative commit subjects (e.g., `Add checkout load test`). One change per commit. PRs should include purpose, verification commands, and sample output.
