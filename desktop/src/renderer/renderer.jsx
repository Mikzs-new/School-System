/**
 * src/renderer/renderer.jsx
 *
 * React app entry point.
 * Handles auth state, sidebar navigation, and role-based routing.
 *
 * Routes match the backend endpoints in api/urls.py exactly.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BookOpen,
  Building2,
  ClipboardList,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  ListChecks,
  LogOut,
  School,
  ScrollText,
  UserCog,
  UsersRound,
  Vote
} from 'lucide-react';

import Login          from './views/Login.jsx';
import Dashboard      from './views/Dashboard.jsx';
import Voting         from './views/Voting.jsx';
import Students       from './views/Students.jsx';
import Candidates     from './views/Candidates.jsx';
import Partylist      from './views/Partylist.jsx';
import Elections      from './views/Elections.jsx';
import Facilitators   from './views/Facilitators.jsx';
import Departments    from './views/Departments.jsx';
import Courses        from './views/Courses.jsx';
import Schools        from './views/Schools.jsx';
import Votes          from './views/Votes.jsx';

import { authStore }      from './state/authStore.js';
import { hasPermission }  from './state/permissionGuard.js';
import { logout }         from './api/auth.js';
import '../styles/app.css';

// ── Route registry ────────────────────────────────────────────────────────────
// All module routes map 1-to-1 with the backend DRF endpoints in api/urls.py

const ROUTES = {
  dashboard:    { label: 'Dashboard',    icon: LayoutDashboard },
  schools:      { label: 'Schools',      icon: School,         permission: 'schools.read',       component: Schools },
  departments:  { label: 'Departments',  icon: Building2,      permission: 'departments.read',   component: Departments },
  courses:      { label: 'Courses',      icon: BookOpen,       permission: 'courses.read',       component: Courses },
  students:     { label: 'Students',     icon: GraduationCap,  permission: 'students.read',      component: Students },
  facilitators: { label: 'Facilitators', icon: UserCog,        permission: 'facilitators.read',  component: Facilitators },
  elections:    { label: 'Elections',    icon: ScrollText,     permission: 'elections.read',     component: Elections },
  partylists:   { label: 'Partylists',   icon: ListChecks,     permission: 'partylists.read',    component: Partylist },
  candidates:   { label: 'Candidates',   icon: UsersRound,     permission: 'candidates.read',    component: Candidates },
  votes:        { label: 'Votes',        icon: Landmark,       permission: 'votes.read',         component: Votes },
  voting:       { label: 'Voting',       icon: Vote,           permission: 'vote.cast',          component: Voting }
};

const ROLE_ROUTES = {
  admin: [
    'dashboard', 'schools', 'departments', 'courses', 'students',
    'facilitators', 'elections', 'partylists', 'candidates', 'votes', 'voting'
  ],
  staff: [
    'dashboard', 'schools', 'departments', 'courses', 'students',
    'facilitators', 'elections', 'partylists', 'candidates', 'votes'
  ],
  student: ['dashboard', 'candidates', 'partylists', 'elections', 'voting']
};

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  const [authState, setAuthState]   = useState(authStore.getState());
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => authStore.subscribe(setAuthState), []);

  const user          = useMemo(() => authState.user || {}, [authState.user]);
  const visibleRoutes = ROLE_ROUTES[user.role] || ROLE_ROUTES.student;
  const activeRoute   = ROUTES[activeView] || ROUTES.dashboard;
  const ActiveComponent = activeRoute.component;

  // Redirect if permission is revoked mid-session
  useEffect(() => {
    if (activeRoute.permission && !hasPermission(user, activeRoute.permission)) {
      authStore.setNotice('Access denied');
      setActiveView('dashboard');
    }
  }, [activeView, activeRoute.permission, user]);

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

  function handleLogout() {
    logout();
    setActiveView('dashboard');
  }

  if (!authState.token) {
    return <Login onAuthenticated={() => setActiveView('dashboard')} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SV</span>
          <div>
            <strong>School Voting</strong>
            <span>Desktop</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {visibleRoutes.map((key) => {
            const route = ROUTES[key];
            const Icon  = route.icon;
            if (route.permission && !hasPermission(user, route.permission)) return null;
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

        <div className="sidebar-footer">
          <div className="signed-in">
            <span>Signed in as</span>
            <strong>{user.username || user.name || 'Voter'}</strong>
            <span>{user.role || 'student'}</span>
          </div>
          <button className="logout-button" type="button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="content">
        {authState.notice && (
          <div className="status-banner error page-notice">{authState.notice}</div>
        )}
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
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
