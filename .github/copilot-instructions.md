# Copilot Instructions

## Build, lint, and verification commands

- Use `pnpm` only. Install dependencies with `pnpm install`.
- Lint with `pnpm lint`.
- Run the repository-wide checks with `pnpm check`. `pnpm fmt`, `pnpm lint:fix`, and `pnpm check:fix` apply the Vite+ fixes.
- There is no automated unit test suite. The smallest repeatable validation is to run one tool invocation directly:
  - Single k6 script: `docker compose run --rm -e K6_OUT= k6 run /k6/sample.js`
  - Any other k6 script: `docker compose run --rm -e K6_OUT= k6 run /k6/<script>.js`
  - ZAP baseline scan: `docker compose run --rm zap zap-baseline.py -t https://umaxica.com/ -r baseline-report.html`
  - Nuclei default scan: `docker compose run --rm nuclei`
  - Lighthouse default audit: `docker compose run --rm lighthouse`
- Start backing services for metrics with `docker compose up -d influxdb grafana`. Run `docker compose down -v` to remove local metric volumes.

## High-level architecture

- This repository is an orchestration repo for QA/security/performance tooling, not an application service. Most of the behavior lives in `compose.yml`, the tool-specific output directories, and the k6 scripts under `k6/`.
- `compose.yml` wires together:
  - `k6` for load tests, mounting `./k6` into the container and defaulting `K6_OUT` to `influxdb=http://influxdb:8086/k6`
  - `influxdb` and `grafana` for collecting and visualizing k6 metrics locally
  - `zap`, `nuclei`, and `lighthouse` as disposable scanner/audit containers that write reports into mounted host directories
- Because `k6` defaults to InfluxDB output in Compose, direct `docker compose run k6 ...` commands require `influxdb` to be running unless `-e K6_OUT=` is passed to disable metric export.
- The repository currently contains one example load script, `k6/sample.js`, which performs a simple GET check against `https://umaxica.net/`. New load tests should follow that pattern and live in `k6/`.
- `sqlmap/`, `testssl/`, and `ffuf/` are present as report/output locations but are still placeholders in the current repo state.

## Key conventions

- Treat this as an authorized-testing repo. Existing docs explicitly frame the tooling as for approved targets only; keep examples and instructions aligned with that assumption.
- Keep k6 scripts in `k6/`, use lowercase kebab-case file names such as `login-loadtest.js`, and keep the existing JavaScript style: 2-space indentation and semicolons.
- Output artifacts are expected in the tool directories at the repo root (`zap/`, `nuclei/`, `lighthouse/`, and the placeholder report directories). Those report files are gitignored; generated results should stay there instead of being moved elsewhere.
- Prefer Docker Compose entrypoints already defined in `compose.yml` over ad hoc local tool execution. The repo is set up so commands run inside containers with mounted output directories.
- The repo's linting/config surface is intentionally small: `vite.config.ts` only customizes Vite+ lint ignore patterns for `dist/**` and `node_modules/**`.
