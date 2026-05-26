import AppLayout from "../components/layout/AppLayout";
import "./dashboard.css";

function DashboardPage() {
  return (
    <AppLayout>
      <div className="dashboard-grid">

        <div className="stats-card">
          <h3>Total Voters</h3>
          <h1>1,250</h1>
        </div>

        <div className="stats-card">
          <h3>Active Elections</h3>
          <h1>3</h1>
        </div>

        <div className="stats-card">
          <h3>Votes Today</h3>
          <h1>845</h1>
        </div>

        <div className="stats-card">
          <h3>Turnout</h3>
          <h1>78%</h1>
        </div>

      </div>

      <div className="activity-card">
        <h2>Recent Activity</h2>

        <div className="activity-item">
          Election 2026 started
        </div>

        <div className="activity-item">
          Student voted successfully
        </div>

        <div className="activity-item">
          Facilitator logged in
        </div>
      </div>
    </AppLayout>
  );
}

export default DashboardPage;