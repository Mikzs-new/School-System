/**
 * src/renderer.jsx
 */

import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import {
  BookOpen,
  Building2,
  BarChart3,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  LogOut,
  School,
  ScrollText,
  UserCog,
  Vote
} from 'lucide-react';

import Login from './views/auth/LoginPage.jsx';
import Dashboard from './views/facilitator/DashboardPage.jsx';
import Elections from './views/facilitator/ElectionsPage.jsx';
import Candidates from './views/facilitator/CandidatesPage.jsx';
import Students from './views/facilitator/StudentsPage.jsx';
import Results from './views/facilitator/ResultsPage.jsx';

import { authStore } from './state/authStore.js';
import { hasPermission } from './state/permissionGuard.js';
import { logout } from './api/auth.js';

import ConnectionStatus from './components/ui/ConnectionStatus.jsx';
import StatusBanner from './components/ui/StatusBanner.jsx';
import { useConnectionStatus } from './hooks/useConnectionStatus.js';

import './styles/app.css';
import './styles/layout.css';

/* -------------------------------------------------------------------------- */
/* ROUTES */
/* -------------------------------------------------------------------------- */

const ROUTES = {
  dashboard: {
    label: 'Dashboard',
    icon: LayoutDashboard
  },

  elections: {
    label: 'Elections',
    icon: ScrollText,
    permission: 'elections.read',
    component: Elections
  },

  candidates: {
    label: 'Candidates',
    icon: UserCog,
    permission: 'candidates.read',
    component: Candidates
  },

  students: {
    label: 'Students',
    icon: GraduationCap,
    permission: 'students.read',
    component: Students
  },

  results: {
    label: 'Results',
    icon: BarChart3,
    permission: 'votes.read',
    component: Results
  }
};

const ROLE_ROUTES = {
  admin: [
    'dashboard',
    'elections',
    'candidates',
    'students',
    'results'
  ],

  facilitator: [
    'dashboard',
    'elections',
    'candidates',
    'students',
    'results'
  ],

  student: [
    'dashboard',
    'elections',
    'candidates'
  ]
};

/* -------------------------------------------------------------------------- */
/* APP */
/* -------------------------------------------------------------------------- */

function App() {
  const [authState, setAuthState] = useState(authStore.getState());
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    return authStore.subscribe(setAuthState);
  }, []);

  const user = useMemo(() => {
    return authState.user || {};
  }, [authState.user]);

  const visibleRoutes = ROLE_ROUTES[user.role] || ROLE_ROUTES.student;
  const activeRoute = ROUTES[activeView] || ROUTES.dashboard;
  const ActiveComponent = activeRoute.component;

  const userDisplayName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(' ') || user.username || 'Voter';

  const roleLabel = user.role === 'facilitator' ? 'Facilitator' : user.role || 'Student';

  const { connection, refreshConnection } = useConnectionStatus();

  /* ---------------------------------------------------------------------- */
  /* PERMISSION CHECK */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (activeRoute.permission && !hasPermission(user, activeRoute.permission)) {
      authStore.setNotice('Access denied');
      setActiveView('dashboard');
    }
  }, [activeView, activeRoute.permission, user]);

  /* ---------------------------------------------------------------------- */
  /* NAVIGATION */
  /* ---------------------------------------------------------------------- */

  function navigate(view) {
    authStore.clearNotice();

    const route = ROUTES[view];

    if (!route || (route.permission && !hasPermission(user, route.permission))) {
      authStore.setNotice('Access denied');
      setActiveView('dashboard');
      return;
    }

    setActiveView(view);
  }

  /* ---------------------------------------------------------------------- */
  /* LOGOUT */
  /* ---------------------------------------------------------------------- */

  function handleLogout() {
    logout();
    setActiveView('dashboard');
  }

  /* ---------------------------------------------------------------------- */
  /* LOGIN */
  /* ---------------------------------------------------------------------- */

  if (!authState.token) {
    return (
      <Login
        onAuthenticated={() => setActiveView('dashboard')}
      />
    );
  }

  /* ---------------------------------------------------------------------- */
  /* UI */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="app-shell">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-top">

          <div className="brand">

            <div className="brand-logo">
              SV
            </div>

            <div className="brand-text">
              <h2>Voting System</h2>
              <p>Election Operations</p>
            </div>

          </div>

          <div className="sidebar-section">

            <span className="sidebar-title">
              MAIN MENU
            </span>

            <nav
              className="nav-list"
              aria-label="Main navigation"
            >
              {visibleRoutes.map((key) => {
                const route = ROUTES[key];
                const Icon = route.icon;

                if (route.permission && !hasPermission(user, route.permission)) {
                  return null;
                }

                return (
                  <button
                    key={key}
                    type="button"
                    className={activeView === key ? 'nav-item active' : 'nav-item'}
                    onClick={() => navigate(key)}
                  >
                    <Icon size={18} />
                    <span>{route.label}</span>
                  </button>
                );
              })}
            </nav>

          </div>

        </div>

        {/* FOOTER */}

        <div className="sidebar-footer">

          <div className="profile-card">

            <div className="profile-avatar">
              {userDisplayName.charAt(0)}
            </div>

            <div>
              <strong>{userDisplayName}</strong>
              <p>{roleLabel}</p>
            </div>

          </div>

          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="content">

        {/* TOPBAR */}

        <header className="topbar">

          <div>
            <span className="eyebrow">
              Academic voting system
            </span>

            <h2>{activeRoute.label}</h2>
          </div>

          <div className="topbar-meta">

            <ConnectionStatus
              connection={connection}
              onRefresh={refreshConnection}
            />

            <BarChart3 size={18} />

            <span>
              {roleLabel} workspace
            </span>

          </div>

        </header>

        {/* STATUS */}

        <StatusBanner type="error">
          {authState.notice}
        </StatusBanner>

        {/* PAGE CONTENT */}

        <div className="page-container">

          {activeView === 'dashboard' ? (
            <Dashboard
              routes={ROUTES}
              user={user}
              visibleRouteKeys={visibleRoutes}
              onNavigate={navigate}
            />
          ) : ActiveComponent ? (
            <ActiveComponent user={user} />
          ) : null}

        </div>

      </main>

    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
