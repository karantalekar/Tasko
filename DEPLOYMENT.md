# Tasko production deployment

The frontend is a Next.js server application. The backend is FastAPI with MongoDB
and Redis. Deploy both services; uploading the frontend alone is insufficient.

## Domains and configuration

Use HTTPS and domains sharing the same parent domain, for example `example.com`
for the frontend and `api.example.com` for the API. Login uses a host-only,
HttpOnly, SameSite=Lax session cookie on the API. Unrelated frontend/API domains
can prevent browser authentication.

Set `NEXT_PUBLIC_API_URL=https://api.example.com/api/v1` in the frontend hosting
environment before `npm run build`. This URL is embedded in the browser bundle;
changing it requires a new build. The build checked locally uses the development
API URL and must be rebuilt with your live URL before publication.

Backend settings must include `ENVIRONMENT=production`, `COOKIE_SECURE=true`,
and `ALLOWED_ORIGINS=["https://example.com"]`. Include the precise frontend
origin without a path or trailing slash. Add a www origin only if that hostname
is also served. Use the production example files as templates, and keep actual
credentials outside source control.

## Services

Frontend build: `npm ci` followed by `npm run build`. Run the built application
with `npm start` behind HTTPS, or use a Next.js-compatible hosting service.
Use `npm.cmd` on PowerShell if scripts are blocked.

Backend on a Docker host: configure `Tasko-BE/.env`, then run
`docker compose up --build -d` in `Tasko-BE`. Its API port is bound to
`127.0.0.1:8000`; configure an HTTPS reverse proxy on the host to forward the API
domain to that port. MongoDB and Redis remain on the private Docker network.
If using a managed backend host instead, deploy the runtime Dockerfile stage
and supply reachable MongoDB/Redis URLs through the hosting environment.
The included Compose file overrides database URL variables, so it is for the
included database containers rather than external managed databases.

Persist and back up the MongoDB volume or managed database. Never run
`docker compose down -v` against production data. Redis is required for the
rate limiter as well as caching. MongoDB indexes are created at startup with
the supplied settings.

## Verification before publication

- Run `npm run build`, backend `pytest -q`, and `ruff check app tests`.
- Confirm the public API `/health/ready` returns 200 through HTTPS.
- On the live domains, verify owner/member sign-in and logout, organisation
  settings, member addition, task editing, timesheet submission/history, and
  analytics. A successful HTML response alone does not verify browser cookies
  or CORS.
- Use `npm start` for production, rather than `npm run dev`.

Local release check on 2026-10-09: production frontend build and Python lint
passed; 24 backend tests passed using isolated mongomock/fakeredis. A broken
Tasks page import was corrected. Live-domain browser authentication still
requires verification after the hosting domains are configured.
