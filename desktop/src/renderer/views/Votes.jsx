import React from 'react';
import { MODULES } from '../state/permissions.js';
import ModuleView from './ModuleView.jsx';

export default function Votes({ user }) {
  return <ModuleView moduleConfig={MODULES.votes} user={user} />;
}
