import React from 'react';
import { MODULES } from '../state/permissions.js';
import ModuleView from './ModuleView.jsx';

export default function Partylist({ user }) {
  return <ModuleView moduleConfig={MODULES.partylists} user={user} />;
}
