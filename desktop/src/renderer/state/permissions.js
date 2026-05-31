/**
 * src/renderer/state/permissions.js
 */

export const ROLE_PERMISSIONS = {

  /* ADMIN */

  admin: [
    '*'
  ],

  /* FACILITATOR */

  facilitator: [

    'students.read',
    'students.create',
    'students.update',
    'students.delete',

    'candidates.read',
    'candidates.create',
    'candidates.update',
    'candidates.delete',

    'partylists.read',
    'partylists.create',
    'partylists.update',
    'partylists.delete',

    'courses.read',
    'courses.create',
    'courses.update',
    'courses.delete',

    'departments.read',
    'departments.create',
    'departments.update',
    'departments.delete',

    'elections.read',
    'elections.create',
    'elections.update',
    'elections.delete',

    'facilitators.read',

    'votes.read',

    'school_year.read',
    'school_year.create',
    'school_year.update'


  ],

  /* STUDENT */

  student: [

    'candidates.read',

    'partylists.read',

    'elections.read'

  ]
};

export const MODULES = {

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
  },

  courses: {
    label: 'Courses',
    endpoint: '/api/v1/courses/',
    permissionModule: 'courses',
    primaryPermission: 'courses.read'
  },

  departments: {
    label: 'Departments',
    endpoint: '/api/v1/departments/',
    permissionModule: 'departments',
    primaryPermission: 'departments.read'
  },

  school_year: {
    label: 'School Year',
    endpoint: '/api/v1/school/school_year/',
    permissionModule: 'school_year',
    primaryPermission: 'school_year.read'
  }
};