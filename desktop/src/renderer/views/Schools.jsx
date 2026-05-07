import React from 'react';
import { MODULES } from '../state/permissions.js';
import ModuleView from './ModuleView.jsx';

export default function Schools({ user }) {
  return <ModuleView moduleConfig={MODULES.schools} user={user} />;
}
