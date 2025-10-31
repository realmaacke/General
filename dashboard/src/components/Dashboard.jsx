import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/dashboard.css";
import { Tv, Database, LayoutDashboard, Server, Monitor, Settings, User, Mail, Upload} from "lucide-react"; // optional icons

const Dashboard = () => {
  const cards = [
    { title: "TV", icon: <Tv size={40} />, url: "https://tv.petterssonhome.se" },
    { title: "Database", icon: <Database size={40} />, url: "https://db.petterssonhome.se" },
    { title: "API", icon: <Server size={40} />, url: "https://api.petterssonhome.se" },
    { title: "Monitor", icon: <Monitor size={40} />, url: "#" },
    { title: "Settings", icon: <Settings size={40} />, url: "#" },
    { title: "Accounts", icon: <User size={40} />, url: "#" },
    { title: "Email", icon: <Mail size={40} />, url: "#" },
    { title: "CDN", icon: <Upload size={40} />, url: "#" },
    { title: "Dashboard", icon: <LayoutDashboard size={40} />, url: "https://petterssonhome.se" },
  ];

  const handleClick = (url) => {
    window.location.href = url;
  };

  return (
    <div className="container py-5">
      <h1 className="text-center fw-bold mb-5">Dashboard</h1>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {cards.map((card, index) => (
          <div key={index} className="col">
            <div
              className="dashboard-card text-center p-4 rounded shadow-sm h-100"
              onClick={() => handleClick(card.url)}
              role="button"
            >
              <div className="mb-3 text-primary">{card.icon}</div>
              <h5 className="fw-semibold mb-2">{card.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
