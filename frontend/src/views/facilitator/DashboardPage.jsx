import React from 'react';
import { hasPermission } from '../../state/permissionGuard.js';

export default function DashboardPage({ routes, user, visibleRouteKeys, onNavigate }) {
  const displayName = user?.full_name || [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ') || user?.username || 'User';
  const availableRoutes = visibleRouteKeys.filter((routeKey) => routeKey !== 'dashboard' && routes[routeKey]);
  const canUseOperations = user?.role === 'admin' || user?.role === 'facilitator';
  const roleLabel = user?.role === 'facilitator' ? 'Facilitator' : user?.role || 'Student';

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
          <span className="eyebrow">{roleLabel} access</span>
          <h2>{canUseOperations ? 'Operations dashboard' : 'Voting dashboard'}</h2>
          <p>
            {canUseOperations
              ? 'Monitor elections, validate records, and manage permitted academic voting modules.'
              : 'Review active election details and open the voting page when participation is available.'}
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