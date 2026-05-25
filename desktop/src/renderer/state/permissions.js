/**
 * src/renderer/state/permissions.js
 *
 * Role to permission map and module registry.
 *
 * Existing backend routes under /api/v1/:
 *   auth/profiles/student, auth/profiles/school_staff,
 *   election/candidates, election/partylists, election/elections,
 *   election/vote, election/votes, student/records, student/enroll.
 *
 * The backend currently does not expose school, department, or course routers.
 * Those modules stay visible by role, but API calls are disabled instead of
 * inventing desktop-only endpoints.
 */

export const ROLE_PERMISSIONS = {
  admin: ['*'],
  facilitator: [
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
  schools: {
    label: 'Schools',
    endpoint: null,
    permissionModule: 'schools',
    primaryPermission: 'schools.read'
  },
  departments: {
    label: 'Departments',
    endpoint: null,
    permissionModule: 'departments',
    primaryPermission: 'departments.read'
  },
  courses: {
    label: 'Courses',
    endpoint: null,
    permissionModule: 'courses',
    primaryPermission: 'courses.read'
  },
  students: {
    label: 'Students',
    endpoint: '/api/v1/student/records/',
    permissionModule: 'students',
    primaryPermission: 'students.read'
  },
  facilitators: {
    label: 'Facilitators',
    endpoint: '/api/v1/auth/profiles/school_staff/',
    permissionModule: 'facilitators',
    primaryPermission: 'facilitators.read'
  },
  elections: {
    label: 'Elections',
    endpoint: '/api/v1/election/elections/',
    permissionModule: 'elections',
    primaryPermission: 'elections.read'
  },
  partylists: {
    label: 'Partylists',
    endpoint: '/api/v1/election/partylists/',
    permissionModule: 'partylists',
    primaryPermission: 'partylists.read'
  },
  candidates: {
    label: 'Candidates',
    endpoint: '/api/v1/election/candidates/',
    permissionModule: 'candidates',
    primaryPermission: 'candidates.read'
  },
  votes: {
    label: 'Votes',
    endpoint: '/api/v1/election/votes/',
    permissionModule: 'votes',
    primaryPermission: 'votes.read'
  }
};
