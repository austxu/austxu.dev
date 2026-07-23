# austxu.dev deployment map

The visitor-facing frontends are Cloudflare Pages projects. Python services stay on
Render Free so the model runtimes are not forced into a Workers-compatible rewrite.

## Cloudflare Pages

| Purpose | Pages project | Staging URL | Custom domain status |
| --- | --- | --- | --- |
| Portfolio | `austxu-dev` | `https://austxu-dev.pages.dev` | `austxu.dev` and `staging.austxu.dev` pending DNS/certificate |
| Coup frontend | `coup-staging` | `https://coup-staging.pages.dev` | `staging.coup.austxu.dev` pending DNS/certificate |
| Heston frontend | `heston-staging` | `https://heston-staging.pages.dev` | `staging.heston.austxu.dev` pending DNS/certificate |

The custom domains have been registered with Pages. If Cloudflare does not create the DNS
records automatically, add these CNAMEs in the `austxu.dev` zone:

```text
staging           -> austxu-dev.pages.dev
staging.coup      -> coup-staging.pages.dev
staging.heston    -> heston-staging.pages.dev
```

The apex `austxu.dev` is attached to `austxu-dev`; its certificate remains pending until
Cloudflare completes the zone validation. Production Coup/Heston domains are intentionally
not attached yet.

## Render

`render.yaml` defines one Render project named `austxu.dev` with one `staging` environment
and two web services:

- `coup-api-staging` — Flask-Socket.IO + the Gen5 1v1 PyTorch bot.
- `heston-api-staging` — FastAPI/WebSocket service, synthetic mode enabled, Redis optional.

The frontends use these service URLs during staging:

```text
https://coup-api-staging.onrender.com
https://heston-api-staging.onrender.com
```

Create/sync the Blueprint from the Render dashboard. Do not paste secrets into chat; the
Blueprint generates the Coup `SECRET_KEY`, and all other environment values are non-secret.
The existing Railway `chic-passion` project remains available as a rollback path.

## Cutover gate

Do not attach `coup.austxu.dev` or `heston.austxu.dev` until these pass against the Render
services:

1. `GET /health` returns ready/healthy.
2. Coup supports two simultaneous isolated games and rejects malformed actions.
3. Heston serves synthetic REST responses and completes one calibration WebSocket.
4. CORS accepts only the exact staging/production frontend origins.

Render Free services can sleep and have cold starts; the frontends therefore render their
shells before attempting backend readiness checks. They are demos, not an always-on SLA.
