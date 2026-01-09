import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/dashboard.css";
import { Tv, Database, Ruler, LayoutDashboard, Server, Monitor, Settings, User, Mail, Upload } from "lucide-react"; // optional icons

const Dashboard = () => {
  const cards = [
    { status: "(Development)", title: "TV", icon: <Tv size={40} />, url: "https://tv.petterssonhome.se" },
    { status: "(Sandbox)", title: "Database", icon: <Database size={40} />, url: "https://db.petterssonhome.se" },
    { status: "(Development)", title: "API", icon: <Server size={40} />, url: "https://api.petterssonhome.se" },
    { status: "", title: "Monitor", icon: <Monitor size={40} />, url: "https://grafana.petterssonhome.se/d/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m" },
    { status: "(Comming soon)", title: "Settings", icon: <Settings size={40} />, url: "#" },
    { status: "", title: "SonarCube", icon: <Ruler size={40} />, url: "http://sonarqube.petterssonhome.se" },
    { status: "(Comming soon)", title: "Accounts", icon: <User size={40} />, url: "#" },
    { status: "(Comming soon)", title: "Email", icon: <Mail size={40} />, url: "#" },
    { status: "(Development)", title: "CDN", icon: <Upload size={40} />, url: "https://cdn.petterssonhome.se" },
  ];

  const handleClick = (url) => {
    window.location.href = url;
  };

  return (
    <div className="container py-5">
      <h1 className="text-center fw-bold mb-5">General</h1>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {cards.map((card, index) => (
          <div key={index} className="col">
            <div
              className="dashboard-card text-center p-4 rounded shadow-sm h-100"
              onClick={() => handleClick(card.url)}
              role="button"
            >
              <div className="mb-3 text-primary">{card.icon}</div>
              <h5 className="fw-semibold mb-2">{card.title} {card.status}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
