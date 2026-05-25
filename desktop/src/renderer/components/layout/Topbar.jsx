import "./topbar.css";

function Topbar() {
  return (
    <header className="topbar">
      <div>
        <h2>Election Operations Center</h2>
      </div>

      <div className="connection-status">
        <span className="status-dot"></span>
        Connected
      </div>
    </header>
  );
}

export default Topbar;