import React from 'react';
import { MODULES } from '../state/permissions.js';
import ModuleView from './ModuleView.jsx';

export default function Students({ user }) {
  return <ModuleView moduleConfig={MODULES.students} user={user} />;
}
