# School Voting Desktop

Electron desktop client for the existing School Voting Django REST API.

The backend and web frontend are not copied or changed here. This desktop app is its own Electron + React + Vite client and uses Axios through a secure Electron IPC bridge, so API calls go to the same Django backend URL configured in `.env`.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure the backend URL in `.env`:

```env
API_URL=http://127.0.0.1:8000
```

3. Run the Django backend from the existing `backend` folder.

4. Start the desktop app:

```bash
npm run dev
```

## Production Run

Build the renderer, then open it in Electron:

```bash
npm run build
npm start
```

## Main Files

| File | Purpose |
| --- | --- |
| `src/main/main.js` | Electron main process, window creation, Axios proxy, optional role lookup |
| `src/main/preload.js` | Safe bridge exposed to React |
| `src/renderer/api/apiClient.js` | Axios client used by all desktop API calls |
| `src/renderer/api/auth.js` | Login using `/api/token/` |
| `src/renderer/api/modules.js` | Generic CRUD helpers for `/api/v1/.../` endpoints |
| `src/renderer/views` | Desktop screens |

## Backend Endpoints Used

| Module | Endpoint |
| --- | --- |
| Auth token | `/api/token/` |
| Schools | `/api/v1/schools/` |
| Departments | `/api/v1/departments/` |
| Courses | `/api/v1/courses/` |
| Students | `/api/v1/students/` |
| Facilitators | `/api/v1/facilitators/` |
| Elections | `/api/v1/elections/` |
| Partylists | `/api/v1/partylists/` |
| Candidates | `/api/v1/candidates/` |
| Votes | `/api/v1/votes/` |
| Registrations | `/api/v1/registrations/` |

## Notes

The optional `DB_*` values are only used for mapping a Django user to `admin`, `staff`, or `student` after login. All normal voting data still goes through the Django backend API.
