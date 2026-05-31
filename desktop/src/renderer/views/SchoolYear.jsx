import React from 'react';
import { MODULES } from '../state/permissions.js';
import ModuleView from './ModuleView.jsx';

export default function SchoolYear({ user }) {
  return <ModuleView moduleConfig={MODULES.school_year} user={user} />;
}
