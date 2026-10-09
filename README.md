# Tasko

The Next.js frontend uses the FastAPI backend in `Tasko-BE`. Visitors see a public landing page at `/`, with dedicated `/login` and `/register` views. Signed-in users see their dashboard at `/`. All workspace data comes from the API. Empty accounts start with no teams, projects, tasks, or events; no sample data is seeded or used as a fallback. The public illustrations are decorative brand artwork.

## Local development

1. Configure `Tasko-BE/.env` using `Tasko-BE/.env.example` if needed. For the default frontend URL, use `ALLOWED_ORIGINS=["http://localhost:3000"]` and `COOKIE_SECURE=false` for local HTTP.
2. From `Tasko-BE`, run `docker compose up --build -d`.
3. From the repository root, run `npm install` and `npm run dev`. On PowerShell systems that block npm scripts, use `npm.cmd`.
4. Open `http://localhost:3000`, create an account, sign in, and create a team. Use Add Task to create your first project and task together, or create a project on the dashboard. Add other registered users by their exact email.

The frontend defaults to `http://localhost:8000/api/v1`. To use another API, copy the root `.env.example` to `.env.local` and change `NEXT_PUBLIC_API_URL` (include `/api/v1`). Restart the frontend after changing it. Production builds embed this browser-visible URL at build time.

Use the same hostname for frontend and backend in local development (for example, `localhost` for both). Every API call sends the session cookie. The CSRF token stays in memory and is restored from `/auth/session` after a reload. Session credentials are never stored in localStorage.

## Connected workflows

- Dashboard: current project counts and completion progress, monthly task completions, projects, actual team assignments, upcoming events, and saved timers.
- Tasks: create, search, filter by status/priority/due date, edit, assign, and complete/reopen tasks. Updates send the backend version to detect conflicting edits.
- Calendar: actual month lengths and weekday alignment, month navigation, date selection, and team event creation. Event dates display in the browser's local timezone.
- Team: real member names, roles, job titles, email addresses, and active task counts.
- Timesheets: members submit a work date, assigned task, hours/minutes, and work summary. Members see only their own history; team owners see all member submissions with member/date filters and pagination. Submitted entries are immutable and preserve the original member, task, and project names. Manual timesheets are separate from the dashboard timer.
- Analytics: current-year completion metrics (UTC), only actual completion dates, project distribution, and JSON report download. Members see their own assigned-task completion metrics and total working hours from all their submitted timesheets. Owners see team task metrics. Empty dates and months are omitted.
- Settings: owners can set the active team's organisation name and exact member email domain (for example, `whitecode.com`). All existing member emails must match when changing the domain. Profile and notification/appearance preferences are saved separately. Dark mode changes immediately; Save Changes persists it to your account. Notification delivery is not implemented by the backend; these controls persist preferences only.
- Logout: revokes the backend session before returning to sign-in.

Registration asks for an Owner or Member account role (Member is the default). Only Owner accounts can create teams. Member accounts without a team see Join your team and can check for access after an owner adds their registered email. Roles cannot be changed through profile settings. Legacy accounts are classified on login or session access: existing team owners remain Owners; other accounts become Members.

Owners enter an organisation name and email domain when creating teams. Member emails must match the domain exactly when joining: `karan.talekar@whitecode.com` matches `whitecode.com`; `whitecode@other.com` and subdomains do not. Registration does not grant team access. Existing teams without an email domain must configure one in owner Settings before adding more members. Older API clients that omit organisation fields create teams constrained to the owner's email domain.

Owners manage projects, tasks, members, and events in the teams they own. Members can create tasks in existing team projects, assigned to themselves, edit their assigned tasks, and track time. Members cannot create projects or teams or assign tasks to others; the backend enforces these permissions. Teams are selected explicitly, and data from a previous selection is cleared while the next workspace loads. API failures show an error and retry action.

List requests follow API pagination rather than showing only the first page. Very large datasets beyond the API's maximum offset produce an explicit error instead of silently displaying incomplete totals.

Members can also add calendar events in their teams through Calendar → Add Event. Editing existing events remains a team-owner permission.

For HTTPS deployments, configure secure cookies and an exact frontend origin on the backend. Frontend and API should be deployed under the same site because the session cookie uses SameSite=Lax. See `Tasko-BE/README.md` for backend deployment configuration.

## Verification

Run `npm run build` for the production build and TypeScript validation. Backend tests are available with `docker compose -f compose.test.yaml up --build --abort-on-container-exit --exit-code-from tests` from `Tasko-BE`; they use disposable databases.

`NEXT_DIST_DIR` optionally selects a separate Next.js build directory for running an isolated preview alongside the normal development server.
