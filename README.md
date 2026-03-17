# umaxica-qa-test-performance

Load testing (k6), security scanning (OWASP ZAP, Nuclei), and frontend performance auditing (Lighthouse) for umaxica.

## Acknowledgement

This repository is for authorized testing only.

DDoS, request flooding, or any other disruptive testing against systems you do not own or do not have explicit permission to test may result in account termination, service blocking, civil liability, and criminal penalties depending on the jurisdiction.

## Structure

```
k6/           # k6 load test scripts
zap/          # OWASP ZAP reports output
nuclei/       # Nuclei vulnerability scan reports output
lighthouse/   # Lighthouse audit reports output
compose.yml   # k6, InfluxDB, Grafana, ZAP, Nuclei, Lighthouse
```

## k6 Load Testing

Run k6 only:

```bash
docker compose run --rm -e K6_OUT= k6 run /k6/sample.js
```

Run with InfluxDB + Grafana:

```bash
docker compose up -d influxdb grafana
docker compose run --rm k6 run /k6/sample.js
```

Run a different script:

```bash
docker compose run --rm -e K6_OUT= k6 run /k6/login-loadtest.js
```

Endpoints:

- Grafana: `http://localhost:3000`
- InfluxDB: `http://localhost:8086`

## OWASP ZAP Security Scanning

| Mode | Description |
|------|-------------|
| **Baseline** | Passive scan. Headers, cookies, common misconfigs. Safe for production. |
| **Full** | Passive + active. SQLi, XSS, etc. Only on authorized targets. |
| **API** | Scans OpenAPI/Swagger definitions. |

```bash
# Baseline Scan
docker compose run --rm zap zap-baseline.py -t https://umaxica.com/ -r baseline-report.html

# Full Scan
docker compose run --rm zap zap-full-scan.py -t https://umaxica.com/ -r full-report.html

# API Scan
docker compose run --rm zap zap-api-scan.py -t https://umaxica.com/api/openapi.json -f openapi -r api-report.html
```

Reports are generated in the `zap/` directory.

## Nuclei Vulnerability Scanning

Template-based vulnerability scanner. Detects CVEs, misconfigurations, exposed panels, etc.

```bash
# Default scan (all templates)
docker compose run --rm nuclei

# Specific templates
docker compose run --rm nuclei -u https://umaxica.com/ -t cves/ -o /results/cves.txt

# Severity filter
docker compose run --rm nuclei -u https://umaxica.com/ -severity critical,high -o /results/critical.txt
```

Reports are generated in the `nuclei/` directory.

## Lighthouse Performance Audit

Measures Core Web Vitals, accessibility, SEO, and best practices from a browser perspective.

```bash
# Default audit (HTML + JSON)
docker compose run --rm lighthouse

# Mobile audit (default)
docker compose run --rm lighthouse https://umaxica.com/ --output=html,json --output-path=/lighthouse/report --chrome-flags="--no-sandbox --headless"

# Desktop audit
docker compose run --rm lighthouse https://umaxica.com/ --output=html,json --output-path=/lighthouse/desktop --preset=desktop --chrome-flags="--no-sandbox --headless"
```

Reports are generated in the `lighthouse/` directory.

## Cleanup

```bash
docker compose down
docker compose down -v              # also remove metric volumes
docker compose down --remove-orphans
```

## Pre-test Checks

- Test only systems you own or are explicitly authorized to test
- Confirm traffic window, expected load, source IPs, and dependent systems first
- Review provider-specific rules before sending traffic

### Cloudflare

Reference: https://developers.cloudflare.com/fundamentals/reference/scans-penetration/

- Test only assets you control
- Do not target `*.cloudflare.com`
- Avoid disruptive scanning rates
- Exclude `/cdn-cgi/` unless needed

### Fastly

Reference: https://docs.fastly.com/products/security-testing-your-service-behind-fastly

- Test only authorized services
- Contact Fastly Support at least two business days before the test
- Wait for Fastly approval before starting

### AWS

Reference: https://aws.amazon.com/jp/security/penetration-testing/

- Stay within AWS's permitted services and testing scope
- Do not run DoS, DDoS, flooding, or similar disruptive tests

### Google Cloud

Reference: https://docs.cloud.google.com/run/docs/about-load-testing

- Check service health, scaling limits, and quotas first
- Coordinate in advance if the test may exceed default limits

### Vercel

Reference: https://vercel.com/kb/guide/what-s-vercel-s-policy-regarding-load-testing-deployments

NOTICE:

- Treat load testing on Vercel as prohibited by default
- Do not run load tests unless Vercel has explicitly approved them in advance

## Troubleshooting

`lookup influxdb ... no such host`

- `influxdb` is not running, but `K6_OUT` is enabled
- Fix: start `influxdb` first or pass `-e K6_OUT=` to disable output
