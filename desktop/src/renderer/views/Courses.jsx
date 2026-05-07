import React from 'react';
import { MODULES } from '../state/permissions.js';
import ModuleView from './ModuleView.jsx';

export default function Courses({ user }) {
  return <ModuleView moduleConfig={MODULES.courses} user={user} />;
}
