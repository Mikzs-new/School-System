/**
 * src/state/permissions.js
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

    'votes.read'


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
    endpoint: '/student/records/',
    permissionModule: 'students',
    primaryPermission: 'students.read'
  },

  facilitators: {
    label: 'Facilitators',
    endpoint: '/auth/profiles/school_staff/',
    permissionModule: 'facilitators',
    primaryPermission: 'facilitators.read'
  },

  elections: {
    label: 'Elections',
    endpoint: '/election/elections/',
    permissionModule: 'elections',
    primaryPermission: 'elections.read'
  },

  partylists: {
    label: 'Partylists',
    endpoint: '/election/partylists/',
    permissionModule: 'partylists',
    primaryPermission: 'partylists.read'
  },

  candidates: {
    label: 'Party Lists',
    endpoint: '/election/candidates/',
    permissionModule: 'candidates',
    primaryPermission: 'candidates.read'
  },

  votes: {
    label: 'Votes',
    endpoint: '/election/votes/',
    permissionModule: 'votes',
    primaryPermission: 'votes.read'
  },

  courses: {
    label: 'Courses',
    endpoint: '/courses/',
    permissionModule: 'courses',
    primaryPermission: 'courses.read'
  },

  departments: {
    label: 'Departments',
    endpoint: '/departments/',
    permissionModule: 'departments',
    primaryPermission: 'departments.read'
  }
};
