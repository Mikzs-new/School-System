import React from 'react';
import { MODULES } from '../state/permissions.js';
import ModuleView from './ModuleView.jsx';

export default function Candidates({ user }) {
  return <ModuleView moduleConfig={MODULES.candidates} user={user} />;
}
