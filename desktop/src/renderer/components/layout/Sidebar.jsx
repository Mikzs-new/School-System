import {
  FaChartPie,
  FaVoteYea,
  FaUsers,
  FaUserTie,
  FaCog,
} from "react-icons/fa";

import "./sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Voting System
      </div>

      <nav className="sidebar-nav">
        <a href="/dashboard" className="sidebar-item active">
          <FaChartPie />
          <span>Dashboard</span>
        </a>

        <a href="/elections" className="sidebar-item">
          <FaVoteYea />
          <span>Elections</span>
        </a>

        <a href="/students" className="sidebar-item">
          <FaUsers />
          <span>Students</span>
        </a>

        <a href="/facilitators" className="sidebar-item">
          <FaUserTie />
          <span>Facilitators</span>
        </a>

        <a href="/settings" className="sidebar-item">
          <FaCog />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;