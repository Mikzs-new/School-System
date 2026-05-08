import React from 'react';
import { hasPermission } from '../state/permissionGuard.js';

export default function Dashboard({ routes, user, visibleRouteKeys, onNavigate }) {
  const displayName = user?.name || user?.full_name || user?.username || 'Voter';
  const availableRoutes = visibleRouteKeys.filter((routeKey) => routeKey !== 'dashboard' && routes[routeKey]);
  const canUseOperations = user?.role === 'admin' || user?.role === 'staff';

  return (
    <section className="page-stack" aria-labelledby="dashboard-title">
      <header className="page-header">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1 id="dashboard-title">Welcome, {displayName}</h1>
        </div>
        {hasPermission(user, 'vote.cast') ? (
          <button className="primary-button" type="button" onClick={() => onNavigate('voting')}>
            <span>Open ballot</span>
          </button>
        ) : (
          <button className="primary-button" type="button" onClick={() => onNavigate(availableRoutes[0] || 'dashboard')}>
            <span>Open module</span>
          </button>
        )}
      </header>

      <div className="dashboard-band">
        <div>
          <h2>{canUseOperations ? 'Admin session' : 'Voting session'}</h2>
          <p>
            {canUseOperations
              ? 'Choose a module from the menu.'
              : 'Use the voting screen to submit your vote.'}
          </p>
        </div>
      </div>

      <div className="option-grid">
        {availableRoutes.map((routeKey) => {
          const route = routes[routeKey];
          return (
            <button className="option-card" key={routeKey} type="button" onClick={() => onNavigate(routeKey)}>
              <span>
                <strong>{route.label}</strong>
                <small>{route.permission ? route.permission : 'Open section'}</small>
              </span>
            </button>
          );
        })}
        {!availableRoutes.length ? (
          <div className="option-card">
            <span>
              <strong>No modules available</strong>
              <small>Access denied for all desktop modules.</small>
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
