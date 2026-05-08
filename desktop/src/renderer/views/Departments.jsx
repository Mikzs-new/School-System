import React from 'react';
import { MODULES } from '../state/permissions.js';
import ModuleView from './ModuleView.jsx';

export default function Departments({ user }) {
  return <ModuleView moduleConfig={MODULES.departments} user={user} />;
}
