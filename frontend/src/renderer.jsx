/**
 * src/renderer.jsx
 */

import React, { useEffect, useMemo, useState } from 'react';

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
import ForgotPasswordPage from './views/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './views/auth/ResetPasswordPage.jsx';
import Dashboard from './views/facilitator/DashboardPage.jsx';
import Elections from './views/facilitator/ElectionsPage.jsx';
import Candidates from './views/facilitator/CandidatesPage.jsx';
import Students from './views/facilitator/StudentsPage.jsx';
import ElectionDetail from './views/facilitator/ElectionDetailPage.jsx';

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
    label: 'Party Lists',
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

  'election-detail': {
    label: 'Election Detail',
    icon: ScrollText,
    permission: 'elections.read',
    component: ElectionDetail
  }
};

const ROLE_ROUTES = {
  admin: [
    'dashboard',
    'elections',
    'candidates',
    'students'
  ],

  facilitator: [
    'dashboard',
    'elections',
    'candidates',
    'students'
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
  const [authPage, setAuthPage] = useState('login');
  const [resetParams, setResetParams] = useState(null);
  const [selectedElectionId, setSelectedElectionId] = useState(null);

  useEffect(() => {
    return authStore.subscribe(setAuthState);
  }, []);

  useEffect(() => {
    // Check URL pathname for password reset parameters
    // Expected format: /password_reset/:uid/:token/
    const pathname = window.location.pathname;
    const resetPattern = /^\/password_reset\/([^\/]+)\/([^\/]+)\/?$/;
    const match = pathname.match(resetPattern);
    
    if (match) {
      const [, uid, token] = match;
      setResetParams({ uid, token });
      setAuthPage('reset');
    }
  }, []);

  const user = useMemo(() => {
    return authState.user || {};
  }, [authState.user]);

  const visibleRoutes = ROLE_ROUTES[user.role] || ROLE_ROUTES.student;
  const activeRoute = ROUTES[activeView] || ROUTES.dashboard;
  const ActiveComponent = activeRoute.component;

  const userDisplayName = user.full_name || [user.first_name, user.last_name]
    .filter(Boolean)
    .join(' ') || user.username || 'User';

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
  /* AUTH PAGE HANDLERS */
  /* ---------------------------------------------------------------------- */

  function handleForgotPassword() {
    setAuthPage('forgot');
  }

  function handleBackToLogin() {
    setAuthPage('login');
    setResetParams(null);
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  }

  function handleResetComplete() {
    setAuthPage('login');
    setResetParams(null);
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  }

  /* ELECTION DETAIL HANDLERS */

  function handleViewElection(election) {
    setSelectedElectionId(election.id);
    setActiveView('election-detail');
  }

  /* ---------------------------------------------------------------------- */
  /* LOGIN */
  /* ---------------------------------------------------------------------- */

  if (!authState.token) {
    if (authPage === 'forgot') {
      return (
        <ForgotPasswordPage onBack={handleBackToLogin} />
      );
    }
    
    if (authPage === 'reset' && resetParams) {
      return (
        <ResetPasswordPage
          uid={resetParams.uid}
          token={resetParams.token}
          onResetComplete={handleResetComplete}
        />
      );
    }
    
    return (
      <Login
        onAuthenticated={() => setActiveView('dashboard')}
        onForgotPassword={handleForgotPassword}
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
            <ActiveComponent 
              user={user}
              onViewElection={handleViewElection}
              electionId={selectedElectionId}
              onBack={() => setActiveView('elections')}
            />
          ) : null}

        </div>

      </main>

    </div>
  );
}

export default App;
