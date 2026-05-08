import React from 'react';
import { MODULES } from '../state/permissions.js';
import ModuleView from './ModuleView.jsx';

export default function Elections({ user }) {
  return <ModuleView moduleConfig={MODULES.elections} user={user} />;
}
