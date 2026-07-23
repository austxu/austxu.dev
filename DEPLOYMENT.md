# austxu.dev deployment map

The visitor-facing frontends are Cloudflare Pages projects. Python services stay on
Render Free so the model runtimes are not forced into a Workers-compatible rewrite.

## Cloudflare Pages

| Purpose | Pages project | Production URL | Custom domain status |
| --- | --- | --- | --- |
| Portfolio | `austxu-dev` | `https://austxu.dev` ([preview](https://austxu-dev.pages.dev)) | Pages binding pending DNS/certificate |
| Coup frontend | `coup` | `https://coup.austxu.dev` ([preview](https://coup-9ev.pages.dev)) | Pages binding pending DNS/certificate |
| Heston frontend | `heston` | `https://heston.austxu.dev` ([preview](https://heston.pages.dev)) | Pages binding pending DNS/certificate |

The custom domains have been registered with Pages. If Cloudflare does not create the DNS
records automatically, add these CNAMEs in the `austxu.dev` zone:

```text
@       -> austxu-dev.pages.dev
coup    -> coup.pages.dev
heston  -> heston.pages.dev
```

The older `coup-staging` and `heston-staging` Pages projects remain as rollback artifacts;
their staging custom-domain bindings have been removed.

## Render

`render.yaml` defines one Render project named `austxu.dev` with one `production` environment
and two web services:

- `coup-api` — Flask-Socket.IO + the Gen5 1v1 PyTorch bot.
- `heston-api` — FastAPI/WebSocket service, synthetic mode enabled, Redis optional.

The production frontends use these service URLs:

```text
https://coup-api.austxu.dev
https://heston-api.austxu.dev
```

Create/sync the Blueprint from the Render dashboard. Do not paste secrets into chat; the
Blueprint generates the Coup `SECRET_KEY`, and all other environment values are non-secret.
The existing Railway `chic-passion` project remains available as a rollback path.

## Production gate

The production domains are wired, but keep the playable/demo CTA quiet until these pass:

1. `GET /health` returns ready/healthy.
2. Coup supports two simultaneous isolated games and rejects malformed actions.
3. Heston serves synthetic REST responses and completes one calibration WebSocket.
4. CORS accepts only the exact production frontend origins.

Render Free services can sleep and have cold starts; the frontends therefore render their
shells before attempting backend readiness checks. They are demos, not an always-on SLA.
