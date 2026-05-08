/**
 * src/renderer/state/permissions.js
 *
 * Role → permission map and module registry.
 *
 * Backend permission classes (api/permissions.py):
 *   IsFacilitator → hasattr(request.user, 'facilitator')  → maps to 'staff' / 'admin'
 *   IsStudent     → hasattr(request.user, 'student')       → maps to 'student'
 *   IsAuthenticated → all logged-in users
 *
 * Endpoints from backend api/urls.py (all under /api/v1/):
 *   registrations, students, candidates, partylists, elections,
 *   facilitators, departments, courses, schools, votes
 */

export const ROLE_PERMISSIONS = {
  admin: ['*'],
  staff: [
    'students.*',
    'candidates.*',
    'partylists.*',
    'elections.*',
    'facilitators.*',
    'departments.*',
    'courses.*',
    'schools.*',
    'registrations.*',
    'votes.read'
  ],
  student: [
    'candidates.read',
    'partylists.read',
    'elections.read',
    'vote.cast'
  ]
};

export const MODULES = {
  registrations: {
    label: 'Registrations',
    endpoint: '/api/v1/registrations/',
    permissionModule: 'registrations',
    primaryPermission: 'registrations.read'
  },
  schools: {
    label: 'Schools',
    endpoint: '/api/v1/schools/',
    permissionModule: 'schools',
    primaryPermission: 'schools.read'
  },
  departments: {
    label: 'Departments',
    endpoint: '/api/v1/departments/',
    permissionModule: 'departments',
    primaryPermission: 'departments.read'
  },
  courses: {
    label: 'Courses',
    endpoint: '/api/v1/courses/',
    permissionModule: 'courses',
    primaryPermission: 'courses.read'
  },
  students: {
    label: 'Students',
    endpoint: '/api/v1/students/',
    permissionModule: 'students',
    primaryPermission: 'students.read'
  },
  facilitators: {
    label: 'Facilitators',
    endpoint: '/api/v1/facilitators/',
    permissionModule: 'facilitators',
    primaryPermission: 'facilitators.read'
  },
  elections: {
    label: 'Elections',
    endpoint: '/api/v1/elections/',
    permissionModule: 'elections',
    primaryPermission: 'elections.read'
  },
  partylists: {
    label: 'Partylists',
    endpoint: '/api/v1/partylists/',
    permissionModule: 'partylists',
    primaryPermission: 'partylists.read'
  },
  candidates: {
    label: 'Candidates',
    endpoint: '/api/v1/candidates/',
    permissionModule: 'candidates',
    primaryPermission: 'candidates.read'
  },
  votes: {
    label: 'Votes',
    endpoint: '/api/v1/votes/',
    permissionModule: 'votes',
    primaryPermission: 'votes.read'
  }
};
